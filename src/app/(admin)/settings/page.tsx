"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("云商城")
  const [storeDescription, setStoreDescription] = useState(
    "一站式在线购物平台"
  )
  const [orderAutoConfirm, setOrderAutoConfirm] = useState(true)
  const [stockAlert, setStockAlert] = useState(true)
  const [orderNotify, setOrderNotify] = useState(true)

  function handleSave() {
    toast.success("设置已保存")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">系统设置</h1>
        <p className="text-sm text-muted-foreground">
          管理商城的基础信息与运营偏好
        </p>
      </div>

      <Tabs defaultValue="store">
        <TabsList>
          <TabsTrigger value="store">店铺信息</TabsTrigger>
          <TabsTrigger value="order">订单设置</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>店铺信息</CardTitle>
              <CardDescription>配置商城展示的基础信息</CardDescription>
            </CardHeader>
            <CardContent className="flex max-w-xl flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="store-name">店铺名称</Label>
                <Input
                  id="store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store-desc">店铺简介</Label>
                <Textarea
                  id="store-desc"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store-logo">店铺 Logo</Label>
                <div className="flex items-center gap-3">
                  <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-lg font-semibold">
                    云
                  </div>
                  <Button variant="outline" size="sm">
                    上传图片
                  </Button>
                </div>
              </div>
              <Button className="w-fit" onClick={handleSave}>
                <Save />
                保存更改
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="order" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>订单设置</CardTitle>
              <CardDescription>配置订单与库存相关规则</CardDescription>
            </CardHeader>
            <CardContent className="flex max-w-xl flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="auto-confirm-days">自动确认收货（天）</Label>
                <Input
                  id="auto-confirm-days"
                  type="number"
                  defaultValue="7"
                  className="max-w-32"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="sw-auto">自动确认收货</Label>
                  <p className="text-xs text-muted-foreground">
                    发货后到期自动完成订单
                  </p>
                </div>
                <Switch
                  id="sw-auto"
                  checked={orderAutoConfirm}
                  onCheckedChange={setOrderAutoConfirm}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="sw-stock">库存预警</Label>
                  <p className="text-xs text-muted-foreground">
                    库存低于 20 时发送预警通知
                  </p>
                </div>
                <Switch
                  id="sw-stock"
                  checked={stockAlert}
                  onCheckedChange={setStockAlert}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="sw-notify">新订单通知</Label>
                  <p className="text-xs text-muted-foreground">
                    有新订单时发送短信通知
                  </p>
                </div>
                <Switch
                  id="sw-notify"
                  checked={orderNotify}
                  onCheckedChange={setOrderNotify}
                />
              </div>
              <Button className="w-fit" onClick={handleSave}>
                <Save />
                保存更改
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>安全设置</CardTitle>
              <CardDescription>账户安全与访问控制</CardDescription>
            </CardHeader>
            <CardContent className="flex max-w-xl flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="old-password">当前密码</Label>
                <Input id="old-password" type="password" placeholder="••••••••" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">新密码</Label>
                <Input id="new-password" type="password" placeholder="••••••••" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">确认新密码</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <Button className="w-fit" onClick={handleSave}>
                <Save />
                更新密码
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
