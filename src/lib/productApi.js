import api from "./api"

export const getProductsByStoreIdApi = async (storeId) => {
  const { data } = await api.get(`/products/store/${storeId}`)
  return data
}

export const searchProductsApi = async (storeId, keyword) => {
  const { data } = await api.get(`/products/store/${storeId}/search`, { params: { keyword } })
  return data
}

export const createProductApi = async (productData) => {
  const { data } = await api.post("/products", productData)
  return data
}

export const updateProductApi = async (id, productData) => {
  // Backend uses PATCH here (unlike PUT everywhere else) — see the earlier
  // note about that inconsistency.
  const { data } = await api.patch(`/products/${id}`, productData)
  return data
}

export const deleteProductApi = async (id) => {
  const { data } = await api.delete(`/products/${id}`)
  return data
}