import api from "./api"

export const getCategoriesByStoreIdApi = async (storeId) => {
  const { data } = await api.get(`/categories/store/${storeId}`)
  return data
}

export const createCategoryApi = async (categoryData) => {
  const { data } = await api.post("/categories", categoryData)
  return data
}

export const updateCategoryApi = async (id, categoryData) => {
  const { data } = await api.put(`/categories/${id}`, categoryData)
  return data
}

export const deleteCategoryApi = async (id) => {
  const { data } = await api.delete(`/categories/${id}`)
  return data
}