import { useEffect, useState } from 'react'
import { formatTextToElements } from './formatUtils.jsx'
import logo from './assets/logo.png'

const API_URL = 'http://localhost:3000/ai/chat'

function App() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me anything and I will answer like a chat assistant.' }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const extractContent = (result) => {
    if (typeof result === 'string') return result
    if (result?.content && typeof result.content === 'string') return result.content
    if (Array.isArray(result?.choices)) {
      return result.choices
        .map((choice) => choice?.message?.content ?? choice?.text ?? null)
        .filter(Boolean)
        .join('\n\n')
    }
    return 'No response received.'
  }

  const sendMessage = async (event) => {
    event.preventDefault()
    if (!prompt.trim()) return

    const userMessage = { role: 'user', content: prompt.trim() }
    setMessages((prev) => [...prev, userMessage])
    setPrompt('')
    setLoading(true)
    setError('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userMessage.content })
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const data = await response.json()
      const assistantResult = extractContent(data?.result)
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantResult }])
    } catch (err) {
      setError('Unable to fetch response from the backend. Please check server status.')
    } finally {
      setLoading(false)
    }
  }

  const renderNestedContent = (content) => {
    if (typeof content === 'string') {
      return <div className="formatted-text">{formatTextToElements(content)}</div>
    }

    if (content === null || content === undefined) {
      return <em>null</em>
    }

    if (Array.isArray(content)) {
      return (
        <div className="nested-list">
          {content.map((item, index) => (
            <div key={index} className="nested-item">
              {renderNestedContent(item)}
            </div>
          ))}
        </div>
      )
    }

    if (typeof content === 'object') {
      const entries = Object.entries(content)
      return (
        <div className="nested-object">
          {entries.map(([key, value]) => (
            <div key={key} className="nested-entry">
              <strong>{key}:</strong>
              <div className="nested-value">{renderNestedContent(value)}</div>
            </div>
          ))}
        </div>
      )
    }

    return <span>{String(content)}</span>
  }

  const renderMessage = (message) => {
    return renderNestedContent(message.content)
  }

  return (
    <div className="app-shell">
      <div className="chat-card">
        <header className="chat-header">
          <div className="brand">
            <img src={logo} alt="Logo" className="site-logo" />
            <div>
              <h1>Swastika AI Chat</h1>
              <p>Connects to the backend and renders replies in chat format.</p>
            </div>
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-pressed={theme === 'light'}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <span className="theme-toggle-track">
              <span className="theme-toggle-thumb" />
            </span>
            <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
        </header>

        <div className="message-window">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-row ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
            >
              <div className="message-bubble">
                {renderMessage(message)}
              </div>
            </div>
          ))}
        </div>

        <form className="chat-form" onSubmit={sendMessage}>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                sendMessage(event)
              }
            }}
            placeholder="Type your question here..."
            rows={2}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>

        {error && <div className="error-banner">{error}</div>}
      </div>
    </div>
  )
}

export default App
