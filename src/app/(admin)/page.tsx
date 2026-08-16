import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { dashboardStats, orderStatusMap, formatCurrency } from "@/lib/data"
import { RevenueTrendChart, CategoryShareChart } from "@/components/admin/charts"
import Link from "next/link"

const stats = [
  {
    title: "总销售额",
    value: formatCurrency(dashboardStats.totalRevenue),
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "今日订单",
    value: dashboardStats.todayOrders.toLocaleString(),
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "商品总数",
    value: dashboardStats.totalSales.toLocaleString(),
    change: "+24",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "活跃用户",
    value: dashboardStats.activeUsers.toLocaleString(),
    change: "-3.1%",
    trend: "down",
    icon: Users,
  },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">仪表盘</h1>
        <p className="text-sm text-muted-foreground">
          欢迎回来，这里是商城运营概览
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isUp = stat.trend === "up"
          return (
            <Card key={stat.title}>
              <CardContent className="flex items-start justify-between p-6">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p
                    className={`flex items-center gap-0.5 text-xs ${
                      isUp ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {isUp ? (
                      <ArrowUpRight className="size-3.5" />
                    ) : (
                      <ArrowDownRight className="size-3.5" />
                    )}
                    较上月 {stat.change}
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>近 7 日销售趋势</CardTitle>
            <CardDescription>每日营收与订单量</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueTrendChart data={dashboardStats.revenueTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>分类销售占比</CardTitle>
            <CardDescription>按商品类目统计</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryShareChart data={dashboardStats.categoryShare} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>最近订单</CardTitle>
              <CardDescription>最新 6 条订单</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/orders" />}
              nativeButton={false}
            >
              查看全部
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单号</TableHead>
                  <TableHead>客户</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardStats.recentOrders.map((order) => {
                  const status = orderStatusMap[order.status]
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.orderNo}
                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="font-medium">
                        ¥{order.total.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.badge}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {order.createdAt}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>热销商品</CardTitle>
              <CardDescription>按销量排行</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/products" />}
              nativeButton={false}
            >
              全部商品
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {dashboardStats.topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ¥{p.price.toLocaleString()} · 已售 {p.sales.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
