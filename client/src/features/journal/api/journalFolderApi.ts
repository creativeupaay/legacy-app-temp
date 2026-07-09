import { baseApi } from "@/app/baseApi";
import type {
  IJournalFolder,
  ICreateFolderRequest,
  IUpdateFolderRequest,
  IDeleteFolderRequest,
  IListFoldersResponse,
  ISingleFolderResponse,
} from "../types/journalFolder.types";

export const journalFolderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJournalFolders: builder.query<IJournalFolder[], void>({
      query: () => ({
        url: "/journal-folders",
        method: "GET",
      }),
      transformResponse: (response: IListFoldersResponse) =>
        response.data?.folders || [],
      providesTags: ["JournalFolders"],
    }),

    getJournalFolderById: builder.query<IJournalFolder, string>({
      query: (id) => ({
        url: `/journal-folders/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ISingleFolderResponse) =>
        response.data.folder,
      providesTags: (_result, _error, id) => [{ type: "JournalFolders", id }],
    }),

    createJournalFolder: builder.mutation<
      IJournalFolder,
      ICreateFolderRequest
    >({
      query: (data) => ({
        url: "/journal-folders",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ISingleFolderResponse) =>
        response.data.folder,
      invalidatesTags: ["JournalFolders"],
    }),

    updateJournalFolder: builder.mutation<
      IJournalFolder,
      { id: string; data: IUpdateFolderRequest }
    >({
      query: ({ id, data }) => ({
        url: `/journal-folders/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: ISingleFolderResponse) =>
        response.data.folder,
      invalidatesTags: ["JournalFolders"],
    }),

    deleteJournalFolder: builder.mutation<
      void,
      { id: string; action: IDeleteFolderRequest["action"] }
    >({
      query: ({ id, action }) => ({
        url: `/journal-folders/${id}`,
        method: "DELETE",
        body: { action },
      }),
      invalidatesTags: ["JournalFolders", "Journal", "Insights"],
    }),
  }),
});

export const {
  useGetJournalFoldersQuery,
  useGetJournalFolderByIdQuery,
  useCreateJournalFolderMutation,
  useUpdateJournalFolderMutation,
  useDeleteJournalFolderMutation,
} = journalFolderApi;
