// Centralized API layer for Authentication
import axios from "axios"
import { BASE_URL } from "./api"

const extractErrorMessage = (err, fallback) => err.response?.data?.message || fallback


export const loginApi = async (email, password, role) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/login`, { email, password, role })
    return {
      token: data.jwt,
      user: data.user,
    }
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Invalid email, password or role"))
  }
}

export const signupApi = async ({ fullName, email, phone, password, role }) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/signup`, {
      fullName,
      email,
      phone,
      password,
      role,
    })
    return {
      token: data.jwt,
      user: data.user,
    }
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Could not create account"))
  }
}

export const forgotPasswordApi = async (email) => {
  throw new Error("Password reset isn't set up yet — check back after the backend adds a /auth/forgot-password endpoint")
}