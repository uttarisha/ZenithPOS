import api from "./api"

export const getStoreEmployeesApi = async (storeId, userRole = "") => {
  const { data } = await api.get(`/employees/store/${storeId}`, {
   params: { userRole: userRole || undefined },
  })
  return data
}

export const createStoreEmployeeApi = async (storeId, employeeData) => {
  const { data } = await api.post(`/employees/store/${storeId}`, employeeData)
  return data
}

export const getBranchEmployeesApi = async (branchId, userRole = "") => {
  const { data } = await api.get(`/employees/branch/${branchId}`, {
   params: { userRole: userRole || undefined },
  })
  return data
}

export const createBranchEmployeeApi = async (branchId, employeeData) => {
  const { data } = await api.post(`/employees/branch/${branchId}`, employeeData)
  return data
}

// Attach an account that already signed up (found by email) to a branch
export const assignExistingEmployeeApi = async (branchId, { email, role }) => {
  const { data } = await api.post(`/employees/branch/${branchId}/assign`, { email, role })
  return data
}

export const updateEmployeeApi = async (id, employeeData) => {
  const { data } = await api.put(`/employees/${id}`, employeeData)
  return data
}

export const deleteEmployeeApi = async (id) => {
  const { data } = await api.delete(`/employees/${id}`)
  return data
}