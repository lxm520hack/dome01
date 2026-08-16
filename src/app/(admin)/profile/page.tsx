import { redirect } from "next/navigation"

import { getSession } from "@/lib/session"
import { findUserById } from "@/lib/user-store"
import { ProfileForm } from "@/app/(admin)/profile/profile-form"

export const metadata = {
  title: "个人资料",
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  const user = await findUserById(session.userId)
  if (!user) redirect("/login")

  const { tab } = await searchParams

  return (
    <ProfileForm
      username={user.username}
      email={user.email}
      role={user.role}
      initialTab={tab === "password" ? "password" : "profile"}
    />
  )
}