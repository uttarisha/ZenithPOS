import api from "./api"
import { normalizeOrder } from "./utils"

export const getOrdersByBranchApi = async (branchId, filters = {}) => {
  const { data } = await api.get(`/orders/branch/${branchId}`, {
    params: {
      paymentType: filters.paymentType || undefined,
      orderStatus: filters.orderStatus || undefined,
    },
  })
  return data.map(normalizeOrder)
}

export const getTodayOrdersByBranchApi = async (branchId) => {
  const { data } = await api.get(`/orders/today/branch/${branchId}`)
  return data.map(normalizeOrder)
}

export const getOrderByIdApi = async (id) => {
  const { data } = await api.get(`/orders/${id}`)
  return normalizeOrder(data)
}