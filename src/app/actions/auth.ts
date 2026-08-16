"use server"

import { redirect } from "next/navigation"

import { createSession, deleteSession } from "@/lib/session"
import {
  verifyUser,
  createUser,
  findUserByUsername,
} from "@/lib/user-store"

export type LoginState = { error?: string } | undefined

export type RegisterState = { error?: string } | undefined

const USERNAME_RE = /^[a-zA-Z0-9_\-\u4e00-\u9fa5]{2,20}$/

export async function checkUsernameAvailable(username: string) {
  const name = username.trim()
  if (!USERNAME_RE.test(name)) {
    return { available: false, error: "用户名需为 2-20 位中文、字母、数字、下划线或连字符" }
  }
  if (await findUserByUsername(name)) {
    return { available: false, error: "该用户名已被注册，请换一个" }
  }
  return { available: true, error: null }
}

export async function register(prevState: RegisterState, formData: FormData) {
  const username = String(formData.get("username") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const confirm = String(formData.get("confirmPassword") ?? "")

  if (!USERNAME_RE.test(username)) {
    return { error: "用户名需为 2-20 位中文、字母、数字、下划线或连字符" }
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "请输入有效的邮箱地址" }
  }
  if (password.length < 6) {
    return { error: "密码长度不能少于 6 位" }
  }
  if (password !== confirm) {
    return { error: "两次输入的密码不一致" }
  }

  if (await findUserByUsername(username)) {
    return { error: "该用户名已被注册" }
  }

  const user = await createUser({ username, email, password })

  await createSession(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
    },
    true
  )

  redirect("/")
}

export async function registerAdmin(
  prevState: RegisterState,
  formData: FormData
) {
  const username = String(formData.get("username") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const confirm = String(formData.get("confirmPassword") ?? "")

  if (!USERNAME_RE.test(username)) {
    return { error: "用户名需为 2-20 位中文、字母、数字、下划线或连字符" }
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "请输入有效的邮箱地址" }
  }
  if (password.length < 6) {
    return { error: "密码长度不能少于 6 位" }
  }
  if (password !== confirm) {
    return { error: "两次输入的密码不一致" }
  }

  if (await findUserByUsername(username)) {
    return { error: "该用户名已被注册" }
  }

  const user = await createUser({ username, email, password, role: "admin" })

  await createSession(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
    },
    true
  )

  redirect("/")
}

export async function login(prevState: LoginState, formData: FormData) {
  const username = formData.get("username")
  const password = formData.get("password")
  const from = formData.get("from")
  const remember = formData.get("remember") === "on"

  const { ok, user } = await verifyUser(
    String(username ?? ""),
    String(password ?? "")
  )

  if (!ok || !user) {
    return {
      error: "用户名或密码错误",
    }
  }

  if (user.status !== "active") {
    return {
      error: "账号已被禁用",
    }
  }

  await createSession(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
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
