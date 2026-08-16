"use server"

import { redirect } from "next/navigation"

import { createSession, deleteSession } from "@/lib/session"

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin123"

export type LoginState = { error?: string } | undefined

export async function login(prevState: LoginState, formData: FormData) {
  const username = formData.get("username")
  const password = formData.get("password")
  const from = formData.get("from")
  const remember = formData.get("remember") === "on"

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return {
      error: "用户名或密码错误",
    }
  }

  await createSession(
    {
      userId: "u-admin",
      username: "admin",
      role: "admin",
    },
    remember
  )

  const target =
    typeof from === "string" &&
    from.startsWith("/") &&
    !from.startsWith("//") &&
    !from.includes("://")
      ? from
      : "/"
  redirect(target)
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}
