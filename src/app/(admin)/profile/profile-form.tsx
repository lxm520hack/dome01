"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { Save, KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { saveProfile, changePassword } from "@/app/actions/profile"

export function ProfileForm({
  username,
  email,
  initialTab = "profile",
}: {
  username: string
  email: string
  initialTab?: "profile" | "password"
}) {
  const [name, setName] = useState(username)
  const [mail, setMail] = useState(email)
  const [tab, setTab] = useState(initialTab)

  const [profileState, profileAction, profilePending] = useActionState(
    saveProfile,
    undefined
  )
  const [passwordState, passwordAction, passwordPending] = useActionState(
    changePassword,
    undefined
  )

  const effectiveState =
    tab === "profile" ? profileState : passwordState

  useEffect(() => {
    if (effectiveState?.ok) {
      toast.success(tab === "profile" ? "资料已保存" : "密码已更新，请牢记新密码")
    }
  }, [effectiveState, tab])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">个人资料</h1>
        <p className="text-sm text-muted-foreground">
          管理你的账户信息与登录密码
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="profile">个人资料</TabsTrigger>
          <TabsTrigger value="password">修改密码</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>更新登录账号的展示信息</CardDescription>
            </CardHeader>
            <CardContent className="flex max-w-xl flex-col gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarImage src="/avatar.png" alt={name} />
                  <AvatarFallback className="text-lg">
                    {name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1 text-sm">
                  <span className="font-medium">{name}</span>
                  <span className="text-muted-foreground">管理员账号</span>
                </div>
              </div>
              <Separator />
              <form action={profileAction} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    name="username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-fit"
                  disabled={profilePending}
                >
                  <Save />
                  {profilePending ? "保存中..." : "保存更改"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>修改密码</CardTitle>
              <CardDescription>定期更换密码以保障账户安全</CardDescription>
            </CardHeader>
            <CardContent className="flex max-w-xl flex-col gap-4">
              <form action={passwordAction} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">当前密码</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">新密码</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    密码长度不能少于 6 位
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">确认新密码</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-fit"
                  disabled={passwordPending}
                >
                  <KeyRound />
                  {passwordPending ? "更新中..." : "更新密码"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {effectiveState?.error && (
        <p className="text-sm text-destructive">{effectiveState.error}</p>
      )}
    </div>
  )
}