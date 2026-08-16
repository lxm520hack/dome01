"use client"

import { useEffect, useState } from "react"
import { Search, ShieldCheck, ShieldX, Ban } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PaginationBar } from "@/components/admin/pagination-bar"

import { users as initialUsers } from "@/lib/data"
import type { User } from "@/lib/data"

const PAGE_SIZE = 8

const roleMap = {
  admin: { label: "管理员", badge: "default" as const },
  user: { label: "普通用户", badge: "secondary" as const },
}

const statusMap = {
  active: { label: "正常", badge: "default" as const },
  banned: { label: "已封禁", badge: "destructive" as const },
  pending: { label: "待审核", badge: "outline" as const },
}

export default function UsersPage() {
  const [items, setItems] = useState<User[]>(initialUsers)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [detail, setDetail] = useState<User | null>(null)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = items.filter((u) => {
    const matchSearch =
      u.name.includes(search) ||
      u.email.includes(search) ||
      u.phone.includes(search)
    const matchStatus = statusFilter === "all" || u.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const allPageSelected =
    pageItems.length > 0 && pageItems.every((u) => selected.has(u.id))

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  function toggleAllPage() {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allPageSelected) {
        pageItems.forEach((u) => next.delete(u.id))
      } else {
        pageItems.forEach((u) => next.add(u.id))
      }
      return next
    })
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function bulkBan() {
    if (selected.size === 0) return
    const target = items.some(
      (u) => selected.has(u.id) && u.status === "banned" && u.role !== "admin"
    )
      ? "active"
      : "banned"
    setItems((prev) =>
      prev.map((u) =>
        selected.has(u.id) && u.role !== "admin"
          ? { ...u, status: target }
          : u
      )
    )
    toast.success(
      target === "banned" ? `已批量封禁 ${selected.size} 位用户` : `已批量解封 ${selected.size} 位用户`
    )
    setSelected(new Set())
  }

  function toggleBan(user: User) {
    const banned = user.status !== "banned"
    setItems((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, status: banned ? "banned" : "active" } : u
      )
    )
    setDetail((d) =>
      d?.id === user.id
        ? { ...d, status: banned ? "banned" : "active" }
        : d
    )
    toast.success(banned ? `已封禁用户 ${user.name}` : `已解封用户 ${user.name}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">用户管理</h1>
        <p className="text-sm text-muted-foreground">
          共 {items.length} 位用户，正常 {items.filter((u) => u.status === "active").length} 位
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索用户名、邮箱、手机号..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v ?? "all")}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="active">正常</SelectItem>
            <SelectItem value="banned">已封禁</SelectItem>
            <SelectItem value="pending">待审核</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
          <span className="text-sm text-muted-foreground">
            已选 {selected.size} 项
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={bulkBan}
            >
              {items.some(
                (u) => selected.has(u.id) && u.status === "banned" && u.role !== "admin"
              )
                ? "批量解封"
                : "批量封禁"}
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allPageSelected}
                    onCheckedChange={toggleAllPage}
                    aria-label="全选本页"
                  />
                </TableHead>
                <TableHead>用户</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>订单数</TableHead>
                <TableHead>累计消费</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>注册时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    没有找到匹配的用户
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((user) => {
                  const role = roleMap[user.role]
                  const status = statusMap[user.status]
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(user.id)}
                          onCheckedChange={() => toggleOne(user.id)}
                          aria-label={`选择 ${user.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={role.badge}>{role.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.orders}
                      </TableCell>
                      <TableCell className="font-medium">
                        ¥{user.totalSpent.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.badge}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {user.joinedAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDetail(user)}
                          >
                            查看
                          </Button>
                          {user.role !== "admin" && (
                            <Button
                              variant={user.status === "banned" ? "outline" : "destructive"}
                              size="sm"
                              onClick={() => toggleBan(user)}
                            >
                              {user.status === "banned" ? (
                                <>
                                  <ShieldCheck />
                                  解封
                                </>
                              ) : (
                                <>
                                  <Ban />
                                  封禁
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PaginationBar
        page={safePage}
        pageSize={PAGE_SIZE}
        total={filtered.length}
        onPageChange={setPage}
      />

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="sm:max-w-md">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={detail.avatar} alt={detail.name} />
                    <AvatarFallback>{detail.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>{detail.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {detail.email}
                    </span>
                  </div>
                </DialogTitle>
                <DialogDescription>用户详细信息</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-2 text-sm">
                <div className="grid gap-1">
                  <span className="text-xs text-muted-foreground">手机号</span>
                  <span>{detail.phone}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-muted-foreground">角色</span>
                  <Badge variant={roleMap[detail.role].badge} className="w-fit">
                    {roleMap[detail.role].label}
                  </Badge>
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-muted-foreground">注册时间</span>
                  <span>{detail.joinedAt}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-muted-foreground">订单数</span>
                  <span>{detail.orders} 笔</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-muted-foreground">累计消费</span>
                  <span className="font-medium">
                    ¥{detail.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-muted-foreground">状态</span>
                  <Badge variant={statusMap[detail.status].badge} className="w-fit">
                    {statusMap[detail.status].label}
                  </Badge>
                </div>
              </div>
              {detail.role !== "admin" && (
                <div className="flex justify-end">
                  <Button
                    variant={detail.status === "banned" ? "outline" : "destructive"}
                    size="sm"
                    onClick={() => toggleBan(detail)}
                  >
                    {detail.status === "banned" ? (
                      <>
                        <ShieldX />
                        解封用户
                      </>
                    ) : (
                      <>
                        <Ban />
                        封禁用户
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
