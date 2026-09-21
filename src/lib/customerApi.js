import api from "./api"

const mapCustomer = (c) => ({
  id: c.id,
  name: c.fullName,
  email: c.email,
  phone: c.phone,
  totalOrders: 0,
  totalSpent: 0,
  history: [],
})

export const getCustomersApi = async (searchQuery = "") => {
  const { data } = searchQuery
    ? await api.get("/customers/search", { params: { q: searchQuery } })
    : await api.get("/customers")
  return data.map(mapCustomer)
}

export const getCustomerByIdApi = async (id) => {
  const { data: customer } = await api.get(`/customers/${id}`)
  const { data: orders } = await api.get(`/orders/customer/${id}`)

  const newestFirst = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  return {
    ...mapCustomer(customer),
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    history: newestFirst.map((o) => ({
      id: String(o.id),
      orderNumber: `Order #${o.id}`,
      date: o.createdAt ? new Date(o.createdAt).toLocaleString() : "",
      status: o.status,
      paymentMethod: o.paymentType,
      totalAmount: o.totalAmount || 0,
      items: (o.items || []).map((i) => ({
        name: i.product?.name,
        quantity: i.quantity,
        // the saved item price is the line total, so show the per-unit price
        price: i.quantity ? i.price / i.quantity : i.price,
      })),
    })),
  }
}

export const addCustomerApi = async (newCustomer) => {
  const { data } = await api.post("/customers", {
    fullName: newCustomer.name,
    email: newCustomer.email,
    phone: newCustomer.phone,
  })
  return mapCustomer(data)
}