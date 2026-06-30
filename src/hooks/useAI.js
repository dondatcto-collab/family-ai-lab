import { useState, useCallback, useRef } from 'react'

const MODEL = 'gemini-1.5-flash'

const systemPrompt = (childName, phase, dayTitle) =>
`Bạn là Stu — người bạn thông minh, vui vẻ, kiên nhẫn đang học cùng ${childName || 'bé'} (10 tuổi) về chủ đề "${dayTitle}" trong Giai đoạn ${phase} của hành trình 30 ngày khám phá AI.

NGUYÊN TẮC KHÔNG ĐỔI:
• KHÔNG bao giờ trả lời thẳng khi bé có thể tự tìm ra — luôn hỏi ngược lại trước
• Mở đầu bằng: "Em nghĩ sao?", "Bạn thử đoán xem!", "Hmm thú vị!"
• Nếu bé sai → khen effort + gợi ý hướng: "Ý hay đó! Thử xem nếu..."
• Nếu bé đúng → ăn mừng cụ thể: "Chính xác! Em vừa tự khám phá ra..."
• Giải thích bằng ví dụ đời thường mà bé 10 tuổi biết
• Kết thúc MỖI câu trả lời bằng 1 câu hỏi mở để bé suy nghĩ tiếp
• Nếu bé hỏi làm hộ → "Mình tin bạn tự làm được! Thử bước đầu tiên xem?"
• Dùng emoji vừa phải 🌟

NGÔN NGỮ: Tiếng Việt thân thiện, dùng "mình" và "em".
ĐỘ DÀI: Tối đa 3-4 câu. Bé 10 tuổi không đọc đoạn dài.
GIỚI HẠN: Tối đa 3 gợi ý / buổi — sau đó khuyến khích bé nhờ phụ huynh.`

export function useAI(apiKey) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const hints = useRef(0)

  const startSession = useCallback((dayTitle, phase, childName) => {
    hints.current = 0
    setMessages([{
      role: 'assistant',
      content: `Chào ${childName || 'bạn'}! 🌟 Hôm nay mình cùng khám phá về "${dayTitle}" nhé! Bạn đã biết gì về chủ đề này chưa? Hãy kể mình nghe!`
    }])
    setError(null)
  }, [])

  const sendMessage = useCallback(async (text, dayTitle, phase, childName) => {
    if (!apiKey) { setError('Cần nhập Gemini API key — vào tab Phụ huynh → Cài đặt.'); return }
    if (!text.trim() || loading) return

    const userMsg = { role: 'user', content: text.trim() }
    const next = [...messages, userMsg]
    setMessages(next)
    loading = true
    setError(null)
    hints.current += 1

    try {
      const history = next.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt(childName, phase, dayTitle) }] },
            contents: [...history, { role: 'user', parts: [{ text: text.trim() }] }],
            generationConfig: { maxOutputTokens: 300, temperature: 0.8 },
          })
        }
      )

      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        if (res.status === 400) throw new Error('API key không hợp lệ. Kiểm tra lại trong Cài đặt.')
        if (res.status === 429) throw new Error('Đang dùng nhiều quá — thử lại sau vài giây nhé!')
        throw new Error(e.error?.message || `Lỗi ${res.status}`)
      }

      const data = await res.json()
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '...'
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [apiKey, messages, loading])

  const clearChat = useCallback(() => { setMessages([]); setError(null); hints.current = 0 }, [])

  return { messages, loading, error, hintCount: hints.current, startSession, sendMessage, clearChat }
}
