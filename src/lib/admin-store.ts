import { promises as fs } from "node:fs"
import path from "node:path"
import crypto from "node:crypto"

export type AdminProfile = {
  username: string
  email: string
  avatar: string | null
}

type AdminRecord = AdminProfile & {
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
  return path.join(dataDir(), "admin.json")
}

function scryptHash(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString("hex")
}

async function loadRecord(): Promise<AdminRecord> {
  try {
    const raw = await fs.readFile(storePath(), "utf-8")
    return JSON.parse(raw) as AdminRecord
  } catch {
    const salt = crypto.randomBytes(16).toString("hex")
    const record: AdminRecord = {
      username: DEFAULT_USERNAME,
      email: DEFAULT_EMAIL,
      avatar: null,
      passwordHash: scryptHash(DEFAULT_PASSWORD, salt),
      salt,
    }
    await saveRecord(record)
    return record
  }
}

async function saveRecord(record: AdminRecord) {
  await fs.mkdir(dataDir(), { recursive: true })
  await fs.writeFile(storePath(), JSON.stringify(record, null, 2), "utf-8")
}

export async function verifyAdminPassword(username: string, password: string) {
  const record = await loadRecord()
  const hash = scryptHash(password, record.salt)
  const ok = crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(record.passwordHash, "hex")
  )
  return { ok, record }
}

export async function getAdminProfile(): Promise<AdminProfile> {
  const record = await loadRecord()
  return {
    username: record.username,
    email: record.email,
    avatar: record.avatar,
  }
}

export async function updateAdminProfile(profile: AdminProfile) {
  const record = await loadRecord()
  await saveRecord({ ...record, ...profile })
  return getAdminProfile()
}

export async function updateAdminPassword(
  currentPassword: string,
  newPassword: string
) {
  const record = await loadRecord()
  const hash = scryptHash(currentPassword, record.salt)
  const ok = crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(record.passwordHash, "hex")
  )
  if (!ok) {
    return { ok: false, error: "当前密码不正确" }
  }
  if (newPassword.length < 6) {
    return { ok: false, error: "新密码长度不能少于 6 位" }
  }
  const salt = crypto.randomBytes(16).toString("hex")
  await saveRecord({ ...record, passwordHash: scryptHash(newPassword, salt), salt })
  return { ok: true, error: null }
}