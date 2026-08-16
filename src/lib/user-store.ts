import { promises as fs } from "node:fs"
import path from "node:path"
import crypto from "node:crypto"

export type UserRole = "admin" | "user"
export type UserStatus = "active" | "banned" | "pending"

export type StoredUser = {
  id: string
  username: string
  email: string
  avatar: string | null
  role: UserRole
  status: UserStatus
  createdAt: string
}

type UserRecord = StoredUser & {
  passwordHash: string
  salt: string
}

const DEFAULT_USERNAME = "admin"
const DEFAULT_PASSWORD = "admin123"
const DEFAULT_EMAIL = "admin@example.com"

function dataDir() {
  return path.join(process.cwd(), "data")
}

function storePath() {
  return path.join(dataDir(), "users.json")
}

function scryptHash(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString("hex")
}

function toPublic(user: UserRecord): StoredUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  }
}

async function loadRecords(): Promise<UserRecord[]> {
  try {
    const raw = await fs.readFile(storePath(), "utf-8")
    return JSON.parse(raw) as UserRecord[]
  } catch {
    const admin = await createSeedAdmin()
    return [admin]
  }
}

async function saveRecords(records: UserRecord[]) {
  await fs.mkdir(dataDir(), { recursive: true })
  await fs.writeFile(storePath(), JSON.stringify(records, null, 2), "utf-8")
}

async function createSeedAdmin(): Promise<UserRecord> {
  const salt = crypto.randomBytes(16).toString("hex")
  const record: UserRecord = {
    id: "u-admin",
    username: DEFAULT_USERNAME,
    email: DEFAULT_EMAIL,
    avatar: null,
    role: "admin",
    status: "active",
    createdAt: new Date().toISOString(),
    passwordHash: scryptHash(DEFAULT_PASSWORD, salt),
    salt,
  }
  await saveRecords([record])
  return record
}

export async function listUsers(): Promise<StoredUser[]> {
  const records = await loadRecords()
  return records.map(toPublic)
}

export async function findUserByUsername(username: string) {
  const records = await loadRecords()
  const user = records.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  )
  return user ? toPublic(user) : null
}

export async function findUserByEmail(email: string) {
  const records = await loadRecords()
  const user = records.find((u) => u.email.toLowerCase() === email.toLowerCase())
  return user ? toPublic(user) : null
}

export async function findUserById(id: string) {
  const records = await loadRecords()
  const user = records.find((u) => u.id === id)
  return user ? toPublic(user) : null
}

export async function verifyUser(username: string, password: string) {
  const records = await loadRecords()
  const user = records.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  )
  if (!user) return { ok: false, user: null }
  const hash = scryptHash(password, user.salt)
  const ok = crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(user.passwordHash, "hex")
  )
  if (!ok) return { ok: false, user: null }
  return { ok: true, user: toPublic(user) }
}

export async function createUser(input: {
  username: string
  email: string
  password: string
  role?: UserRole
}): Promise<StoredUser> {
  const records = await loadRecords()
  const salt = crypto.randomBytes(16).toString("hex")
  const record: UserRecord = {
    id: `u-${crypto.randomUUID().slice(0, 8)}`,
    username: input.username,
    email: input.email,
    avatar: null,
    role: input.role ?? "user",
    status: "active",
    createdAt: new Date().toISOString(),
    passwordHash: scryptHash(input.password, salt),
    salt,
  }
  records.push(record)
  await saveRecords(records)
  return toPublic(record)
}

export async function updateUserRole(id: string, role: UserRole) {
  const records = await loadRecords()
  const idx = records.findIndex((u) => u.id === id)
  if (idx === -1) return null
  records[idx] = { ...records[idx], role }
  await saveRecords(records)
  return toPublic(records[idx])
}

export async function updateUserStatus(id: string, status: UserStatus) {
  const records = await loadRecords()
  const idx = records.findIndex((u) => u.id === id)
  if (idx === -1) return null
  records[idx] = { ...records[idx], status }
  await saveRecords(records)
  return toPublic(records[idx])
}

export async function updateUserProfile(id: string, profile: {
  username: string
  email: string
  avatar?: string | null
}) {
  const records = await loadRecords()
  const idx = records.findIndex((u) => u.id === id)
  if (idx === -1) return null
  records[idx] = {
    ...records[idx],
    username: profile.username,
    email: profile.email,
    avatar: profile.avatar ?? records[idx].avatar,
  }
  await saveRecords(records)
  return toPublic(records[idx])
}

export async function updateUserPassword(
  id: string,
  currentPassword: string,
  newPassword: string
) {
  const records = await loadRecords()
  const idx = records.findIndex((u) => u.id === id)
  if (idx === -1) return { ok: false, error: "用户不存在" }

  const user = records[idx]
  const hash = scryptHash(currentPassword, user.salt)
  const ok = crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(user.passwordHash, "hex")
  )
  if (!ok) return { ok: false, error: "当前密码不正确" }
  if (newPassword.length < 6) {
    return { ok: false, error: "新密码长度不能少于 6 位" }
  }

  const salt = crypto.randomBytes(16).toString("hex")
  records[idx] = {
    ...user,
    passwordHash: scryptHash(newPassword, salt),
    salt,
  }
  await saveRecords(records)
  return { ok: true, error: null }
}