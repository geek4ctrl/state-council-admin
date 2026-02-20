import { Injectable } from '@angular/core';

type ExportValue = string | number | boolean | Date | null | undefined;

type PdfMetaItem = {
  label: string;
  value: string;
};

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  downloadCsv(filename: string, headers: string[], rows: ExportValue[][]): void {
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => this.formatCsvValue(value)).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    this.triggerDownload(blob, filename);
  }

  downloadPdf(
    filename: string,
    title: string,
    headers: string[],
    rows: ExportValue[][],
    meta: PdfMetaItem[] = []
  ): void {
    const win = window.open('', '_blank', 'noopener,noreferrer');
    if (!win) {
      return;
    }

    const metaHtml = meta.length
      ? `<div class="meta">${meta
          .map((item) => `<div><span>${this.escapeHtml(item.label)}:</span> ${this.escapeHtml(item.value)}</div>`)
          .join('')}</div>`
      : '';

    const headerHtml = headers.map((header) => `<th>${this.escapeHtml(header)}</th>`).join('');
    const bodyHtml = rows
      .map((row) =>
        `<tr>${row
          .map((value) => `<td>${this.escapeHtml(this.formatDisplayValue(value))}</td>`)
          .join('')}</tr>`
      )
      .join('');

    win.document.write(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${this.escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
    h1 { font-size: 20px; margin: 0 0 12px; }
    .meta { margin-bottom: 16px; font-size: 12px; color: #4b5563; }
    .meta span { font-weight: 600; color: #111827; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    th { text-transform: uppercase; letter-spacing: 0.4px; font-size: 10px; color: #6b7280; }
    tr:nth-child(even) td { background: #f9fafb; }
  </style>
</head>
<body>
  <h1>${this.escapeHtml(title)}</h1>
  ${metaHtml}
  <table>
    <thead><tr>${headerHtml}</tr></thead>
    <tbody>${bodyHtml}</tbody>
  </table>
</body>
</html>`);

    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
    }, 250);
  }

  private formatCsvValue(value: ExportValue): string {
    const text = this.formatDisplayValue(value);
    const escaped = text.replace(/"/g, '""');
    return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
  }

  private formatDisplayValue(value: ExportValue): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    return String(value);
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
