'use client'
/* eslint-disable react/no-unescaped-entities */
import { Box, Button, Stack, TextField, Typography, Container } from '@mui/material'
import { useState, useRef, useEffect } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hey there! Ready to chat?",
    },
  ])
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    if (!message.trim()) return;  // Skip empty messages

    const userMessage = { role: 'user', content: message }
    const assistantMessage = { role: 'assistant', content: '...' }

    setMessage('')
    setMessages((prevMessages) => [...prevMessages, userMessage, assistantMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, userMessage]),
      })

      if (!response.ok) {
        throw new Error('Network error, please try again!')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        setMessages((prevMessages) => {
          const lastMessage = prevMessages.pop()
          return [...prevMessages, { ...lastMessage, content: text }]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { role: 'assistant', content: "🤖 Oops! Something went wrong. Try again later." },
      ])
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          width: '100%',
          bgcolor: 'primary.dark',
          color: 'white',
          p: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4">LinkedOut Support Assistant</Typography>
      </Box>

      <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <Stack direction="row" spacing={4} alignItems="flex-start">
          <Stack
            sx={{
              width: '100%',
              maxWidth: '600px',
              height: '70vh',
              borderRadius: 4,
              boxShadow: 4,
              bgcolor: 'white',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
              <Typography variant="h6">💬 Chat with LinkedOut Assistant</Typography>
            </Box>
            <Stack
              sx={{
                flexGrow: 1,
                p: 3,
                overflowY: 'auto',
                bgcolor: '#f9fafb',
              }}
              spacing={2}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: message.role === 'assistant' ? 'flex-start' : 'flex-end',
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: message.role === 'assistant' ? 'primary.light' : 'secondary.light',
                      color: message.role === 'assistant' ? 'primary.contrastText' : 'secondary.contrastText',
                    }}
                  >
                    {message.content}
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
              <TextField
                variant="outlined"
                placeholder="Type your message..."
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2,
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={sendMessage}
                sx={{ borderRadius: 2, fontWeight: 'bold' }}
              >
                Send 🚀
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ maxWidth: '400px', p: 2 }}>
            <Typography variant="h6" gutterBottom>
              About This Chat
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              Welcome to the LinkedOut Support Assistant! This chat interface is designed to help you get the answers
              you need, fast. Whether you are troubleshooting an issue or just looking for some advice, our assistant is here to assist.
              Start typing to begin your conversation!
            </Typography>
          </Box>
        </Stack>
      </Container>

      <Box
        sx={{
          width: '100%',
          bgcolor: 'primary.dark',
          color: 'white',
          p: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">© 2024 LinkedOut - All Rights Reserved</Typography>
      </Box>
    </Box>
  )
}
