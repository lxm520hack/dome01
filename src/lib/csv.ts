function escapeCell(value: string | number): string {
  const text = String(value)
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export function exportCsv(filename: string, rows: (string | number)[][]) {
  const bom = "\uFEFF"
  const content = rows.map((row) => row.map(escapeCell).join(",")).join("\n")
  const blob = new Blob([bom + content], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}