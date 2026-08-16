import { redirect } from "next/navigation"

import { getSession } from "@/lib/session"
import { getAdminProfile } from "@/lib/admin-store"
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

  const profile = await getAdminProfile()
  const { tab } = await searchParams

  return (
    <ProfileForm
      username={profile.username}
      email={profile.email}
      initialTab={tab === "password" ? "password" : "profile"}
    />
  )
}