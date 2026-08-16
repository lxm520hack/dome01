import { redirect } from "next/navigation"

import { getSession } from "@/lib/session"
import { listUsers } from "@/lib/user-store"
import { UsersClient } from "@/app/(admin)/users/users-client"

export const metadata = {
  title: "用户管理",
}

export default async function UsersPage() {
  const session = await getSession()
  if (!session) redirect("/login")
  if (session.role !== "admin") redirect("/")

  const users = await listUsers()

  return <UsersClient initialUsers={users} currentUserId={session.userId} />
}