import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatDateForBackend = (date) => {
  if (!date) return null
  return new Date(date).toISOString()
}


export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {}
  } catch {
    return {}
  }
}


export const normalizeOrder = (o) => ({
  ...o,
  customer: o.customer ? { ...o.customer, name: o.customer.fullName } : null,
})