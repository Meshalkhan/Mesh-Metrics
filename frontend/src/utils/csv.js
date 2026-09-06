function escapeCell(value) {
  const cell = value == null ? "" : String(value);
  return /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
}

export function downloadCsv(filename, columns, rows) {
  const header = columns.map((col) => escapeCell(col.label)).join(",");
  const body = rows
    .map((row) => columns.map((col) => escapeCell(row[col.key])).join(","))
    .join("\n");
  const csv = `\uFEFF${header}\n${body}`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
