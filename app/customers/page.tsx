import { redirect } from "next/navigation"

export default function CustomersPage() {
  redirect("/restaurant-profile?tab=customers")
}
