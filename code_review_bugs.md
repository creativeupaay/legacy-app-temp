# Code Review — Legacy App: Bugs & Issues

> Full end-to-end review of `/server` and `/client` source code.

---

## 🔴 Critical / High Severity

### 1. `protect()` middleware throws synchronously inside an Express middleware — not caught by `asyncHandler`

**File:** [`auth.middleware.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/modules/auth/middlewares/auth.middleware.ts#L32)

```ts
// Line 32
throw new AppError("Not authorized - No token provided", 401);
```

The `protect()` function returns a **synchronous** middleware (not wrapped in `asyncHandler`). When it `throw`s, Express **does not catch it** unless you're on Express 5 (which you're not using). On Express 4 this causes an **unhandled exception** that crashes the process instead of sending a 401.

**Fix:** Wrap the inner function body in `try/catch` and call `next(err)`, or replace with:
```ts
if (!token) return next(new AppError("Not authorized - No token provided", 401));
if (!decoded) return next(new AppError("Not authorized - Invalid or expired token", 401));
```

---

### 2. `createContact` silently creates a ghost `AuthUser` record for every unknown email

**File:** [`userSharing.controller.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/modules/userSharing/controllers/userSharing.controller.ts#L57-L66)

```ts
// Lines 57-66
let recipientUser = await AuthUser.findOne({ email: normalizedEmail });
if (!recipientUser) {
  recipientUser = await AuthUser.create({
    email: normalizedEmail,
    hasOnboarded: false,
    isVerified: false,
    ...
  });
}
```

Any authenticated user can add any email as a contact, which **creates an `AuthUser` document** for that email. Those ghost users:
- Will be checked by the auth system (`isActive`, etc.)
- Have no OTP flow but appear in the database
- Can become "active" if the real person later signs up, potentially linking someone else's data

**Fix:** Store only the email in `UserSharing` without creating an `AuthUser` stub. Resolve `recipientUserId` lazily when the email actually registers.

---

### 3. `requestOtpService` logs the OTP plaintext to the console

**File:** [`auth.service.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/modules/auth/services/auth.service.ts#L26)

```ts
// Line 26 — visible in production logs
console.log(`[OTP] ${normalizedEmail} -> ${otp}`);
```

This is noted as a placeholder but **is still present in the codebase**. In any environment where logs are collected (Datadog, CloudWatch, Render logs, etc.) OTPs are leaked. This is a **security vulnerability**.

**Fix:** Remove this line and integrate a real email service. Until then at minimum guard it:
```ts
if (env.NODE_ENV === "development") {
  console.log(`[OTP] ${normalizedEmail} -> ${otp}`);
}
```

---

### 4. `OTP_JWT_SECRET` falls back to a hardcoded string if not set

**File:** [`otp.utils.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/modules/auth/utils/otp.utils.ts#L31)

```ts
// Line 31 — hardcoded fallback secret
const secret = process.env.OTP_JWT_SECRET || "default_otp_jwt_secret_dev_only";
```

Unlike other secrets (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`) which are validated by `env.config.ts` using Zod, `OTP_JWT_SECRET` is **not validated**. If it is absent in production, the hardcoded string is used silently, making OTP tokens forgeable by anyone who reads the source code.

**Fix:** Add `OTP_JWT_SECRET` to `envSchema` in [`env.config.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/config/env.config.ts) with the same `min(32)` enforcement.

---

### 5. Operator precedence bug in duplicate key check

**File:** [`userSharing.controller.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/modules/userSharing/controllers/userSharing.controller.ts#L85)

```ts
// Line 85 — missing parentheses; `&&` binds tighter than `||`
if (err.code === 11000 || err.name === "MongoServerError" && err.message?.includes("E11000")) {
```

Due to operator precedence, this is evaluated as:
```ts
if (err.code === 11000 || (err.name === "MongoServerError" && err.message?.includes("E11000")))
```
which is likely the *intended* behavior, but the condition is **redundant and misleading**. When `err.code === 11000`, `err.name` is always `"MongoServerError"` anyway. But if any future error has `code === 11000` for a non-duplicate reason, it'll still be caught here.

**Fix:**
```ts
if (err.code === 11000) {
  throw new AppError("You've already added this contact", 409);
}
```

---

## 🟠 Medium Severity

### 6. Streak calculation mixes local date strings with UTC dates — off-by-one on timezones

**File:** [`profile.service.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/modules/profile/services/profile.service.ts#L92-L146)

```ts
// Line 94 — creates local-time date strings (server timezone dependent)
const d = new Date(doc.entryDate);
return `${d.getFullYear()}-${String(d.getMonth() + 1)...}`;

// Line 138 — switches to UTC for comparison
const expectedStr = `${expectedPrevDate.getUTCFullYear()}-...${expectedPrevDate.getUTCDate()}...`;
```

The unique-day deduplication (lines 92-96) uses **local time** (`getFullYear`, `getMonth`, `getDate`), while the streak comparison loop (line 138) uses **UTC** (`getUTCFullYear`, `getUTCDate`). This inconsistency can cause entries to be treated as different days or the same day depending on server timezone.

**Fix:** Use UTC consistently everywhere in this function.

---

### 7. `isNewUser` flag is incorrect for returning users who haven't completed onboarding

**File:** [`auth.service.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/modules/auth/services/auth.service.ts#L55)

```ts
// Line 55
const isNewUser = !user || !user.hasOnboarded;
```

A **returning user** (has logged in before but never completed onboarding) will always get `isNewUser = true` and be redirected to `/onboarding`. This is possibly the intended behavior, but it means:
- The response message says "Account created successfully" for a returning user on line 54
- `isNewUser` in the frontend (`authSlice.ts`) is used to determine navigation and messaging

**Fix:** Separate the two concerns:
```ts
const isNewUser = !user; // truly brand-new
const needsOnboarding = !user?.hasOnboarded;
```
and return both to give the client accurate information.

---

### 8. `AuthWrapper` private route check uses `isError` from a stale RTK Query — race condition

**File:** [`AuthWrapper.tsx`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/client/src/features/auth/components/AuthWrapper.tsx#L57-L59)

```tsx
// Line 58
if (!isAuthenticated || isError) {
  return <Navigate to={redirectPath} .../>
}
```

`isError` from `useGetCurrentUserQuery` is `true` on any network error (not just 401). If the server has a momentary glitch, the user gets **forcibly logged out** even if their session is valid. This can result in session loss from a temporary DNS or timeout error.

**Fix:** Only treat 401/403 errors as auth failures. Check `error?.status === 401` instead of `isError`.

---

### 9. `deleteFolder` action is not validated before issuing a default operation

**File:** [`journalFolder.controller.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/modules/journalFolder/controllers/journalFolder.controller.ts#L222-L229)

```ts
// Lines 222-229
if (action === "move_to_all_entries" || action === "move") {
  await Journal.updateMany(...);
} else if (action === "delete_all") {
  await Journal.deleteMany(...);
}
// If action is anything else, silently falls through and just deletes the folder
// leaving orphaned journals with dangling folderId references
await JournalFolder.deleteOne(...);
```

If an invalid or missing `action` is provided, the folder is **deleted but the journals are left orphaned** with a dangling `folderId` reference. The Zod validator (`deleteFolderSchema`) does enforce `action`, but there's no defensive fallback in the controller.

**Fix:** Add an `else` clause that throws an error or at minimum moves journals to "all entries" by default.

---

### 10. `updateEntrySchema` refine check fails silently for partial update

**File:** [`journal.validator.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/modules/journal/validators/journal.validator.ts#L33-L35)

```ts
// Line 33
.refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided to update",
});
```

With Zod, `.optional()` fields are **omitted** from the parsed output only if they're not present in the input. If a client sends `{}`, this refine correctly rejects it. However, if a client sends `{ folderId: null }` (which is valid), `Object.keys` will return `['folderId']` and the refine passes — so that's fine. But this doesn't guard against sending an entirely empty meaningful update which might be intentional edge case.

More importantly: the same pattern in `updateFolderSchema` has the same issue. Since all fields are `.optional()`, an empty object `{}` passes all field validators but should be rejected by the refine. This works, but only the refine message is exposed — not which field is missing. It's a UX issue.

---

### 11. `createEntry` in journalApi does an optimistic cache update only for the default query (undefined args)

**File:** [`journalApi.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/client/src/features/journal/api/journalApi.ts#L49-L58)

```ts
// Line 53 — only updates cache for the "undefined" params variant
dispatch(
  journalApi.util.updateQueryData("getJournalEntries", undefined, (draft) => {
    draft.unshift(newEntry);
  })
);
```

`getJournalEntriesQuery` is also called with `params` (folderId, privacy filters) from some components. The optimistic update only patches the cache for the `undefined` (no params) call. This means folder-filtered views will not reflect the new entry instantly until refetch.

---

### 12. Regex injection possible in folder duplicate-check

**File:** [`journalFolder.controller.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/modules/journalFolder/controllers/journalFolder.controller.ts#L40)

```ts
// Line 40 — user-supplied `name` directly interpolated into regex
name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
```

If a folder name contains regex metacharacters (e.g. `(`, `[`, `*`, `+`), this will either throw a "Invalid regular expression" error or match unintended names. This is a **ReDoS / unexpected behavior** risk.

**Fix:** Escape the string before building the regex:
```ts
const escaped = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
name: { $regex: new RegExp(`^${escaped}$`, "i") }
```
The same issue exists in `updateFolder`.

---

### 13. `isSaving` state is never reset to `false` on success in `handleUpdate`

**File:** [`useJournalDialogs.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/client/src/features/journal/hooks/useJournalDialogs.ts#L37-L59)

```ts
// Lines 40-58
setIsSaving(true);
try {
  await updateEntry(...).unwrap();
  setShowUpdateDialog(false);
  navigate("/journal", { replace: true });
  // ← isSaving is never set back to false before navigate
} catch {
  alert("...");
  setIsSaving(false); // only reset on error
}
```

On success, the component navigates away without resetting `isSaving`. While this doesn't cause a visible bug in the current flow (component unmounts), if the component is ever reused without unmounting or the navigation doesn't fully unmount the page, the button remains disabled permanently.

**Fix:** Add `setIsSaving(false)` before or after navigate in the success path, or use a `finally` block.

---

### 14. `AuthFlow` renders `navigate()` inside render — not in an effect

**File:** [`AuthFlow.tsx`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/client/src/features/auth/components/AuthFlow.tsx#L18-L25)

```tsx
// Lines 18-25 — navigation called directly during render
if (isAuthenticated) {
  if (isNewUser) {
    navigate("/onboarding", { replace: true });
  } else {
    navigate("/home", { replace: true });
  }
  return null;
}
```

Calling `navigate()` during render is a **React anti-pattern** that can cause "Cannot update a component while rendering a different component" warnings and subtle bugs. The correct approach is either a `<Navigate>` component or wrapping in a `useEffect`.

**Fix:**
```tsx
if (isAuthenticated) {
  return <Navigate to={isNewUser ? "/onboarding" : "/home"} replace />;
}
```

---

### 15. Client-side search is done in memory — fetches all journal entries every time

**File:** [`JournalPage.tsx`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/client/src/pages/journal/JournalPage.tsx#L85)

```tsx
// Line 85 — fetches ALL entries with no params
const { data: entries = [], isLoading } = useGetJournalEntriesQuery();
```

Then filtering is done client-side (lines 125-160). As the user's journal grows (potentially thousands of entries), this will:
- Cause large API responses
- Filter/search in memory on every keystroke
- Show wrong `total` count in pagination (server returns all, but only filtered are shown)

The API already supports `privacy`, `folderId`, `page`, `limit` params. The client should pass at least folder/privacy filters as query params.

---

### 16. `completeOnboardingSchema` is defined but never actually used to validate the route body

**File:** [`auth.validator.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/modules/auth/validators/auth.validator.ts#L27) + [`auth.routes.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/modules/auth/routes/auth.routes.ts#L52)

```ts
// validator.ts — schema exists
export const completeOnboardingSchema = z.object({}).strict();

// routes.ts — validate middleware is NOT applied for this route
router.post("/complete-onboarding", protect(), completeOnboarding);
```

The schema is defined but the `validate(completeOnboardingSchema)` middleware is not applied. While this currently has no security impact (empty body expected), it's an inconsistency that could cause confusion.

---

### 17. `StatsBlock` computes word count from ALL journal entries fetched via API — potential performance issue

**File:** [`StatsBlock.tsx`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/client/src/features/home/components/StatsBlock.tsx#L8-L29)

```tsx
// Line 8 — fetches all entries just to count words
const { data: journals } = useGetJournalEntriesQuery();

const totalWords = journals?.reduce((acc, journal) => {
  // parses HTML for each entry
  const doc = new DOMParser().parseFromString(journal.textBody, "text/html");
  ...
}, 0) || 0;
```

This fires an extra API call (or deduplicates with the same cache key from JournalPage) and parses HTML for every single entry on the Home screen. With many entries this is slow and wastes bandwidth. The word count should be computed on the server and included in profile insights.

---

### 18. No CSRF protection on state-mutating cookie-based routes

**File:** [`index.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/index.ts) + all routes

The server uses `httpOnly` cookies for auth (`sameSite: "lax"`). `SameSite=Lax` does NOT protect `POST` requests made from cross-origin sites via forms or fetch with `credentials: 'include'`. Since all state-mutating routes (`POST /journal`, `PATCH /journal/:id`, `DELETE /journal/:id`, etc.) rely solely on cookie auth, they're potentially vulnerable to CSRF.

**Fix:** Add a CSRF token validation (e.g., `csurf` or double-submit cookie pattern), or change `sameSite` to `"strict"`.

---

## 🟡 Low Severity / Code Quality

### 19. Duplicate route definitions for profile GET/PATCH/PUT

**File:** [`profile.routes.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/modules/profile/routes/profile.routes.ts#L18-L25)

```ts
router.get("/", getProfile);
router.get("/me", getProfile);   // duplicate

router.patch("/", ...updateProfile);
router.put("/", ...updateProfile);
router.patch("/me", ...updateProfile);  // triplicate
router.put("/me", ...updateProfile);    // triplicate
```

This is API surface bloat. Pick one canonical URL (`/me`) and remove the aliases, or redirect.

---

### 20. `isNewUser` in `authSlice` is never reset on `getCurrentUser` success

**File:** [`authSlice.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/client/src/features/auth/authSlice.ts#L62-L74)

```ts
// Lines 62-74 — getCurrentUser does not reset isNewUser
builder.addMatcher(
  authApi.endpoints.getCurrentUser.matchFulfilled,
  (state, action) => {
    if (action.payload.data?.user) {
      state.user = action.payload.data.user;
      state.isAuthenticated = true;
    }
    state.isLoading = false;
    // ← isNewUser is untouched; stays as whatever it was from OTP verify
  }
);
```

On page reload, `isNewUser` will be whatever it was previously (or `null`), while the user data comes fresh from the server. The redirect logic in `AuthFlow.tsx` depends on `isNewUser`, which could be stale.

---

### 21. `handleUpdate` dialog "Update to Today" indicator is wrong — both buttons show `isSaving` only on button 2

**File:** [`JournalWriteDialogs.tsx`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/client/src/features/journal/components/JournalWriteDialogs.tsx#L87)

```tsx
// Line 87 — only "Update to Today" shows saving state text
{isSaving ? "Saving…" : "Update to Today"}
```

But the `isSaving` state affects **both** buttons (both are disabled when `isSaving`). So clicking "Keep Original Date" also sets `isSaving=true` but the button still reads "Keep Original Date" with no indication it's saving.

---

### 22. `entries.map(toEntryResponse)` on `lean()` result — types will be incorrect

**File:** [`journal.controller.ts`](file:///Users/amitsunda/Desktop/Code/CU/Legacy-App/server/src/modules/journal/controllers/journal.controller.ts#L99)

```ts
// Line 99 — lean() returns plain JS objects, not Mongoose documents
.lean<IJournalEntryDocument[]>()
```

The `toEntryResponse` function accesses `doc._id.toString()` and `doc.folderId?.toString()`. When using `.lean()`, `_id` is a raw BSON `ObjectId` and `.toString()` will work. However `doc.sharedWith.map((id) => id.toString())` also relies on each element being an `ObjectId`. If a document was stored with a string `sharedWith`, `.toString()` will be a no-op but the TypeScript cast is misleading. 

The deeper issue is that the type assertion `lean<IJournalEntryDocument[]>()` is incorrect — `lean()` returns plain objects (not Mongoose Documents). The correct type would be `lean<IJournalEntry[]>()`.

---

## Summary Table

| # | Severity | File | Issue |
|---|----------|------|-------|
| 1 | 🔴 Critical | `auth.middleware.ts` | `throw` in sync middleware — not caught by Express 4 |
| 2 | 🔴 Critical | `userSharing.controller.ts` | Creates ghost `AuthUser` on every new contact email |
| 3 | 🔴 Critical | `auth.service.ts` | OTP plaintext logged to console in production |
| 4 | 🔴 Critical | `otp.utils.ts` | `OTP_JWT_SECRET` falls back to hardcoded string |
| 5 | 🟠 High | `userSharing.controller.ts` | Operator precedence bug in duplicate key check |
| 6 | 🟠 High | `profile.service.ts` | Streak uses local time vs UTC — off-by-one on timezone |
| 7 | 🟠 Medium | `auth.service.ts` | `isNewUser` flag incorrect for returning unboarded users |
| 8 | 🟠 Medium | `AuthWrapper.tsx` | Any network error triggers logout (stale `isError` check) |
| 9 | 🟠 Medium | `journalFolder.controller.ts` | Invalid `action` on delete leaves orphaned journals |
| 10 | 🟡 Medium | `journal.validator.ts` | Empty partial update passes validation silently |
| 11 | 🟡 Medium | `journalApi.ts` | Optimistic update misses filtered query cache variants |
| 12 | 🟠 Medium | `journalFolder.controller.ts` | Regex injection in folder name duplicate check |
| 13 | 🟡 Medium | `useJournalDialogs.ts` | `isSaving` never reset on success |
| 14 | 🟠 Medium | `AuthFlow.tsx` | `navigate()` called during render (React anti-pattern) |
| 15 | 🟡 Low | `JournalPage.tsx` | All entries fetched then filtered in memory |
| 16 | 🟡 Low | `auth.routes.ts` | `completeOnboardingSchema` defined but not used |
| 17 | 🟡 Low | `StatsBlock.tsx` | Word count computed client-side over all entries |
| 18 | 🟠 Medium | `index.ts` + routes | No CSRF protection on cookie-authenticated mutations |
| 19 | 🟡 Low | `profile.routes.ts` | Duplicate/redundant route definitions |
| 20 | 🟡 Low | `authSlice.ts` | `isNewUser` not reset on page reload |
| 21 | 🟡 Low | `JournalWriteDialogs.tsx` | Saving indicator missing on "Keep Original Date" button |
| 22 | 🟡 Low | `journal.controller.ts` | `lean<IJournalEntryDocument[]>()` — incorrect generic type |
