import type { Citation } from '../services/chat'
import type { WorkspaceSummary } from '../services/summary'
import {
  asAction,
  asAssumption,
  asBudget,
  asDate,
  asDecision,
  asMetric,
  asQuestion,
  asRisk,
} from '../services/summary'

function line(s: string) {
  return s.replace(/\r\n/g, '\n').trim()
}

export function briefToMarkdown(summary: WorkspaceSummary, workspaceName?: string): string {
  const decisions = summary.key_decisions.map(asDecision)
  const budget = (summary.budget_items ?? []).map(asBudget)
  const assumptions = (summary.assumptions ?? []).map(asAssumption)
  const metrics = (summary.metrics ?? []).map(asMetric)
  const questions = summary.open_questions.map(asQuestion)
  const risks = summary.risks.map(asRisk)
  const dates = summary.important_dates.map(asDate)
  const actions = summary.action_items.map(asAction)
  const owners = summary.owners ?? []

  const parts: string[] = [
    `# Decision Brief${workspaceName ? `: ${workspaceName}` : ''}`,
    '',
    summary.generated_at
      ? `_Generated ${new Date(summary.generated_at).toLocaleString()}_`
      : '_Saved brief_',
    '',
    '## Overview',
    '',
    line(summary.overview) || '_No overview_',
    '',
  ]

  if (budget.length) {
    parts.push('## Budget & pricing', '')
    for (const item of budget) {
      parts.push(
        `- **${item.label}**: ${item.amount}${item.notes ? ` (${item.notes})` : ''}${
          item.currency ? ` · ${item.currency}` : ''
        }`,
      )
    }
    parts.push('')
  }

  if (owners.length) {
    parts.push('## Owners', '')
    for (const o of owners) {
      parts.push(`- **${o.name}**${o.owns?.length ? `: ${o.owns.join(', ')}` : ''}`)
    }
    parts.push('')
  }

  if (decisions.length) {
    parts.push('## Key decisions', '')
    for (const d of decisions) {
      const meta = [d.status, d.owner && `owner: ${d.owner}`, d.confidence && `confidence: ${d.confidence}`]
        .filter(Boolean)
        .join(' · ')
      parts.push(`### ${line(d.text)}`)
      if (meta) parts.push(`_${meta}_`)
      if (d.rationale) parts.push('', `Why: ${line(d.rationale)}`)
      if (d.sources?.length) {
        parts.push('', `Sources: ${d.sources.map((s) => s.filename).join(', ')}`)
      }
      parts.push('')
    }
  }

  if (assumptions.length) {
    parts.push('## Assumptions', '')
    for (const a of assumptions) {
      parts.push(`- ${line(a.text)}${a.owner ? ` (${a.owner})` : ''}`)
    }
    parts.push('')
  }

  if (metrics.length) {
    parts.push('## Metrics', '')
    for (const m of metrics) {
      parts.push(`- **${m.name}**: ${m.target}${m.owner ? ` · ${m.owner}` : ''}`)
    }
    parts.push('')
  }

  if (risks.length) {
    parts.push('## Risks & conflicts', '')
    for (const r of risks) {
      const kind = r.type ?? r.risk_type
      parts.push(
        `- ${line(r.text)}${kind ? ` [${kind}]` : ''}${r.severity ? ` · ${r.severity}` : ''}`,
      )
    }
    parts.push('')
  }

  if (dates.length) {
    parts.push('## Important dates', '')
    for (const d of dates) {
      parts.push(
        `- **${d.label}**: ${d.date ?? '—'}${
          d.conflict_with ? ` · conflicts with ${d.conflict_with}` : ''
        }`,
      )
    }
    parts.push('')
  }

  if (actions.length) {
    parts.push('## Action items', '')
    for (const a of actions) {
      parts.push(
        `- ${line(a.text)}${a.owner ? ` · ${a.owner}` : ''}${a.due_date ? ` · due ${a.due_date}` : ''}${
          a.status ? ` · ${a.status}` : ''
        }`,
      )
    }
    parts.push('')
  }

  if (questions.length) {
    parts.push('## Open questions', '')
    for (const q of questions) {
      parts.push(`- ${line(q.text)}`)
    }
    parts.push('')
  }

  return parts.join('\n').trim() + '\n'
}

export function answerToMarkdown(content: string, citations?: Citation[] | null): string {
  const parts = [line(content), '']
  if (citations?.length) {
    parts.push('## Sources', '')
    citations.forEach((c, i) => {
      const meta = [
        c.page_number != null ? `p.${c.page_number}` : null,
        c.score != null ? `${Math.round(c.score * 100)}% match` : null,
      ]
        .filter(Boolean)
        .join(' · ')
      parts.push(`${i + 1}. **${c.filename}**${meta ? ` (${meta})` : ''}`)
      if (c.excerpt) parts.push(`   > ${line(c.excerpt).slice(0, 280)}`)
    })
    parts.push('')
  }
  return parts.join('\n').trim() + '\n'
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function downloadText(filename: string, text: string, mime = 'text/markdown;charset=utf-8') {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function mdInlineToHtml(md: string): string {
  // Escape first, then light markdown: **bold**, _italic_, and line breaks
  let html = escapeHtml(md)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/(^|[\s(])_(.+?)_([\s).,]|$)/g, '$1<em>$2</em>$3')
  return html.replace(/\n/g, '<br/>')
}

/** Printable HTML report — browser "Save as PDF" produces the PDF deliverable. */
export function briefToPrintHtml(summary: WorkspaceSummary, workspaceName?: string): string {
  const md = briefToMarkdown(summary, workspaceName)
  const body = md
    .split('\n')
    .map((raw) => {
      const t = raw.trimEnd()
      if (!t) return '<div class="gap"></div>'
      if (t.startsWith('# ')) return `<h1>${mdInlineToHtml(t.slice(2))}</h1>`
      if (t.startsWith('## ')) return `<h2>${mdInlineToHtml(t.slice(3))}</h2>`
      if (t.startsWith('### ')) return `<h3>${mdInlineToHtml(t.slice(4))}</h3>`
      if (t.startsWith('- ')) return `<li>${mdInlineToHtml(t.slice(2))}</li>`
      return `<p>${mdInlineToHtml(t)}</p>`
    })
    .join('\n')
    // wrap consecutive li into ul
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (block) => `<ul>${block}</ul>`)

  const title = escapeHtml(workspaceName ? `Decision Brief: ${workspaceName}` : 'Decision Brief')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <style>
    @page { margin: 18mm 16mm; }
    body {
      font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
      color: #1a1a1a;
      line-height: 1.45;
      font-size: 11pt;
      max-width: 720px;
      margin: 0 auto;
      padding: 24px 20px 40px;
    }
    h1 { font-size: 20pt; margin: 0 0 8px; letter-spacing: -0.02em; }
    h2 {
      font-size: 12pt;
      margin: 22px 0 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid #ccc;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #333;
    }
    h3 { font-size: 11pt; margin: 14px 0 4px; }
    p { margin: 0 0 8px; }
    ul { margin: 0 0 10px; padding-left: 1.2em; }
    li { margin: 0 0 4px; }
    .gap { height: 4px; }
    .meta {
      font-size: 9pt;
      color: #666;
      margin-bottom: 20px;
    }
    .hint {
      margin-top: 28px;
      padding-top: 12px;
      border-top: 1px dashed #bbb;
      font-size: 9pt;
      color: #888;
    }
    @media print {
      .hint { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <p class="meta">Debrief · Decision Brief report</p>
  ${body}
  <p class="hint">Use your browser’s print dialog → Save as PDF.</p>
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); }, 250);
    });
  </script>
</body>
</html>`
}

/** Opens a print window so the user can Save as PDF. Returns false if popup blocked. */
export function printBriefAsPdf(summary: WorkspaceSummary, workspaceName?: string): boolean {
  const html = briefToPrintHtml(summary, workspaceName)
  const win = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700')
  if (!win) return false
  win.document.open()
  win.document.write(html)
  win.document.close()
  return true
}
