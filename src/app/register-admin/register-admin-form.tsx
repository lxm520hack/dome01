"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { Store } from "lucide-react"
import Link from "next/link"

import { registerAdmin, checkUsernameAvailable } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function RegisterAdminForm() {
  const [state, action, pending] = useActionState(registerAdmin, undefined)
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [usernameOk, setUsernameOk] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    const value = username.trim()
    timer.current = setTimeout(() => {
      if (!value) {
        setUsernameError(null)
        setUsernameOk(false)
        return
      }
      if (!/^[a-zA-Z0-9_\-\u4e00-\u9fa5]{2,20}$/.test(value)) {
        setUsernameError("用户名需为 2-20 位中文、字母、数字、下划线或连字符")
        setUsernameOk(false)
        return
      }
      ;(async () => {
        const result = await checkUsernameAvailable(value)
        setUsernameError(result.error)
        setUsernameOk(result.available)
      })()
    }, value ? 400 : 0)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [username])

  function handleEmailChange(value: string) {
    setEmail(value)
    if (!value.trim()) {
      setEmailError(null)
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      setEmailError("请输入有效的邮箱地址")
    } else {
      setEmailError(null)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Store className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">云商城</h1>
          <p className="text-sm text-muted-foreground">创建管理员账号</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>管理员注册</CardTitle>
            <CardDescription>注册后自动登录，账号角色为管理员</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="中文或英文，2-20 位"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {usernameError && (
                  <p className="text-sm text-destructive">{usernameError}</p>
                )}
                {usernameOk && (
                  <p className="text-sm text-emerald-600">用户名可用</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">
                  邮箱 <span className="text-xs text-muted-foreground">(可选，用于找回密码)</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
                {emailError && (
                  <p className="text-sm text-destructive">{emailError}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="至少 6 位"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
              {state?.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={pending || !!usernameError || !!emailError}
              >
                {pending ? "注册中..." : "注册管理员"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              已有账号？{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                去登录
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}