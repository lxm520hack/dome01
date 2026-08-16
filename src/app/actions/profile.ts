"use server"

import { revalidatePath } from "next/cache"

import { getSession } from "@/lib/session"
import {
  findUserById,
  updateUserProfile,
  updateUserPassword,
} from "@/lib/user-store"

export type ProfileState = { ok?: boolean; error?: string } | undefined

export async function saveProfile(prevState: ProfileState, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: "未登录" }

  const username = String(formData.get("username") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()

  if (!username) return { error: "用户名不能为空" }
  if (!email) return { error: "邮箱不能为空" }

  await updateUserProfile(session.userId, { username, email })

  revalidatePath("/profile")
  return { ok: true }
}

export async function changePassword(
  prevState: ProfileState,
  formData: FormData
) {
  const session = await getSession()
  if (!session) return { error: "未登录" }

  const current = String(formData.get("currentPassword") ?? "")
  const next = String(formData.get("newPassword") ?? "")
  const confirm = String(formData.get("confirmPassword") ?? "")

  if (next !== confirm) {
    return { error: "两次输入的新密码不一致" }
  }

  const result = await updateUserPassword(session.userId, current, next)
  return { error: result.error ?? undefined, ok: result.ok }
}

export async function getProfileForPage() {
  const session = await getSession()
  if (!session) return null
  return findUserById(session.userId)
}