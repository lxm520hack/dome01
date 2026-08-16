"use server"

import { redirect } from "next/navigation"

import { createSession, deleteSession } from "@/lib/session"
import { verifyAdminPassword } from "@/lib/admin-store"

export type LoginState = { error?: string } | undefined

export async function login(prevState: LoginState, formData: FormData) {
  const username = formData.get("username")
  const password = formData.get("password")
  const from = formData.get("from")
  const remember = formData.get("remember") === "on"

  const { ok, record } = await verifyAdminPassword(
    String(username ?? ""),
    String(password ?? "")
  )

  if (!ok || username !== record.username) {
    return {
      error: "用户名或密码错误",
    }
  }

  await createSession(
    {
      userId: "u-admin",
      username: record.username,
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
