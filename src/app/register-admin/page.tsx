import { redirect } from "next/navigation"

import { getSession } from "@/lib/session"
import { RegisterAdminForm } from "@/app/register-admin/register-admin-form"

export const metadata = {
  title: "管理员注册",
}

export default async function RegisterAdminPage() {
  const session = await getSession()
  if (session) redirect("/")

  return <RegisterAdminForm />
}