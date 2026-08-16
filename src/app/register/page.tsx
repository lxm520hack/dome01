import { redirect } from "next/navigation"

import { getSession } from "@/lib/session"
import { RegisterForm } from "@/app/register/register-form"

export const metadata = {
  title: "注册",
}

export default async function RegisterPage() {
  const session = await getSession()
  if (session) redirect("/")

  return <RegisterForm />
}