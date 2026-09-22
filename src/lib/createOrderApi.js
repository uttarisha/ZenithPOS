import api from "./api"
import { getCurrentUser } from "./utils"

let cachedStore = { branchId: null, storeId: null }

const resolveStoreId = async () => {
  const { branchId } = getCurrentUser()
  if (!branchId) throw new Error("No branch associated with the logged-in user")
  if (cachedStore.branchId === branchId) return cachedStore.storeId

  const { data: branch } = await api.get(`/branches/${branchId}`)
  cachedStore = { branchId, storeId: branch.storeId }
  return branch.storeId
}

const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  sku: p.sku,
  price: p.sellingPrice,
  image: p.image,
  category: p.category?.name || null,
})

export const getProductsApi = async (searchQuery = "") => {
  const storeId = await resolveStoreId()
  const { data } = searchQuery
    ? await api.get(`/products/store/${storeId}/search`, { params: { keyword: searchQuery } })
    : await api.get(`/products/store/${storeId}`)
  return data.map(mapProduct)
}

export const submitOrderApi = async (orderPayload) => {
  const { branchId } = getCurrentUser()
  const order = {
    branchId,
    customerId: orderPayload.customer?.id || null,
    paymentType: orderPayload.paymentType || "CASH",
    discountType: orderPayload.discountType === "percent" ? "PERCENT" : "FLAT",
    discountValue: Number(orderPayload.discountValue) || 0,
    note: orderPayload.note || null,
    items: orderPayload.items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
  }
  const { data } = await api.post("/orders", order)
  return { success: true, orderId: data.id, totalAmount: data.totalAmount }
}