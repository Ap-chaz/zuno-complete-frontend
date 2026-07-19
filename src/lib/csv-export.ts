/**
 * Builds a CSV string from rows and triggers a browser download — entirely
 * client-side, no backend required. Handles quoting/escaping so commas,
 * quotes, and newlines inside values don't break the file.
 */
export interface CsvColumn<T> {
  header: string;
  accessor: (row: T) => string | number;
}

function escapeCsvValue(value: string | number): string {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCsv<T>(filename: string, rows: T[], columns: CsvColumn<T>[]) {
  const header = columns.map((c) => escapeCsvValue(c.header)).join(",");
  const body = rows.map((row) => columns.map((c) => escapeCsvValue(c.accessor(row))).join(",")).join("\n");
  const csv = `${header}\n${body}`;

  // Prepend a UTF-8 BOM so Excel opens accented/currency characters correctly.
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
