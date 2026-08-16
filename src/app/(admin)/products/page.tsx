"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Pencil, Trash2, MoreHorizontal } from "lucide-react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { PaginationBar } from "@/components/admin/pagination-bar"

import { products as initialProducts, productStatusMap } from "@/lib/data"
import type { Product } from "@/lib/data"

const PAGE_SIZE = 8

const emptyForm = {
  name: "",
  category: "手机",
  price: "",
  stock: "",
  sku: "",
  description: "",
  status: "on_sale",
} satisfies FormState

type FormState = {
  name: string
  category: string
  price: string
  stock: string
  sku: string
  description: string
  status: Product["status"]
}

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = items.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const allPageSelected =
    pageItems.length > 0 && pageItems.every((p) => selected.has(p.id))

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(product: Product) {
    setEditing(product)
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      sku: product.sku,
      description: product.description ?? "",
      status: product.status,
    })
    setDialogOpen(true)
  }

  function saveProduct() {
    if (!form.name.trim()) {
      toast.error("请填写商品名称")
      return
    }
    const price = Number(form.price)
    const stock = Number(form.stock)
    if (!price || price <= 0) {
      toast.error("请填写正确的价格")
      return
    }

    if (editing) {
      setItems((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                name: form.name.trim(),
                category: form.category,
                price,
                stock,
                sku: form.sku || p.sku,
                description: form.description,
                status: stock === 0 ? "out_of_stock" : form.status,
              }
            : p
        )
      )
      toast.success("商品已更新")
    } else {
      const product: Product = {
        id: `p${Date.now()}`,
        name: form.name.trim(),
        category: form.category,
        price,
        stock,
        sales: 0,
        sku: form.sku || `SKU-${Date.now()}`,
        status: stock === 0 ? "out_of_stock" : form.status,
        createdAt: new Date().toISOString().slice(0, 10),
        description: form.description,
      }
      setItems((prev) => [product, ...prev])
      toast.success("商品已添加")
    }
    setDialogOpen(false)
  }

  function toggleStatus(product: Product) {
    const next: Product["status"] =
      product.status === "on_sale" ? "off_sale" : "on_sale"
    setItems((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: next } : p))
    )
    toast.success(next === "on_sale" ? "商品已上架" : "商品已下架")
  }

  function confirmDelete() {
    if (!deleting) return
    setItems((prev) => prev.filter((p) => p.id !== deleting.id))
    toast.success("商品已删除")
    setDeleting(null)
  }

  function toggleAllPage() {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allPageSelected) {
        pageItems.forEach((p) => next.delete(p.id))
      } else {
        pageItems.forEach((p) => next.add(p.id))
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

  function bulkToggleStatus() {
    if (selected.size === 0) return
    const target: Product["status"] =
      items.some((p) => selected.has(p.id) && p.status === "on_sale")
        ? "off_sale"
        : "on_sale"
    setItems((prev) =>
      prev.map((p) =>
        selected.has(p.id)
          ? { ...p, status: p.stock === 0 ? p.status : target }
          : p
      )
    )
    toast.success(
      target === "on_sale" ? `已批量上架 ${selected.size} 件商品` : `已批量下架 ${selected.size} 件商品`
    )
    setSelected(new Set())
  }

  function confirmBulkDelete() {
    if (selected.size === 0) return
    setItems((prev) => prev.filter((p) => !selected.has(p.id)))
    toast.success(`已删除 ${selected.size} 件商品`)
    setSelected(new Set())
    setBulkDeleting(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">商品管理</h1>
          <p className="text-sm text-muted-foreground">
            共 {items.length} 个商品，在售 {items.filter((p) => p.status === "on_sale").length} 个
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus />
          新增商品
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索商品名称或 SKU..."
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
            <SelectValue placeholder="全部状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="on_sale">在售</SelectItem>
            <SelectItem value="off_sale">已下架</SelectItem>
            <SelectItem value="out_of_stock">缺货</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
          <span className="text-sm text-muted-foreground">
            已选 {selected.size} 项
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={bulkToggleStatus}>
              批量{items.some((p) => selected.has(p.id) && p.status === "on_sale") ? "下架" : "上架"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleting(true)}
            >
              <Trash2 className="size-3.5" />
              批量删除
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
                <TableHead>商品</TableHead>
                <TableHead>类目</TableHead>
                <TableHead>价格</TableHead>
                <TableHead>库存</TableHead>
                <TableHead>销量</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    没有找到匹配的商品
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((product) => {
                  const status = productStatusMap[product.status]
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(product.id)}
                          onCheckedChange={() => toggleOne(product.id)}
                          aria-label={`选择 ${product.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">{product.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {product.sku}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {product.category}
                      </TableCell>
                      <TableCell className="font-medium">
                        ¥{product.price.toLocaleString()}
                      </TableCell>
                      <TableCell
                        className={
                          product.stock === 0
                            ? "text-destructive"
                            : product.stock < 20
                              ? "text-amber-600"
                              : ""
                        }
                      >
                        {product.stock}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.sales.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.badge}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon-sm">
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">操作</span>
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEdit(product)}>
                              <Pencil className="size-4" />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStatus(product)}>
                              {product.status === "on_sale" ? "下架" : "上架"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeleting(product)}
                            >
                              <Trash2 className="size-4" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "编辑商品" : "新增商品"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "修改商品信息，保存后立即生效"
                : "填写商品基本信息，创建后可在列表管理"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="product-name">商品名称</Label>
              <Input
                id="product-name"
                placeholder="请输入商品名称"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="product-category">类目</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm({ ...form, category: v ?? form.category })
                  }
                >
                  <SelectTrigger id="product-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="手机">手机</SelectItem>
                    <SelectItem value="耳机">耳机</SelectItem>
                    <SelectItem value="智能穿戴">智能穿戴</SelectItem>
                    <SelectItem value="厨房电器">厨房电器</SelectItem>
                    <SelectItem value="生活电器">生活电器</SelectItem>
                    <SelectItem value="男装">男装</SelectItem>
                    <SelectItem value="女装">女装</SelectItem>
                    <SelectItem value="箱包">箱包</SelectItem>
                    <SelectItem value="美妆个护">美妆个护</SelectItem>
                    <SelectItem value="食品生鲜">食品生鲜</SelectItem>
                    <SelectItem value="运动户外">运动户外</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product-status">状态</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      status: v as Product["status"] ?? form.status,
                    })
                  }
                >
                  <SelectTrigger id="product-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on_sale">在售</SelectItem>
                    <SelectItem value="off_sale">已下架</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="product-price">价格（元）</Label>
                <Input
                  id="product-price"
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product-stock">库存</Label>
                <Input
                  id="product-stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-sku">SKU</Label>
              <Input
                id="product-sku"
                placeholder="如 SCX-PRO-512"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-desc">商品描述</Label>
              <Textarea
                id="product-desc"
                placeholder="商品卖点、规格说明"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={saveProduct}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除商品？</AlertDialogTitle>
            <AlertDialogDescription>
              将删除「{deleting?.name}」，该操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={bulkDeleting}
        onOpenChange={(o) => !o && setBulkDeleting(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认批量删除？</AlertDialogTitle>
            <AlertDialogDescription>
              将删除已选的 {selected.size} 件商品，该操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
