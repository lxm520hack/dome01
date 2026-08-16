"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { categories as initialCategories } from "@/lib/data"
import type { Category } from "@/lib/data"

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>(initialCategories)
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(items.map((c) => c.id))
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: "", parentId: "none" })
  const [deleting, setDeleting] = useState<Category | null>(null)

  const roots = items.filter((c) => c.parentId === null)
  const childrenOf = (parentId: string) =>
    items.filter((c) => c.parentId === parentId)

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function openCreate(parentId: string | null = null) {
    setEditing(null)
    setForm({ name: "", parentId: parentId ?? "none" })
    setDialogOpen(true)
  }

  function openEdit(category: Category) {
    setEditing(category)
    setForm({ name: category.name, parentId: category.parentId ?? "none" })
    setDialogOpen(true)
  }

  function saveCategory() {
    if (!form.name.trim()) {
      toast.error("请输入分类名称")
      return
    }

    if (editing) {
      setItems((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? {
                ...c,
                name: form.name.trim(),
                parentId: form.parentId === "none" ? null : form.parentId,
              }
            : c
        )
      )
      toast.success("分类已更新")
    } else {
      const parentId = form.parentId === "none" ? null : form.parentId
      const category: Category = {
        id: `c${Date.now()}`,
        name: form.name.trim(),
        parentId,
        products: 0,
      }
      setItems((prev) => [...prev, category])
      if (parentId) {
        setExpanded((prev) => new Set(prev).add(parentId))
      }
      toast.success("分类已添加")
    }
    setDialogOpen(false)
  }

  function confirmDelete() {
    if (!deleting) return
    const idsToDelete = new Set<string>()
    const collect = (id: string) => {
      idsToDelete.add(id)
      items
        .filter((c) => c.parentId === id)
        .forEach((c) => collect(c.id))
    }
    collect(deleting.id)
    setItems((prev) => prev.filter((c) => !idsToDelete.has(c.id)))
    toast.success(`已删除分类及其 ${idsToDelete.size - 1} 个子分类`)
    setDeleting(null)
  }

  function renderTree(parentId: string | null, depth: number) {
    const nodes = parentId === null ? roots : childrenOf(parentId)
    return nodes.map((category) => {
      const children = childrenOf(category.id)
      const hasChildren = children.length > 0
      const isExpanded = expanded.has(category.id)

      return (
        <div key={category.id}>
          <div
            className="flex items-center gap-2 border-b py-2.5 last:border-b-0"
            style={{ paddingLeft: `${depth * 24 + 12}px` }}
          >
            <Button
              variant="ghost"
              size="icon-xs"
              className="size-6"
              onClick={() => hasChildren && toggle(category.id)}
              disabled={!hasChildren}
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )
              ) : null}
            </Button>
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className="size-4 shrink-0 text-amber-500" />
              ) : (
                <Folder className="size-4 shrink-0 text-amber-500" />
              )
            ) : (
              <Folder className="size-4 shrink-0 text-muted-foreground/60" />
            )}
            <span className="font-medium">{category.name}</span>
            <span className="text-xs text-muted-foreground">
              {category.products} 个商品
            </span>
            <div className="ml-auto flex gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => openCreate(category.id)}
              >
                <Plus className="size-3.5" />
                <span className="sr-only">新增子分类</span>
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => openEdit(category)}
              >
                <Pencil className="size-3.5" />
                <span className="sr-only">编辑</span>
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-destructive"
                onClick={() => setDeleting(category)}
              >
                <Trash2 className="size-3.5" />
                <span className="sr-only">删除</span>
              </Button>
            </div>
          </div>
          {hasChildren && isExpanded && renderTree(category.id, depth + 1)}
        </div>
      )
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">分类管理</h1>
          <p className="text-sm text-muted-foreground">
            共 {items.length} 个分类，{roots.length} 个一级分类
          </p>
        </div>
        <Button onClick={() => openCreate()}>
          <Plus />
          新增一级分类
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {renderTree(null, 0)}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "编辑分类" : "新增分类"}</DialogTitle>
            <DialogDescription>
              {editing ? "修改分类名称或所属上级" : "创建新的商品分类"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="category-name">分类名称</Label>
              <Input
                id="category-name"
                placeholder="请输入分类名称"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-parent">上级分类</Label>
              <Select
                value={form.parentId}
                onValueChange={(v) =>
                  setForm({ ...form, parentId: v ?? "none" })
                }
              >
                <SelectTrigger id="category-parent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无（一级分类）</SelectItem>
                  {roots
                    .filter((c) => c.id !== editing?.id)
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={saveCategory}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除分类？</AlertDialogTitle>
            <AlertDialogDescription>
              将删除「{deleting?.name}」及其所有子分类，该操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
