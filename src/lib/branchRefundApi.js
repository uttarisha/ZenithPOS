import api from "./api"

export const getRefundsByBranchApi = async (branchId) => {
  const { data } = await api.get(`/refunds/branch/${branchId}`)
  return data
}

export const createRefundApi = async (refundData) => {
  const { data } = await api.post("/refunds", refundData)
  return data
}