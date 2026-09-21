import api from "./api"

export const getAllStoresApi = async () => {
  const { data } = await api.get("/stores")
  return data
}

export const getStoreByIdApi = async (id) => {
  const { data } = await api.get(`/stores/${id}`)
  return data
}

export const moderateStoreApi = async (id, status) => {
  const { data } = await api.put(`/stores/${id}/moderate`, null, { params: { status } })
  return data
}

export const deleteStoreApi = async (id) => {
  const { data } = await api.delete(`/stores/${id}`)
  return data
}

export const forceDeleteStoreApi = async (id) => {
  const { data } = await api.delete(`/stores/${id}/force`)
  return data
}

export const getUserByIdApi = async (id) => {
  const { data } = await api.get(`/users/${id}`)
  return data
}

export const getMyAdminProfileApi = async () => {
  const { data } = await api.get("/users/profile")
  return data
}