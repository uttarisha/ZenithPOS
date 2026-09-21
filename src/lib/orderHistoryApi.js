import api from "./api"
import { getCurrentUser, normalizeOrder } from "./utils"


export const getOrderHistory = async (filter = "today", searchQuery = "") => {
  const { branchId } = getCurrentUser()
  const { data } = filter === "today"
    ? await api.get(`/orders/today/branch/${branchId}`)
    : await api.get(`/orders/branch/${branchId}`)

  const orders = data.map(normalizeOrder)
  if (!searchQuery.trim()) return orders

  const q = searchQuery.toLowerCase()
  return orders.filter(
    (o) => String(o.id).includes(q) || o.customer?.name?.toLowerCase().includes(q)
  )
}

export const getOrderDetailsById = async (orderId) => {
  const { data } = await api.get(`/orders/${orderId}`)
  return normalizeOrder(data)
}

export const updateOrderStatusApi = async (id, status) => {
  const { data } = await api.patch(`/orders/${id}/status`, null, { params: { status } })
  return normalizeOrder(data)
}