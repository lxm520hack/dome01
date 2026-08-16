"use client"

import { useActionState } from "react"
import { Store } from "lucide-react"

import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function LoginForm({ from }: { from?: string }) {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Store className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">云商城</h1>
          <p className="text-sm text-muted-foreground">管理后台</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>登录</CardTitle>
            <CardDescription>请输入管理员账号密码登录</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="flex flex-col gap-4">
              {from && <input type="hidden" name="from" value={from} />}
              <div className="grid gap-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="admin"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="admin123"
                  autoComplete="current-password"
                  required
                />
              </div>
              {state?.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  name="remember"
                  value="on"
                  defaultChecked
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  记住我（30 天内免登录）
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "登录中..." : "登录"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}