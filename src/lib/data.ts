export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  sales: number
  status: "on_sale" | "off_sale" | "out_of_stock"
  sku: string
  createdAt: string
  description?: string
}

export type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

export type Order = {
  id: string
  orderNo: string
  customer: string
  customerPhone: string
  items: OrderItem[]
  total: number
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled" | "refunding"
  paymentMethod: string
  address: string
  createdAt: string
}

export type User = {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  role: "admin" | "user"
  status: "active" | "banned" | "pending"
  orders: number
  totalSpent: number
  joinedAt: string
}

export type Category = {
  id: string
  name: string
  parentId: string | null
  products: number
}

export type DashboardStats = {
  totalSales: number
  todayOrders: number
  totalRevenue: number
  activeUsers: number
  revenueTrend: { day: string; revenue: number; orders: number }[]
  categoryShare: { name: string; value: number }[]
  recentOrders: Order[]
  topProducts: Product[]
}

export const categories: Category[] = [
  { id: "c1", name: "手机数码", parentId: null, products: 18 },
  { id: "c1-1", name: "手机", parentId: "c1", products: 8 },
  { id: "c1-2", name: "耳机", parentId: "c1", products: 5 },
  { id: "c1-3", name: "智能穿戴", parentId: "c1", products: 5 },
  { id: "c2", name: "家用电器", parentId: null, products: 24 },
  { id: "c2-1", name: "厨房电器", parentId: "c2", products: 9 },
  { id: "c2-2", name: "生活电器", parentId: "c2", products: 8 },
  { id: "c2-3", name: "个护健康", parentId: "c2", products: 7 },
  { id: "c3", name: "服饰鞋包", parentId: null, products: 32 },
  { id: "c3-1", name: "男装", parentId: "c3", products: 12 },
  { id: "c3-2", name: "女装", parentId: "c3", products: 14 },
  { id: "c3-3", name: "箱包", parentId: "c3", products: 6 },
  { id: "c4", name: "美妆个护", parentId: null, products: 15 },
  { id: "c5", name: "食品生鲜", parentId: null, products: 28 },
  { id: "c6", name: "运动户外", parentId: null, products: 19 },
]

export const products: Product[] = [
  {
    id: "p1",
    name: "星辰 X Pro 智能手机 512GB",
    category: "手机",
    price: 4999,
    stock: 128,
    sales: 3421,
    status: "on_sale",
    sku: "SCX-PRO-512",
    createdAt: "2025-12-01",
    description: "旗舰性能，徕卡影像，2K 曲面屏",
  },
  {
    id: "p2",
    name: "悦耳 Pro 无线降噪耳机",
    category: "耳机",
    price: 899,
    stock: 56,
    sales: 8920,
    status: "on_sale",
    sku: "YEAR-PRO-BK",
    createdAt: "2025-11-15",
    description: "主动降噪，40 小时续航",
  },
  {
    id: "p3",
    name: "智感智能手表 GT3",
    category: "智能穿戴",
    price: 1299,
    stock: 0,
    sales: 5102,
    status: "out_of_stock",
    sku: "ZGAN-GT3-SL",
    createdAt: "2025-10-20",
    description: "血氧监测，14 天长续航",
  },
  {
    id: "p4",
    name: "鲜烤箱 空气炸锅 5L",
    category: "厨房电器",
    price: 329,
    stock: 234,
    sales: 15200,
    status: "on_sale",
    sku: "XKA-FRY-5L",
    createdAt: "2025-09-08",
    description: "无油低脂，一键烘焙",
  },
  {
    id: "p5",
    name: "清风扫地机器人 R2",
    category: "生活电器",
    price: 2499,
    stock: 18,
    sales: 2043,
    status: "on_sale",
    sku: "QFR-R2-WH",
    createdAt: "2025-12-10",
    description: "激光导航，自动集尘",
  },
  {
    id: "p6",
    name: "简约纯棉圆领 T 恤",
    category: "男装",
    price: 79,
    stock: 980,
    sales: 33000,
    status: "on_sale",
    sku: "JY-TSHIRT-M",
    createdAt: "2025-08-12",
    description: "100% 精梳棉，亲肤透气",
  },
  {
    id: "p7",
    name: "法式收腰连衣裙",
    category: "女装",
    price: 259,
    stock: 0,
    sales: 8600,
    status: "off_sale",
    sku: "FS-DRESS-L",
    createdAt: "2025-07-25",
    description: "复古碎花，显瘦版型",
  },
  {
    id: "p8",
    name: "经典双肩包 15.6 英寸",
    category: "箱包",
    price: 199,
    stock: 320,
    sales: 12400,
    status: "on_sale",
    sku: "JDB-BACKPACK",
    createdAt: "2025-10-02",
    description: "防泼水，大容量多隔层",
  },
  {
    id: "p9",
    name: "玻尿酸保湿精华液 30ml",
    category: "美妆个护",
    price: 169,
    stock: 450,
    sales: 21000,
    status: "on_sale",
    sku: "BHS-ESSENCE-30",
    createdAt: "2025-11-01",
    description: "深层补水，敏感肌可用",
  },
  {
    id: "p10",
    name: "云南高山有机咖啡豆 1kg",
    category: "食品生鲜",
    price: 128,
    stock: 76,
    sales: 6800,
    status: "on_sale",
    sku: "YN-COFFEE-1KG",
    createdAt: "2025-12-18",
    description: "中度烘焙，坚果香气",
  },
  {
    id: "p11",
    name: "碳纤维羽毛球拍 4U",
    category: "运动户外",
    price: 459,
    stock: 65,
    sales: 4300,
    status: "on_sale",
    sku: "TXW-RACKET-4U",
    createdAt: "2025-09-30",
    description: "高弹性碳素，轻量易上手",
  },
  {
    id: "p12",
    name: "便携筋膜枪 Mini",
    category: "个护健康",
    price: 399,
    stock: 142,
    sales: 9800,
    status: "on_sale",
    sku: "BX-JMG-MINI",
    createdAt: "2025-10-28",
    description: "静音设计，多档调节",
  },
]

export const orders: Order[] = [
  {
    id: "o1",
    orderNo: "202601160001",
    customer: "张伟",
    customerPhone: "138****1234",
    items: [
      { productId: "p1", name: "星辰 X Pro 智能手机 512GB", price: 4999, quantity: 1 },
      { productId: "p2", name: "悦耳 Pro 无线降噪耳机", price: 899, quantity: 1 },
    ],
    total: 5898,
    status: "paid",
    paymentMethod: "支付宝",
    address: "浙江省杭州市西湖区文一西路 100 号",
    createdAt: "2026-01-16 10:24",
  },
  {
    id: "o2",
    orderNo: "202601160002",
    customer: "李娜",
    customerPhone: "139****5678",
    items: [
      { productId: "p4", name: "鲜烤箱 空气炸锅 5L", price: 329, quantity: 2 },
    ],
    total: 658,
    status: "pending",
    paymentMethod: "微信支付",
    address: "北京市朝阳区望京街道 88 号",
    createdAt: "2026-01-16 09:51",
  },
  {
    id: "o3",
    orderNo: "202601150001",
    customer: "王强",
    customerPhone: "137****9012",
    items: [
      { productId: "p6", name: "简约纯棉圆领 T 恤", price: 79, quantity: 3 },
      { productId: "p8", name: "经典双肩包 15.6 英寸", price: 199, quantity: 1 },
    ],
    total: 436,
    status: "shipped",
    paymentMethod: "支付宝",
    address: "上海市浦东新区张江高科技园区",
    createdAt: "2026-01-15 20:12",
  },
  {
    id: "o4",
    orderNo: "202601150002",
    customer: "赵敏",
    customerPhone: "136****3456",
    items: [
      { productId: "p9", name: "玻尿酸保湿精华液 30ml", price: 169, quantity: 1 },
      { productId: "p12", name: "便携筋膜枪 Mini", price: 399, quantity: 1 },
    ],
    total: 568,
    status: "completed",
    paymentMethod: "银行卡",
    address: "广东省深圳市南山区科技园",
    createdAt: "2026-01-15 16:05",
  },
  {
    id: "o5",
    orderNo: "202601140001",
    customer: "陈杰",
    customerPhone: "135****7890",
    items: [
      { productId: "p5", name: "清风扫地机器人 R2", price: 2499, quantity: 1 },
    ],
    total: 2499,
    status: "refunding",
    paymentMethod: "支付宝",
    address: "四川省成都市高新区天府大道",
    createdAt: "2026-01-14 14:33",
  },
  {
    id: "o6",
    orderNo: "202601140002",
    customer: "刘洋",
    customerPhone: "134****2345",
    items: [
      { productId: "p3", name: "智感智能手表 GT3", price: 1299, quantity: 1 },
    ],
    total: 1299,
    status: "cancelled",
    paymentMethod: "微信支付",
    address: "江苏省南京市鼓楼区中山路 1 号",
    createdAt: "2026-01-14 11:20",
  },
  {
    id: "o7",
    orderNo: "202601130001",
    customer: "孙悦",
    customerPhone: "133****6789",
    items: [
      { productId: "p10", name: "云南高山有机咖啡豆 1kg", price: 128, quantity: 4 },
    ],
    total: 512,
    status: "paid",
    paymentMethod: "支付宝",
    address: "湖北省武汉市武昌区中南路 66 号",
    createdAt: "2026-01-13 19:44",
  },
  {
    id: "o8",
    orderNo: "202601130002",
    customer: "周杰",
    customerPhone: "132****0123",
    items: [
      { productId: "p11", name: "碳纤维羽毛球拍 4U", price: 459, quantity: 2 },
    ],
    total: 918,
    status: "completed",
    paymentMethod: "微信支付",
    address: "福建省厦门市思明区莲前西路 5 号",
    createdAt: "2026-01-13 10:08",
  },
  {
    id: "o9",
    orderNo: "202601120001",
    customer: "吴芳",
    customerPhone: "131****4567",
    items: [
      { productId: "p7", name: "法式收腰连衣裙", price: 259, quantity: 1 },
    ],
    total: 259,
    status: "pending",
    paymentMethod: "货到付款",
    address: "山东省青岛市市南区香港中路 30 号",
    createdAt: "2026-01-12 15:36",
  },
  {
    id: "o10",
    orderNo: "202601120002",
    customer: "郑凯",
    customerPhone: "130****8901",
    items: [
      { productId: "p1", name: "星辰 X Pro 智能手机 512GB", price: 4999, quantity: 1 },
    ],
    total: 4999,
    status: "shipped",
    paymentMethod: "花呗",
    address: "湖南省长沙市岳麓区麓谷大道 2 号",
    createdAt: "2026-01-12 09:15",
  },
]

export const users: User[] = [
  {
    id: "u1",
    name: "张伟",
    email: "zhangwei@example.com",
    phone: "138****1234",
    role: "admin",
    status: "active",
    orders: 12,
    totalSpent: 12580,
    joinedAt: "2025-03-12",
  },
  {
    id: "u2",
    name: "李娜",
    email: "lina@example.com",
    phone: "139****5678",
    role: "user",
    status: "active",
    orders: 45,
    totalSpent: 38900,
    joinedAt: "2025-01-08",
  },
  {
    id: "u3",
    name: "王强",
    email: "wangqiang@example.com",
    phone: "137****9012",
    role: "user",
    status: "active",
    orders: 8,
    totalSpent: 7600,
    joinedAt: "2025-06-20",
  },
  {
    id: "u4",
    name: "赵敏",
    email: "zhaomin@example.com",
    phone: "136****3456",
    role: "user",
    status: "banned",
    orders: 3,
    totalSpent: 890,
    joinedAt: "2025-02-14",
  },
  {
    id: "u5",
    name: "陈杰",
    email: "chenjie@example.com",
    phone: "135****7890",
    role: "user",
    status: "active",
    orders: 21,
    totalSpent: 25600,
    joinedAt: "2024-12-01",
  },
  {
    id: "u6",
    name: "刘洋",
    email: "liuyang@example.com",
    phone: "134****2345",
    role: "user",
    status: "pending",
    orders: 0,
    totalSpent: 0,
    joinedAt: "2026-01-10",
  },
  {
    id: "u7",
    name: "孙悦",
    email: "sunyue@example.com",
    phone: "133****6789",
    role: "user",
    status: "active",
    orders: 67,
    totalSpent: 52300,
    joinedAt: "2024-09-15",
  },
  {
    id: "u8",
    name: "周杰",
    email: "zhoujie@example.com",
    phone: "132****0123",
    role: "user",
    status: "banned",
    orders: 2,
    totalSpent: 1590,
    joinedAt: "2025-05-30",
  },
]

export const dashboardStats: DashboardStats = {
  totalSales: 98642,
  todayOrders: 328,
  totalRevenue: 2856000,
  activeUsers: 45218,
  revenueTrend: [
    { day: "01-10", revenue: 320000, orders: 210 },
    { day: "01-11", revenue: 385000, orders: 248 },
    { day: "01-12", revenue: 298000, orders: 190 },
    { day: "01-13", revenue: 452000, orders: 302 },
    { day: "01-14", revenue: 398000, orders: 275 },
    { day: "01-15", revenue: 536000, orders: 356 },
    { day: "01-16", revenue: 468000, orders: 328 },
  ],
  categoryShare: [
    { name: "手机数码", value: 32 },
    { name: "家用电器", value: 24 },
    { name: "服饰鞋包", value: 18 },
    { name: "美妆个护", value: 12 },
    { name: "食品生鲜", value: 9 },
    { name: "运动户外", value: 5 },
  ],
  recentOrders: orders.slice(0, 6),
  topProducts: [...products].sort((a, b) => b.sales - a.sales).slice(0, 5),
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(value)
}

export const orderStatusMap: Record<Order["status"], { label: string; badge: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "待付款", badge: "outline" },
  paid: { label: "已付款", badge: "secondary" },
  shipped: { label: "已发货", badge: "default" },
  completed: { label: "已完成", badge: "secondary" },
  cancelled: { label: "已取消", badge: "destructive" },
  refunding: { label: "退款中", badge: "destructive" },
}

export const productStatusMap: Record<Product["status"], { label: string; badge: "default" | "secondary" | "destructive" | "outline" }> = {
  on_sale: { label: "在售", badge: "default" },
  off_sale: { label: "已下架", badge: "secondary" },
  out_of_stock: { label: "缺货", badge: "destructive" },
}
