import { apiClient } from "@/libs/apiClient";

export const moverService = {
  getMovers: (data?: {
    keyword?: string;
    region?: string;
    service?: string;
    sort?: string;
    cursor?: number;
    limit?: number;
  }) => {
    return apiClient("/movers", {
      method: "GET",
      query: data,
    });
  },
  getMoverFull: (id: number) => {
    return apiClient(`/movers/${id}/full`, {
      method: "GET",
    });
  },
  getMoverExtra: (id: number) => {
    return apiClient(`/movers/${id}/extra`, {
      method: "GET",
    });
  },
  postFavoriteMover: (id: number) => {
    return apiClient(`/movers/${id}/favorite`, {
      method: "POST",
    });
  },
  deleteFavoriteMover: (id: number) => {
    return apiClient(`/movers/${id}/favorite`, {
      method: "DELETE",
    });
  },
};
