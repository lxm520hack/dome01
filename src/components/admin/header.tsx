import { Bell, Search } from "lucide-react"

import { logout } from "@/app/actions/auth"
import { getSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export async function Header() {
  const session = await getSession()
  const username = session?.username || "管理员"

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger />
      <div className="relative hidden w-full max-w-sm md:block">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="搜索商品、订单、用户..." className="pl-8" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon-sm">
          <Bell className="size-4" />
          <span className="sr-only">通知</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-8 gap-2 px-1">
                <Avatar className="size-7">
                  <AvatarImage src="/avatar.png" alt={username} />
                  <AvatarFallback>{username.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm sm:inline">{username}</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>我的账号</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>个人资料</DropdownMenuItem>
            <DropdownMenuItem>修改密码</DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={logout}>
              <button
                type="submit"
                className="w-full rounded-md px-1.5 py-1 text-left text-sm text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                退出登录
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
