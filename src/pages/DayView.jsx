import { useState, useEffect, useRef } from 'react'
import { DAYS, getPhase } from '../data/curriculum'
import { useAI } from '../hooks/useAI'

function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const send = () => { if (text.trim() && !disabled) { onSend(text.trim()); setText('') } }
  return (
    <div style={{ padding:'10px 14px', background:'var(--surface)', borderTop:'1px solid var(--border)', display:'flex', gap:8 }}>
      <input value={text} onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
        placeholder="Hỏi AI gia sư Stu..." disabled={disabled}
        style={{ flex:1, padding:'10px 14px', borderRadius:99, border:'1.5px solid var(--border)', fontSize:15, outline:'none', fontFamily:'inherit', background:'var(--surface)', color:'var(--text)' }}
        onFocus={e => e.target.style.borderColor='var(--primary)'}
        onBlur={e => e.target.style.borderColor='var(--border)'} />
      <button onClick={send} disabled={!text.trim() || disabled}
        style={{ width:44, height:44, borderRadius:'50%', background: (text.trim() && !disabled) ? 'var(--primary)' : 'var(--border)', color:'#fff', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background .2s' }}>
        ➤
      </button>
    </div>
  )
}

export default function DayView({ dayId, state, onBack, onComplete, onSaveJournal }) {
  const day = DAYS.find(d => d.id === dayId)
  const phase = getPhase(dayId)
  const [tab, setTab] = useState('guide')
  const [journal, setJournal] = useState(state.journalEntries[dayId]?.text || '')
  const [selfSolved, setSelfSolved] = useState(false)
  const [saved, setSaved] = useState(false)
  const sessionStart = useRef(Date.now())
  const chatInited = useRef(false)
  const bottomRef = useRef(null)
  const isDone = state.completedDays.includes(dayId)
  const ai = useAI(state.apiKey)

  useEffect(() => {
    if (tab === 'chat' && !chatInited.current && day) {
      chatInited.current = true
      ai.startSession(day.title, phase.id, state.childName)
    }
  }, [tab])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ai.messages, ai.loading])

  if (!day) return null

  const handleComplete = () => {
    const duration = Math.round((Date.now() - sessionStart.current) / 60000)
    if (journal.trim()) onSaveJournal(dayId, journal)
    onComplete(dayId, { hintsUsed: ai.hintCount, selfSolved, duration })
    onBack()
  }

  const handleSaveJournal = () => {
    if (journal.trim()) { onSaveJournal(dayId, journal); setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  const pc = phase.color
  const pb = phase.bg

  return (
    <div style={{ maxWidth:680, margin:'0 auto', minHeight:'100dvh', display:'flex', flexDirection:'column', background:'var(--bg)' }}>
      {/* Header */}
      <div style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'12px 14px', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <button onClick={onBack} style={{ background:'var(--surface2)', border:'1px solid var(--border)', color:'var(--text2)', fontSize:15, padding:'6px 12px', borderRadius:8 }}>← Về</button>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:11, color:pc, fontWeight:800, textTransform:'uppercase', letterSpacing:.5, marginBottom:1 }}>
              {phase.emoji} Ngày {dayId} / 30 — {phase.title}
            </p>
            <h1 style={{ fontSize:15, fontWeight:800, color:'var(--text)', lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{day.title}</h1>
          </div>
          {isDone && <span style={{ fontSize:11, background:'var(--green-lt)', color:'var(--green)', padding:'4px 10px', borderRadius:99, fontWeight:800, flexShrink:0 }}>✓ Xong</span>}
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {[['guide','📋 Hướng dẫn'], ['chat','🤖 Chat AI'], ['journal','📓 Nhật ký']].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, padding:'8px 2px', borderRadius:8, fontSize:12, fontWeight:800, cursor:'pointer',
                background: tab===t ? pc : 'var(--surface2)',
                color: tab===t ? '#fff' : 'var(--text2)',
                border: tab===t ? 'none' : '1px solid var(--border)' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflow:'auto', padding:16 }}>

        {/* ── GUIDE ── */}
        {tab === 'guide' && (
          <div>
            <div style={{ background:pb, borderRadius:'var(--r)', padding:16, marginBottom:14, borderLeft:`4px solid ${pc}` }}>
              <p style={{ fontSize:12, fontWeight:800, color:pc, marginBottom:4 }}>🎯 MỤC TIÊU HÔM NAY</p>
              <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.65 }}>{day.goal}</p>
            </div>
            <p style={{ fontSize:12, fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:.5, marginBottom:8 }}>Hoạt động</p>
            {day.activities.map((a, i) => (
              <div key={i} style={{ display:'flex', gap:12, background:'var(--surface)', borderRadius:'var(--r-sm)', padding:'12px 14px', marginBottom:8, border:'1px solid var(--border)' }}>
                <span style={{ fontWeight:800, color:pc, flexShrink:0, minWidth:20 }}>{i+1}.</span>
                <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.6, margin:0 }}>{a}</p>
              </div>
            ))}
            <div style={{ background:'var(--amber-lt)', borderRadius:'var(--r-sm)', padding:'12px 14px', marginTop:8, display:'flex', gap:10, border:'1px solid #fde68a' }}>
              <span style={{ flexShrink:0 }}>💡</span>
              <p style={{ fontSize:13, color:'#92400e', lineHeight:1.55, margin:0, fontStyle:'italic' }}>{day.tip}</p>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:18 }}>
              <button onClick={() => setTab('chat')}
                style={{ flex:1, padding:14, background:'var(--primary)', color:'#fff', borderRadius:'var(--r)', fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:'var(--sh-lg)' }}>
                🤖 Hỏi AI gia sư →
              </button>
              <button onClick={() => setTab('journal')}
                style={{ flex:1, padding:14, background:'var(--teal)', color:'#fff', borderRadius:'var(--r)', fontSize:14, fontWeight:800, cursor:'pointer' }}>
                📓 Nhật ký →
              </button>
            </div>
          </div>
        )}

        {/* ── CHAT ── */}
        {tab === 'chat' && (
          <div>
            {!state.apiKey && (
              <div style={{ background:'var(--rose-lt)', borderRadius:'var(--r-sm)', padding:12, marginBottom:12, fontSize:13, color:'var(--rose)', border:'1px solid #fecdd3' }}>
                ⚠️ Chưa có Gemini API key. Vào <strong>tab Phụ huynh → Cài đặt</strong> để nhập key từ aistudio.google.com.
              </div>
            )}
            {ai.messages.map((m, i) => (
              <div key={i} style={{ display:'flex', flexDirection: m.role==='user' ? 'row-reverse' : 'row', gap:8, marginBottom:14, alignItems:'flex-end' }}>
                {m.role === 'assistant' && (
                  <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>🤖</div>
                )}
                <div style={{
                  maxWidth:'78%', padding:'10px 14px',
                  borderRadius: m.role==='user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  background: m.role==='user' ? 'var(--primary)' : 'var(--surface)',
                  color: m.role==='user' ? '#fff' : 'var(--text)',
                  fontSize:14, lineHeight:1.65, boxShadow:'var(--sh)',
                  border: m.role==='assistant' ? '1px solid var(--border)' : 'none',
                  whiteSpace:'pre-wrap'
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {ai.loading && (
              <div style={{ display:'flex', gap:8, alignItems:'flex-end', marginBottom:14 }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🤖</div>
                <div style={{ padding:'12px 16px', borderRadius:'4px 16px 16px 16px', background:'var(--surface)', border:'1px solid var(--border)', display:'flex', gap:5 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'var(--text3)', animation:`bounce .8s ${i*.16}s ease-in-out infinite` }} />)}
                </div>
              </div>
            )}
            {ai.error && (
              <div style={{ padding:'10px 14px', background:'var(--rose-lt)', borderRadius:'var(--r-sm)', fontSize:13, color:'var(--rose)', marginBottom:12, border:'1px solid #fecdd3' }}>
                ❌ {ai.error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* ── JOURNAL ── */}
        {tab === 'journal' && (
          <div>
            <p style={{ fontSize:14, color:'var(--text2)', marginBottom:12, lineHeight:1.65 }}>
              Ghi lại những gì bé học được, cảm nhận, hoặc câu hỏi còn thắc mắc. Không cần hoàn hảo! ✍️
            </p>
            <textarea value={journal} onChange={e => setJournal(e.target.value)} rows={7}
              placeholder={"Hôm nay mình học được rằng...\nMình thấy thú vị khi...\nMình vẫn đang thắc mắc về..."}
              style={{ width:'100%', padding:14, borderRadius:'var(--r-sm)', border:'2px solid var(--border)', fontSize:14, lineHeight:1.7, resize:'vertical', outline:'none', fontFamily:'inherit', color:'var(--text)', background:'var(--surface)' }}
              onFocus={e => e.target.style.borderColor='var(--primary)'}
              onBlur={e => e.target.style.borderColor='var(--border)'} />
            <button onClick={handleSaveJournal}
              style={{ marginTop:10, padding:'10px 20px', background: saved ? 'var(--green)' : 'var(--teal)', color:'#fff', borderRadius:'var(--r-sm)', fontSize:14, fontWeight:800, cursor:'pointer', transition:'background .3s' }}>
              {saved ? '✓ Đã lưu!' : '💾 Lưu nhật ký'}
            </button>

            {!isDone && (
              <div style={{ marginTop:22, background:'var(--surface)', borderRadius:'var(--r)', padding:20, border:'2px solid var(--border)' }}>
                <p style={{ fontSize:15, fontWeight:800, marginBottom:12 }}>Đánh dấu hoàn thành ngày {dayId}?</p>
                <label style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, cursor:'pointer' }}>
                  <input type="checkbox" checked={selfSolved} onChange={e => setSelfSolved(e.target.checked)}
                    style={{ width:18, height:18, cursor:'pointer', accentColor:'var(--primary)' }} />
                  <span style={{ fontSize:14, color:'var(--text2)' }}>Bé tự làm được phần lớn mà không cần AI gợi ý nhiều 💪</span>
                </label>
                <button onClick={handleComplete}
                  style={{ width:'100%', padding:16, background:'var(--green)', color:'#fff', borderRadius:'var(--r-sm)', fontSize:16, fontWeight:800, cursor:'pointer', boxShadow:'var(--sh-lg)' }}>
                  ✅ Hoàn thành ngày {dayId}!
                </button>
              </div>
            )}
            {isDone && (
              <div style={{ marginTop:20, background:'var(--green-lt)', borderRadius:'var(--r-sm)', padding:16, textAlign:'center', border:'1px solid #a7f3d0' }}>
                <p style={{ fontSize:15, fontWeight:800, color:'var(--green)' }}>🎉 Ngày {dayId} đã hoàn thành!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {tab === 'chat' && (
        <ChatInput
          onSend={(text) => ai.sendMessage(text, day.title, phase.id, state.childName)}
          disabled={ai.loading || !state.apiKey} />
      )}

      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
    </div>
  )
}
