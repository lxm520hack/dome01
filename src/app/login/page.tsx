import { LoginForm } from "@/app/login/login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { from } = await searchParams
  const redirectTo = Array.isArray(from) ? from[0] : from

  return <LoginForm from={redirectTo} />
}