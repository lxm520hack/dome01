"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  ShieldCheck,
  ShieldX,
  Ban,
  Download,
  Crown,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

import { exportCsv } from "@/lib/csv"
import {
  changeUserRole,
  changeUserStatus,
} from "@/app/actions/users"
import type { StoredUser } from "@/lib/user-store"

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

export function UsersClient({
  initialUsers,
  currentUserId,
}: {
  initialUsers: StoredUser[]
  currentUserId: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [detail, setDetail] = useState<StoredUser | null>(null)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = initialUsers.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || u.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const allPageSelected =
    pageItems.length > 0 && pageItems.every((u) => selected.has(u.id))

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

  function runAction(fn: () => Promise<{ error?: string }>, success: string) {
    startTransition(async () => {
      const result = await fn()
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(success)
        router.refresh()
      }
    })
  }

  function bulkBan() {
    if (selected.size === 0) return
    const target = initialUsers.some(
      (u) => selected.has(u.id) && u.status === "banned" && u.role !== "admin"
    )
      ? "active"
      : "banned"
    startTransition(async () => {
      for (const id of selected) {
        const user = initialUsers.find((u) => u.id === id)
        if (!user || user.role === "admin" || id === currentUserId) continue
        await changeUserStatus(id, target)
      }
      toast.success(
        target === "banned" ? `已批量封禁 ${selected.size} 位用户` : `已批量解封 ${selected.size} 位用户`
      )
      setSelected(new Set())
      router.refresh()
    })
  }

  function exportUsers() {
    exportCsv(
      `用户列表_${new Date().toISOString().slice(0, 10)}.csv`,
      [
        ["用户名", "邮箱", "角色", "状态", "注册时间"],
        ...filtered.map((u) => [
          u.username,
          u.email,
          roleMap[u.role].label,
          statusMap[u.status].label,
          u.createdAt.slice(0, 10),
        ]),
      ]
    )
  }

  function dateLabel(iso: string) {
    return iso.slice(0, 10)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">用户管理</h1>
          <p className="text-sm text-muted-foreground">
            共 {initialUsers.length} 位用户，正常 {initialUsers.filter((u) => u.status === "active").length} 位
          </p>
        </div>
        <Button variant="outline" onClick={exportUsers}>
          <Download />
          导出 CSV
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索用户名、邮箱..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v ?? "all")
            setPage(1)
          }}
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
            <Button variant="outline" size="sm" onClick={bulkBan} disabled={pending}>
              {initialUsers.some(
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
                <TableHead>状态</TableHead>
                <TableHead>注册时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    没有找到匹配的用户
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((user) => {
                  const role = roleMap[user.role]
                  const status = statusMap[user.status]
                  const isSelf = user.id === currentUserId
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(user.id)}
                          onCheckedChange={() => toggleOne(user.id)}
                          aria-label={`选择 ${user.username}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback>
                              {user.username.slice(0, 1).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.username}</span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={role.badge}>{role.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.badge}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {dateLabel(user.createdAt)}
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
                          {!isSelf && user.role === "user" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={pending}
                              onClick={() =>
                                runAction(
                                  () => changeUserRole(user.id, "admin"),
                                  `已将 ${user.username} 提升为管理员`
                                )
                              }
                            >
                              <Crown />
                              提升为管理员
                            </Button>
                          )}
                          {!isSelf && user.role === "admin" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={pending}
                              onClick={() =>
                                runAction(
                                  () => changeUserRole(user.id, "user"),
                                  `已取消 ${user.username} 的管理员权限`
                                )
                              }
                            >
                              <ShieldX />
                              取消管理员
                            </Button>
                          )}
                          {!isSelf && user.status === "banned" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={pending}
                              onClick={() =>
                                runAction(
                                  () => changeUserStatus(user.id, "active"),
                                  `已解封用户 ${user.username}`
                                )
                              }
                            >
                              <ShieldCheck />
                              解封
                            </Button>
                          )}
                          {!isSelf && user.status !== "banned" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={pending}
                              onClick={() =>
                                runAction(
                                  () => changeUserStatus(user.id, "banned"),
                                  `已封禁用户 ${user.username}`
                                )
                              }
                            >
                              <Ban />
                              封禁
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
                    <AvatarFallback>
                      {detail.username.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>{detail.username}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {detail.email}
                    </span>
                  </div>
                </DialogTitle>
                <DialogDescription>用户详细信息</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-2 text-sm">
                <div className="grid gap-1">
                  <span className="text-xs text-muted-foreground">角色</span>
                  <Badge variant={roleMap[detail.role].badge} className="w-fit">
                    {roleMap[detail.role].label}
                  </Badge>
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-muted-foreground">注册时间</span>
                  <span>{dateLabel(detail.createdAt)}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-muted-foreground">用户 ID</span>
                  <span className="font-mono text-xs">{detail.id}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-muted-foreground">状态</span>
                  <Badge variant={statusMap[detail.status].badge} className="w-fit">
                    {statusMap[detail.status].label}
                  </Badge>
                </div>
              </div>
              {detail.id !== currentUserId && (
                <div className="flex justify-end gap-2">
                  {detail.role === "user" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pending}
                      onClick={() =>
                        runAction(
                          () => changeUserRole(detail.id, "admin"),
                          `已将 ${detail.username} 提升为管理员`
                        )
                      }
                    >
                      <Crown />
                      提升为管理员
                    </Button>
                  )}
                  {detail.status !== "banned" ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={pending}
                      onClick={() =>
                        runAction(
                          () => changeUserStatus(detail.id, "banned"),
                          `已封禁用户 ${detail.username}`
                        )
                      }
                    >
                      <Ban />
                      封禁用户
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pending}
                      onClick={() =>
                        runAction(
                          () => changeUserStatus(detail.id, "active"),
                          `已解封用户 ${detail.username}`
                        )
                      }
                    >
                      <ShieldCheck />
                      解封用户
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}