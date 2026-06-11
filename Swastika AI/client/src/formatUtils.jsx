import React from 'react'

function renderInlineElements(str, keyPrefix = '') {
  if (str == null) return null
  const parts = []
  const tokenRegex = /(\*\*(.+?)\*\*|`([^`]+)`|_(.+?)_|\*(.+?)\*)/g
  let lastIndex = 0
  let match
  let idx = 0

  while ((match = tokenRegex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.slice(lastIndex, match.index))
    }

    if (match[2] !== undefined) {
      parts.push(<strong key={`${keyPrefix}-b-${idx++}`}>{match[2]}</strong>)
    } else if (match[3] !== undefined) {
      parts.push(<code key={`${keyPrefix}-c-${idx++}`}>{match[3]}</code>)
    } else if (match[4] !== undefined || match[5] !== undefined) {
      const italicText = match[4] ?? match[5]
      parts.push(<em key={`${keyPrefix}-i-${idx++}`}>{italicText}</em>)
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < str.length) {
    parts.push(str.slice(lastIndex))
  }

  if (parts.length === 0) return ''
  if (parts.length === 1 && typeof parts[0] === 'string') return parts[0]

  return parts.map((p, i) => (typeof p === 'string' ? <span key={`${keyPrefix}-t-${i}`}>{p}</span> : p))
}

export function formatTextToElements(text) {
  let raw = String(text || '')
  raw = raw.replace(/<br\s*\/?>/gi, '\n')
  const lines = raw.split(/\r?\n/)
  const out = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (/^\s*$/.test(line)) {
      out.push(<br key={`br-${i}`} />)
      i += 1
      continue
    }

    // Table detection: consecutive lines containing '|'
    if (line.includes('|')) {
      const tableLines = []
      let j = i
      while (j < lines.length && lines[j].includes('|')) {
        tableLines.push(lines[j])
        j += 1
      }

      let rows = tableLines.map((l) => l.split('|').map((c) => c.trim()))

      // Remove separator rows (e.g. ---|--- or :---: rows)
      rows = rows.filter((r) => !r.every((cell) => /^:?-+:?$/.test(cell) || /^-+$/.test(cell)))

      if (rows.length === 0) {
        i = j
        continue
      }

      // Trim empty leading columns
      const trimEmptyEdges = (rowsArr) => {
        const hasCol = (colIdx) => rowsArr.some((r) => (r[colIdx] || '').trim() !== '')

        // Trim left
        while (rowsArr[0] && rowsArr[0].length > 0 && !hasCol(0)) {
          rowsArr.forEach((r) => r.shift())
        }
        // Trim right
        while (rowsArr[0] && rowsArr[0].length > 0 && !hasCol(rowsArr[0].length - 1)) {
          rowsArr.forEach((r) => r.pop())
        }
      }

      trimEmptyEdges(rows)

      const header = rows[0]
      const body = rows.slice(1)

      out.push(
        <table className="bubble-table" key={`table-${i}`}>
          <thead>
            <tr>
              {header.map((cell, ci) => (
                <th key={`h-${ci}`}>{renderInlineElements(cell, `h-${i}-${ci}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((r, ri) => (
              <tr key={`r-${ri}`}>
                {r.map((cell, ci) => (
                  <td key={`c-${ri}-${ci}`}>{renderInlineElements(cell, `c-${ri}-${ci}`)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )

      i = j
      continue
    }

    // Markdown-style headings: #, ##, ###
    const md = line.match(/^(#{1,6})\s+(.*)$/)
    if (md) {
      const level = Math.min(3, md[1].length)
      const Tag = `h${level}`
      const headingText = md[2].replace(/\s*\*\*$/,'').trim()
      out.push(<Tag key={`md-${i}`} className={`bubble-heading bubble-h${level}`}>{renderInlineElements(headingText, `md-${i}`)}</Tag>)
      i += 1
      continue
    }

    const doubleStarHeading = line.match(/^\*\*\s*(.*?)(?:\s*\*\*)?$/)
    if (doubleStarHeading) {
      const headingText = doubleStarHeading[1].trim()
      out.push(<h2 key={`ds-${i}`} className="bubble-heading bubble-h2">{renderInlineElements(headingText, `ds-${i}`)}</h2>)
      i += 1
      continue
    }

    // Lines that start with one or more special characters (e.g. '- ', '* ', '• ')
    const special = line.match(/^[\-\*•=\>\_]{1,}\s*(.*)$/)
    if (special) {
      out.push(<h4 key={`sp-${i}`} className="bubble-heading bubble-h4">{renderInlineElements(special[1], `sp-${i}`)}</h4>)
      i += 1
      continue
    }

    // Default: paragraph (supports inline bold)
    out.push(<p key={`p-${i}`} className="bubble-paragraph">{renderInlineElements(line, `p-${i}`)}</p>)
    i += 1
  }

  return out
}
