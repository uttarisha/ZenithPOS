import api from "./api"
import { normalizeOrder } from "./utils"

const normalizeShift = (data) => {
  if (!data) return null;
  return {
    ...data,
    recentOrders: (data.recentOrders || []).map(normalizeOrder),
    paymentSummaries: data.paymentSummaries || [],
    topSellingProducts: data.topSellingProducts || [],
    refunds: data.refunds || [],
  };
};

export const getCurrentShiftProgress = async () => {
  const { data } = await api.get("/shift-reports/current")
  return normalizeShift(data)
}

export const startShift = async () => {
  const { data } = await api.post("/shift-reports/start")
  return normalizeShift(data)
}

export const endShift = async () => {
  const { data } = await api.patch("/shift-reports/end")
  return normalizeShift(data)
}