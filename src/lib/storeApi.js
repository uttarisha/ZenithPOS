// Centralized API layer for Store Management (the logged-in Store Admin's own store)
import api from "./api"

export const getStoreByAdminApi = async () => {
  try {
    const { data } = await api.get("/stores/admin")
    return data
  } catch (err) {
    if (err.response?.data?.message?.includes("no store found")) {
      return null
    }
    throw new Error(err.response?.data?.message || "Failed to load store details")
  }
}

export const createStoreApi = async (storeData) => {
  try {
    const { data } = await api.post("/stores", storeData)
    return data
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create store")
  }
}

export const updateStoreApi = async (id, storeData) => {
  try {
    const { data } = await api.put(`/stores/${id}`, storeData)
    return data
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update store")
  }
}

export const getStoreRevenueSummaryApi = async () => {
  try {
    const { data } = await api.get("/stores/revenue-summary")
    return data
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to load revenue summary")
  }
}