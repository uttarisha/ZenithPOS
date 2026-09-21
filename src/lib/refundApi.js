import api from "./api"
import { getCurrentUser, normalizeOrder } from "./utils"

export const getReturnableOrders = async (query = "") => {
  const { branchId } = getCurrentUser()
  const { data } = await api.get(`/orders/branch/${branchId}`)
  const orders = data.map(normalizeOrder)

  if (!query) return orders
  const q = query.toLowerCase()
  return orders.filter(
    (o) => String(o.id).toLowerCase().includes(q) || o.customer?.name?.toLowerCase().includes(q)
  )
}



export const processRefundApi = async (refundPayload) => {
  const { branchId } = getCurrentUser()
  const { data } = await api.post("/refunds", {
    orderId: refundPayload.orderId,
    reason: refundPayload.reason,
    amount: refundPayload.totalRefundAmount,
    paymentType: refundPayload.refundMethod, // must be "CASH" | "CARD" | "UPI" — double check what your refund-method UI actually sends
    branchId,
  })
  return { success: true, message: "Refund processed successfully!", refund: data }
}