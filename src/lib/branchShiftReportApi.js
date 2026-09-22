import api from "./api"

export const getShiftReportsByBranchApi = async (branchId) => {
  const { data } = await api.get(`/shift-reports/branch/${branchId}`)
  return data
}

export const getShiftReportsByCashierApi = async (cashierId) => {
  const { data } = await api.get(`/shift-reports/cashier/${cashierId}`)
  return data
}