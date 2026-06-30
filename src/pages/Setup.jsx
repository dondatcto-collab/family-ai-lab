import { useState } from 'react'

const s = {
  wrap: { minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, background:'var(--bg)' },
  card: { width:'100%', maxWidth:420, background:'var(--surface)', borderRadius:'var(--r)', padding:28, boxShadow:'var(--sh-lg)' },
  input: { width:'100%', padding:'14px 16px', borderRadius:'var(--r-sm)', border:'2px solid var(--border)', fontSize:16, outline:'none', fontFamily:'inherit', color:'var(--text)', background:'var(--surface)' },
  btnPrimary: { width:'100%', padding:14, background:'var(--primary)', color:'#fff', borderRadius:'var(--r-sm)', fontSize:16, fontWeight:800, transition:'opacity .15s' },
  btnSecondary: { flex:1, padding:14, background:'var(--surface2)', borderRadius:'var(--r-sm)', fontSize:15, fontWeight:700, color:'var(--text2)', border:'1.5px solid var(--border)' },
  label: { fontSize:13, fontWeight:700, color:'var(--text2)', display:'block', marginBottom:6 },
  muted: { fontSize:12, color:'var(--text3)', marginBottom:16, lineHeight:1.6 },
}

export default function Setup({ onComplete }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [key, setKey] = useState('')

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:52, marginBottom:10 }}>🚀</div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'var(--primary)', marginBottom:6 }}>Family AI Learning Lab</h1>
          <p style={{ fontSize:14, color:'var(--text2)' }}>Phòng học AI 30 ngày cho gia đình</p>
        </div>

        {step === 1 && (
          <>
            <p style={{ fontSize:11, fontWeight:800, color:'var(--text3)', letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>Bước 1 / 2</p>
            <h2 style={{ fontSize:19, fontWeight:800, marginBottom:6 }}>Bé tên gì? 👋</h2>
            <p style={{ ...s.muted, marginBottom:16 }}>AI gia sư Stu sẽ gọi tên bé trong suốt hành trình.</p>
            <label style={s.label} htmlFor="childname">Tên bé</label>
            <input id="childname" style={s.input} placeholder="VD: An, Bình, Mai..." value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
              onFocus={e => e.target.style.borderColor='var(--primary)'}
              onBlur={e => e.target.style.borderColor='var(--border)'}
              autoFocus />
            <button style={{ ...s.btnPrimary, marginTop:16, opacity: name.trim() ? 1 : 0.4 }}
              onClick={() => name.trim() && setStep(2)}>
              Tiếp theo →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ fontSize:11, fontWeight:800, color:'var(--text3)', letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>Bước 2 / 2</p>
            <h2 style={{ fontSize:19, fontWeight:800, marginBottom:6 }}>Nhập Gemini API Key 🔑</h2>
            <p style={s.muted}>
              Lấy miễn phí tại <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
                style={{ color:'var(--primary)' }}>aistudio.google.com</a><br />
              🔒 Key chỉ lưu trên máy bạn, không gửi đi đâu ngoài Google AI.
            </p>
            <label style={s.label} htmlFor="apikey">Gemini API Key</label>
            <input id="apikey" type="password" style={{ ...s.input, fontFamily:'monospace', fontSize:14 }}
              placeholder="AIzaSy..."  value={key} onChange={e => setKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onComplete({ childName:name.trim(), apiKey:key.trim() })}
              onFocus={e => e.target.style.borderColor='var(--primary)'}
              onBlur={e => e.target.style.borderColor='var(--border)'}
              autoFocus />
            <p style={{ ...s.muted, marginTop:8 }}>Có thể bỏ qua và nhập sau trong Cài đặt.</p>
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button style={s.btnSecondary} onClick={() => setStep(1)}>← Quay lại</button>
              <button style={{ ...s.btnPrimary, flex:2 }}
                onClick={() => onComplete({ childName:name.trim(), apiKey:key.trim() })}>
                Bắt đầu hành trình! 🌟
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
