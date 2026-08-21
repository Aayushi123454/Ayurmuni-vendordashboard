export function exportToCsv(filename, rows, columns) {
  if (!rows?.length) return;

  const headers = columns.map((c) => c.label || c.key);
  const keys = columns.map((c) => c.key);

  const escape = (val) => {
    const str = val == null ? "" : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [
    headers.join(","),
    ...rows.map((row) => keys.map((k) => escape(typeof k === "function" ? k(row) : row[k])).join(",")),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function extractApiErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.detail ||
    err?.message ||
    "Something went wrong"
  );
}
