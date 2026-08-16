"use client"

import { useState } from "react"
import { Search, Eye, Truck, CheckCheck, X, Download } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { PaginationBar } from "@/components/admin/pagination-bar"

import { exportCsv } from "@/lib/csv"
import { orders as initialOrders, orderStatusMap } from "@/lib/data"
import type { Order } from "@/lib/data"

const PAGE_SIZE = 8

const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "pending", label: "待付款" },
  { value: "paid", label: "已付款" },
  { value: "shipped", label: "已发货" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
  { value: "refunding", label: "退款中" },
]

export default function OrdersPage() {
  const [items, setItems] = useState<Order[]>(initialOrders)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [detail, setDetail] = useState<Order | null>(null)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = items.filter((o) => {
    const matchSearch =
      o.orderNo.includes(search) ||
      o.customer.includes(search) ||
      o.customerPhone.includes(search)
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const allPageSelected =
    pageItems.length > 0 && pageItems.every((o) => selected.has(o.id))

  function toggleAllPage() {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allPageSelected) {
        pageItems.forEach((o) => next.delete(o.id))
      } else {
        pageItems.forEach((o) => next.add(o.id))
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

  function bulkShip() {
    if (selected.size === 0) return
    const shippable = items.filter(
      (o) => selected.has(o.id) && o.status === "paid"
    )
    if (shippable.length === 0) {
      toast.error("选中的订单中没有可发货的订单")
      return
    }
    setItems((prev) =>
      prev.map((o) =>
        selected.has(o.id) && o.status === "paid"
          ? { ...o, status: "shipped" }
          : o
      )
    )
    toast.success(`已批量发货 ${shippable.length} 个订单`)
    setSelected(new Set())
  }

  function bulkCancel() {
    if (selected.size === 0) return
    const cancellable = items.filter(
      (o) => selected.has(o.id) && o.status === "pending"
    )
    if (cancellable.length === 0) {
      toast.error("选中的订单中没有可取消的订单")
      return
    }
    setItems((prev) =>
      prev.map((o) =>
        selected.has(o.id) && o.status === "pending"
          ? { ...o, status: "cancelled" }
          : o
      )
    )
    toast.success(`已批量取消 ${cancellable.length} 个订单`)
    setSelected(new Set())
  }

  function exportOrders() {
    exportCsv(
      `订单列表_${new Date().toISOString().slice(0, 10)}.csv`,
      [
        ["订单号", "客户", "手机号", "商品", "金额", "状态", "支付方式", "下单时间"],
        ...filtered.map((o) => [
          o.orderNo,
          o.customer,
          o.customerPhone,
          o.items.map((i) => `${i.name} x${i.quantity}`).join("；"),
          o.total,
          orderStatusMap[o.status].label,
          o.paymentMethod,
          o.createdAt,
        ]),
      ]
    )
  }

  function updateStatus(id: string, status: Order["status"]) {
    setItems((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    )
    setDetail((d) => (d?.id === id ? { ...d, status } : d))
    toast.success(`订单已更新为「${orderStatusMap[status].label}」`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">订单管理</h1>
          <p className="text-sm text-muted-foreground">共 {items.length} 条订单</p>
        </div>
        <Button variant="outline" onClick={exportOrders}>
          <Download />
          导出 CSV
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索订单号、客户..."
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
            {statusOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
          <span className="text-sm text-muted-foreground">
            已选 {selected.size} 项
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={bulkShip}>
              <Truck className="size-3.5" />
              批量发货
            </Button>
            <Button variant="outline" size="sm" onClick={bulkCancel}>
              <X className="size-3.5" />
              批量取消
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
                <TableHead>订单号</TableHead>
                <TableHead>客户</TableHead>
                <TableHead>商品数</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>支付方式</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>下单时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    没有找到匹配的订单
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((order) => {
                  const status = orderStatusMap[order.status]
                  const count = order.items.reduce((s, i) => s + i.quantity, 0)
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(order.id)}
                          onCheckedChange={() => toggleOne(order.id)}
                          aria-label={`选择 ${order.orderNo}`}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {order.orderNo}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{order.customer}</span>
                          <span className="text-xs text-muted-foreground">
                            {order.customerPhone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {count}
                      </TableCell>
                      <TableCell className="font-medium">
                        ¥{order.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.paymentMethod}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.badge}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {order.createdAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDetail(order)}
                        >
                          <Eye />
                          详情
                        </Button>
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
        <DialogContent className="sm:max-w-xl">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle>订单 {detail.orderNo}</DialogTitle>
                <DialogDescription>
                  {detail.createdAt} · {detail.paymentMethod}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-1 rounded-lg bg-muted/50 p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">客户</span>
                    <span>
                      {detail.customer} {detail.customerPhone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">收货地址</span>
                    <span className="max-w-[70%] text-right">{detail.address}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {detail.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border p-3 text-sm"
                    >
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ¥{item.price.toLocaleString()} × {item.quantity}
                        </span>
                      </div>
                      <span className="font-medium">
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">订单状态</span>
                  <Badge variant={orderStatusMap[detail.status].badge}>
                    {orderStatusMap[detail.status].label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">合计</span>
                  <span className="text-lg font-semibold text-primary">
                    ¥{detail.total.toLocaleString()}
                  </span>
                </div>
              </div>
              <DialogFooter className="flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {detail.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(detail.id, "cancelled")}
                      >
                        <X />
                        取消订单
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(detail.id, "paid")}
                      >
                        确认收款
                      </Button>
                    </>
                  )}
                  {detail.status === "paid" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(detail.id, "shipped")}
                    >
                      <Truck />
                      标记发货
                    </Button>
                  )}
                  {detail.status === "shipped" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(detail.id, "completed")}
                    >
                      <CheckCheck />
                      确认完成
                    </Button>
                  )}
                  {detail.status === "refunding" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(detail.id, "completed")}
                    >
                      同意退款
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
