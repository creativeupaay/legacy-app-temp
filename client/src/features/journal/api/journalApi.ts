import { baseApi } from "@/app/baseApi";
import type {
  IJournalEntry,
  ICreateEntryRequest,
  IUpdateEntryRequest,
  IListEntriesResponse,
  ISingleEntryResponse,
} from "../types/journal.types";
import type {
  IContact,
  ICreateContactRequest,
  IListContactsResponse,
  ISingleContactResponse,
} from "../types/contacts.types";

export const journalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Journal Endpoints
    getJournalEntries: builder.query<IJournalEntry[], void | { privacy?: string }>({
      query: (params) => ({
        url: "/journal",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (response: IListEntriesResponse) => response.data?.entries || [],
      providesTags: ["Journal"],
    }),

    getJournalById: builder.query<IJournalEntry, string>({
      query: (id) => ({
        url: `/journal/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ISingleEntryResponse) => response.data.entry,
      providesTags: (_result, _error, id) => [{ type: "Journal", id }],
    }),

    createJournalEntry: builder.mutation<IJournalEntry, ICreateEntryRequest>({
      query: (data) => ({
        url: "/journal",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ISingleEntryResponse) => response.data.entry,
      invalidatesTags: ["Journal", "Insights"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newEntry } = await queryFulfilled;
          dispatch(
            journalApi.util.updateQueryData("getJournalEntries", undefined, (draft) => {
              // Immediately prepend the new journal to the top of the timeline
              draft.unshift(newEntry);
            })
          );
        } catch {
          // Handled by invalidatesTags / standard error handling
        }
      },
    }),

    updateJournalEntry: builder.mutation<
      IJournalEntry,
      { id: string; data: IUpdateEntryRequest }
    >({
      query: ({ id, data }) => ({
        url: `/journal/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: ISingleEntryResponse) => response.data.entry,
      invalidatesTags: (_result, _error, { id }) => [
        "Journal",
        "Insights",
        { type: "Journal", id },
      ],
    }),

    deleteJournalEntry: builder.mutation<void, string>({
      query: (id) => ({
        url: `/journal/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Journal", "Insights"],
    }),

    // Contacts (UserSharing) Endpoints
    getContacts: builder.query<IContact[], void>({
      query: () => ({
        url: "/contacts",
        method: "GET",
      }),
      transformResponse: (response: IListContactsResponse) => response.data?.contacts || [],
      providesTags: ["Contacts"],
    }),

    createContact: builder.mutation<IContact, ICreateContactRequest>({
      query: (data) => ({
        url: "/contacts",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ISingleContactResponse) => response.data.contact,
      invalidatesTags: ["Contacts", "Insights"],
    }),
  }),
});

export const {
  useGetJournalEntriesQuery,
  useGetJournalByIdQuery,
  useCreateJournalEntryMutation,
  useUpdateJournalEntryMutation,
  useDeleteJournalEntryMutation,
  useGetContactsQuery,
  useCreateContactMutation,
} = journalApi;
