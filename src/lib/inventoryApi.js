import api from "./api"

export const getInventoryByBranchIdApi = async (branchId) => {
  const { data } = await api.get(`/inventories/branch/${branchId}`)
  return data
}

export const getInventoryByProductAndBranchApi = async (branchId, productId) => {
  const { data } = await api.get(`/inventories/branch/${branchId}/product/${productId}`)
  return data
}

export const createInventoryApi = async (inventoryData) => {
  const { data } = await api.post("/inventories", inventoryData)
  return data
}

export const updateInventoryApi = async (id, inventoryData) => {
  const { data } = await api.put(`/inventories/${id}`, inventoryData)
  return data
}

export const deleteInventoryApi = async (id) => {
  const { data } = await api.delete(`/inventories/${id}`)
  return data
}