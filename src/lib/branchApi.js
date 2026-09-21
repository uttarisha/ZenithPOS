import api from "./api"

export const getAllBranchesByStoreIdApi = async (storeId) => {
  const { data } = await api.get(`/branches/store/${storeId}`)
  return data
}

export const getBranchByIdApi = async (id) => {
  const { data } = await api.get(`/branches/${id}`)
  return data
}

export const createBranchApi = async (branchData) => {
  const { data } = await api.post("/branches", branchData)
  return data
}

export const updateBranchApi = async (id, branchData) => {
  const { data } = await api.put(`/branches/${id}`, branchData)
  return data
}

export const deleteBranchApi = async (id) => {
  const { data } = await api.delete(`/branches/${id}`)
  return data
}