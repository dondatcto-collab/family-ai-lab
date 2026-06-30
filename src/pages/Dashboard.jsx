import { useState } from 'react'
import { DAYS, PHASES } from '../data/curriculum'

function Stat({ icon, value, label, color }) {
  return (
    <div style={{ background:'var(--surface2)', borderRadius:'var(--r-sm)', padding:'12px 14px', flex:1, minWidth:0 }}>
      <div style={{ fontSize:18, marginBottom:2 }}>{icon}</div>
      <div style={{ fontSize:24, fontWeight:800, color: color || 'var(--text)', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:11, color:'var(--text3)', marginTop:3, fontWeight:700 }}>{label}</div>
    </div>
  )
}

export default function Dashboard({ state, onUpdate, onReset }) {
  const [tab, setTab] = useState('overview')
  const [newKey, setNewKey] = useState(state.apiKey || '')
  const [newName, setNewName] = useState(state.childName || '')
  const [saved, setSaved] = useState(false)

  const { childName, completedDays, streak, totalHints, selfSolvedCount, sessions, journalEntries } = state
  const pct = Math.round(completedDays.length / 30 * 100)
  const selfRate = completedDays.length > 0 ? Math.round(selfSolvedCount / completedDays.length * 100) : 0
  const avgHints = completedDays.length > 0 ? (totalHints / completedDays.length).toFixed(1) : '0'
  const journalCount = Object.keys(journalEntries).length

  const weakDays = completedDays
    .filter(id => sessions[id] && sessions[id].hintsUsed >= 3 && !sessions[id].selfSolved)
    .map(id => ({ id, ...sessions[id], day: DAYS.find(d => d.id === id) }))

  const strongDays = completedDays
    .filter(id => sessions[id]?.selfSolved)
    .map(id => ({ id, day: DAYS.find(d => d.id === id) }))

  const saveSettings = () => {
    onUpdate({ apiKey: newKey.trim(), childName: newName.trim() || childName })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const SUB = [['overview','📊 Tổng quan'],['progress','📈 Tiến độ'],['journal','📓 Nhật ký'],['settings','⚙️ Cài đặt']]

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'20px 16px 20px' }}>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:2 }}>Dashboard phụ huynh 👨‍👩‍👧</h1>
      <p style={{ fontSize:13, color:'var(--text3)', marginBottom:18 }}>Theo dõi hành trình của {childName}</p>

      <div style={{ display:'flex', gap:6, marginBottom:20, flexWrap:'wrap' }}>
        {SUB.map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:'8px 14px', borderRadius:8, fontSize:13, fontWeight:800, cursor:'pointer',
              background: tab===t ? 'var(--primary)' : 'var(--surface)',
              color: tab===t ? '#fff' : 'var(--text2)',
              border: tab===t ? 'none' : '1.5px solid var(--border)', boxShadow: tab===t ? 'none' : 'var(--sh)' }}>
            {l}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div>
          <div style={{ display:'flex', gap:8, marginBottom:14 }}>
            <Stat icon="🎯" value={`${pct}%`} label="Hoàn thành" color="var(--primary)" />
            <Stat icon="🔥" value={streak} label="Ngày liên tiếp" color="var(--amber)" />
            <Stat icon="💪" value={`${selfRate}%`} label="Tự giải được" color="var(--green)" />
            <Stat icon="📓" value={journalCount} label="Nhật ký ghi" color="var(--teal)" />
          </div>

          {/* Overall bar */}
          <div style={{ background:'var(--surface)', borderRadius:'var(--r)', padding:18, marginBottom:14, boxShadow:'var(--sh)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontWeight:800, fontSize:14 }}>Hành trình 30 ngày</span>
              <span style={{ fontSize:13, color:'var(--text2)' }}>{completedDays.length}/30</span>
            </div>
            <div style={{ height:10, background:'var(--border)', borderRadius:99, overflow:'hidden', marginBottom:12 }}>
              <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,var(--primary),#8b5cf6)', borderRadius:99 }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
              {PHASES.map(ph => {
                const d = ph.days.filter(id => completedDays.includes(id)).length
                const t = ph.days.length
                return (
                  <div key={ph.id} style={{ background:ph.bg, borderRadius:'var(--r-sm)', padding:'10px 12px' }}>
                    <div style={{ fontSize:14, marginBottom:3 }}>{ph.emoji}</div>
                    <div style={{ fontSize:12, fontWeight:800, color:ph.color }}>{ph.title}</div>
                    <div style={{ fontSize:14, fontWeight:800, color:ph.color, marginTop:2 }}>{d}/{t}</div>
                    <div style={{ height:4, background:`${ph.color}25`, borderRadius:99, marginTop:5, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${Math.round(d/t*100)}%`, background:ph.color, borderRadius:99 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Analytics */}
          <div style={{ background:'var(--surface)', borderRadius:'var(--r)', padding:18, marginBottom:14, boxShadow:'var(--sh)' }}>
            <p style={{ fontWeight:800, marginBottom:12, fontSize:14 }}>📊 Phân tích học tập</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div style={{ background:'var(--primary-lt)', borderRadius:'var(--r-sm)', padding:12 }}>
                <p style={{ fontSize:12, color:'var(--primary)', fontWeight:800, marginBottom:4 }}>💡 Gợi ý TB/ngày</p>
                <p style={{ fontSize:24, fontWeight:800, color:'var(--primary)' }}>{avgHints}</p>
                <p style={{ fontSize:11, color:'var(--primary)', marginTop:3 }}>{Number(avgHints) <= 2 ? '✨ Bé đang rất độc lập!' : 'Cần hỗ trợ vừa phải'}</p>
              </div>
              <div style={{ background:'var(--green-lt)', borderRadius:'var(--r-sm)', padding:12 }}>
                <p style={{ fontSize:12, color:'var(--green)', fontWeight:800, marginBottom:4 }}>🏆 Bài tự giải</p>
                <p style={{ fontSize:24, fontWeight:800, color:'var(--green)' }}>{selfSolvedCount}</p>
                <p style={{ fontSize:11, color:'var(--green)', marginTop:3 }}>/ {completedDays.length} ngày đã học</p>
              </div>
            </div>
          </div>

          {weakDays.length > 0 && (
            <div style={{ background:'var(--rose-lt)', borderRadius:'var(--r)', padding:16, marginBottom:12, border:'1px solid #fecdd3' }}>
              <p style={{ fontWeight:800, color:'var(--rose)', marginBottom:10, fontSize:14 }}>⚠️ Cần chú ý ({weakDays.length} ngày)</p>
              {weakDays.slice(0,3).map(s => (
                <div key={s.id} style={{ fontSize:13, color:'#9f1239', marginBottom:4, paddingLeft:10, borderLeft:'3px solid var(--rose)' }}>
                  <strong>Ngày {s.id}:</strong> {s.day?.title} — dùng {s.hintsUsed} gợi ý
                </div>
              ))}
              <p style={{ fontSize:12, color:'#9f1239', marginTop:8, fontStyle:'italic' }}>💡 Ôn lại cùng bé hoặc hỏi AI gia sư để làm rõ hơn.</p>
            </div>
          )}

          {strongDays.length > 0 && (
            <div style={{ background:'var(--green-lt)', borderRadius:'var(--r)', padding:16, border:'1px solid #a7f3d0' }}>
              <p style={{ fontWeight:800, color:'var(--green)', marginBottom:10, fontSize:14 }}>🌟 Điểm mạnh ({strongDays.length} ngày tự giải)</p>
              {strongDays.slice(-3).reverse().map(s => (
                <div key={s.id} style={{ fontSize:13, color:'#065f46', marginBottom:4, paddingLeft:10, borderLeft:'3px solid var(--green)' }}>
                  <strong>Ngày {s.id}:</strong> {s.day?.title}
                </div>
              ))}
            </div>
          )}

          {completedDays.length === 0 && (
            <div style={{ textAlign:'center', padding:40, color:'var(--text3)' }}>
              <div style={{ fontSize:48, marginBottom:10 }}>🌱</div>
              <p style={{ fontSize:16, fontWeight:800, color:'var(--text2)' }}>Hành trình chưa bắt đầu</p>
              <p style={{ fontSize:14 }}>Mở tab Học để bắt đầu Ngày 1!</p>
            </div>
          )}
        </div>
      )}

      {/* ── PROGRESS ── */}
      {tab === 'progress' && (
        <div>
          <p style={{ fontWeight:800, marginBottom:14, fontSize:14 }}>📈 Chi tiết từng ngày</p>
          {completedDays.length === 0
            ? <div style={{ textAlign:'center', padding:40, color:'var(--text3)' }}>
                <div style={{ fontSize:40 }}>📋</div><p style={{ marginTop:8 }}>Chưa có dữ liệu. Hãy bắt đầu học!</p>
              </div>
            : [...completedDays].sort((a,b) => b-a).map(id => {
                const s = sessions[id] || {}
                const d = DAYS.find(x => x.id === id)
                const ph = PHASES.find(p => p.days.includes(id))
                return (
                  <div key={id} style={{ background:'var(--surface)', borderRadius:'var(--r-sm)', padding:'12px 14px', marginBottom:8, border:'1px solid var(--border)', display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:ph?.bg || 'var(--primary-lt)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{ph?.emoji}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:800, color:'var(--text)', marginBottom:3 }}>Ngày {id}: {d?.title}</p>
                      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                        {s.duration && <span style={{ fontSize:11, color:'var(--text3)' }}>⏱ {s.duration} phút</span>}
                        {s.hintsUsed !== undefined && <span style={{ fontSize:11, color:'var(--text3)' }}>💡 {s.hintsUsed} gợi ý</span>}
                        {s.selfSolved && <span style={{ fontSize:11, color:'var(--green)', fontWeight:800 }}>💪 Tự giải</span>}
                      </div>
                      {s.completedAt && <p style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{new Date(s.completedAt).toLocaleDateString('vi-VN')}</p>}
                    </div>
                    <span style={{ fontSize:18 }}>{s.selfSolved ? '⭐' : '✅'}</span>
                  </div>
                )
              })
          }
        </div>
      )}

      {/* ── JOURNAL ── */}
      {tab === 'journal' && (
        <div>
          <p style={{ fontWeight:800, marginBottom:4, fontSize:14 }}>📓 Nhật ký của {childName}</p>
          <p style={{ fontSize:13, color:'var(--text3)', marginBottom:16 }}>Đã ghi {journalCount} / {completedDays.length} ngày</p>
          {Object.keys(journalEntries).length === 0
            ? <div style={{ textAlign:'center', padding:40, color:'var(--text3)' }}>
                <div style={{ fontSize:40 }}>📓</div><p style={{ marginTop:8 }}>Chưa có nhật ký. Bé ghi sau mỗi buổi học nhé!</p>
              </div>
            : Object.entries(journalEntries).sort(([a],[b]) => Number(b)-Number(a)).map(([dayId, entry]) => {
                const d = DAYS.find(x => x.id === Number(dayId))
                return (
                  <div key={dayId} style={{ background:'var(--surface)', borderRadius:'var(--r-sm)', padding:16, marginBottom:10, border:'1px solid var(--border)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
                      <p style={{ fontSize:13, fontWeight:800, color:'var(--primary)' }}>Ngày {dayId}: {d?.title}</p>
                      <p style={{ fontSize:11, color:'var(--text3)', flexShrink:0 }}>{new Date(entry.savedAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.7, whiteSpace:'pre-wrap' }}>{entry.text}</p>
                  </div>
                )
              })
          }
        </div>
      )}

      {/* ── SETTINGS ── */}
      {tab === 'settings' && (
        <div>
          <div style={{ background:'var(--surface)', borderRadius:'var(--r)', padding:20, boxShadow:'var(--sh)', marginBottom:14 }}>
            <p style={{ fontWeight:800, marginBottom:16, fontSize:14 }}>⚙️ Cài đặt</p>

            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:13, fontWeight:800, color:'var(--text2)', display:'block', marginBottom:6 }}>Tên bé</label>
              <input value={newName} onChange={e => setNewName(e.target.value)}
                style={{ width:'100%', padding:'12px 14px', borderRadius:'var(--r-sm)', border:'1.5px solid var(--border)', fontSize:15, outline:'none', fontFamily:'inherit', background:'var(--surface)', color:'var(--text)' }}
                onFocus={e => e.target.style.borderColor='var(--primary)'}
                onBlur={e => e.target.style.borderColor='var(--border)'} />
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:13, fontWeight:800, color:'var(--text2)', display:'block', marginBottom:4 }}>Gemini API Key</label>
              <p style={{ fontSize:12, color:'var(--text3)', marginBottom:6 }}>
                Lấy miễn phí tại <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color:'var(--primary)' }}>aistudio.google.com</a>
              </p>
              <input type="password" value={newKey} onChange={e => setNewKey(e.target.value)}
                placeholder="AIzaSy..."
                style={{ width:'100%', padding:'12px 14px', borderRadius:'var(--r-sm)', border:'1.5px solid var(--border)', fontSize:14, outline:'none', fontFamily:'monospace', background:'var(--surface)', color:'var(--text)' }}
                onFocus={e => e.target.style.borderColor='var(--primary)'}
                onBlur={e => e.target.style.borderColor='var(--border)'} />
            </div>

            <button onClick={saveSettings}
              style={{ width:'100%', padding:14, background: saved ? 'var(--green)' : 'var(--primary)', color:'#fff', borderRadius:'var(--r-sm)', fontSize:15, fontWeight:800, cursor:'pointer', transition:'background .3s' }}>
              {saved ? '✓ Đã lưu!' : '💾 Lưu cài đặt'}
            </button>
          </div>

          <div style={{ background:'var(--rose-lt)', borderRadius:'var(--r)', padding:20, border:'1.5px solid #fecdd3' }}>
            <p style={{ fontWeight:800, color:'var(--rose)', marginBottom:8, fontSize:14 }}>⚠️ Xóa toàn bộ dữ liệu</p>
            <p style={{ fontSize:13, color:'#9f1239', marginBottom:14 }}>Xóa tất cả tiến độ, nhật ký và cài đặt. Không thể hoàn tác!</p>
            <button onClick={() => { if (window.confirm('Bạn chắc chắn muốn xóa toàn bộ? Dữ liệu sẽ mất hết!')) onReset() }}
              style={{ padding:'10px 20px', background:'var(--rose)', color:'#fff', borderRadius:'var(--r-sm)', fontSize:14, fontWeight:800, cursor:'pointer' }}>
              🗑 Xóa tất cả và bắt đầu lại
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
