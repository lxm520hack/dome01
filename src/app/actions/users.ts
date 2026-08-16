"use server"

import { revalidatePath } from "next/cache"

import { getSession } from "@/lib/session"
import { updateUserRole, updateUserStatus } from "@/lib/user-store"

export type UserActionResult = { error?: string } | undefined

export async function changeUserRole(id: string, role: "admin" | "user") {
  const session = await getSession()
  if (!session) return { error: "未登录" }
  if (session.role !== "admin") return { error: "无权限操作" }
  if (id === session.userId) return { error: "不能修改自己的角色" }

  const user = await updateUserRole(id, role)
  if (!user) return { error: "用户不存在" }

  revalidatePath("/users")
  return {}
}

export async function changeUserStatus(
  id: string,
  status: "active" | "banned"
) {
  const session = await getSession()
  if (!session) return { error: "未登录" }
  if (session.role !== "admin") return { error: "无权限操作" }
  if (id === session.userId) return { error: "不能封禁自己" }

  const user = await updateUserStatus(id, status)
  if (!user) return { error: "用户不存在" }

  revalidatePath("/users")
  return {}
}