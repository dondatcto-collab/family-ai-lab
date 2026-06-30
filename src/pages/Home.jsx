import { DAYS, PHASES } from '../data/curriculum'

const TAG = {
  'Học':      { bg:'#eef2ff', color:'#4338ca' },
  'Chơi':     { bg:'#f0fdfa', color:'#0f766e' },
  'Tạo':      { bg:'#fffbeb', color:'#92400e' },
  'Khám phá': { bg:'#fdf4ff', color:'#7e22ce' },
  'Kỉ niệm':  { bg:'#fff1f2', color:'#9f1239' },
}

export default function Home({ state, onOpenDay }) {
  const { childName, completedDays, streak } = state
  const pct = Math.round(completedDays.length / 30 * 100)
  const nextDay = DAYS.find(d => !completedDays.includes(d.id))
  const today = new Date().toLocaleDateString('vi-VN', { weekday:'long', day:'numeric', month:'long' })

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'20px 16px 20px' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <p style={{ fontSize:13, color:'var(--text3)', marginBottom:2 }}>{today}</p>
          <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text)' }}>Xin chào, {childName}! 👋</h1>
        </div>
        <div style={{ textAlign:'center', background:'var(--surface)', borderRadius:12, padding:'8px 14px', boxShadow:'var(--sh)', minWidth:64 }}>
          <div style={{ fontSize:20 }}>🔥</div>
          <div style={{ fontSize:20, fontWeight:800, color:'var(--amber)', lineHeight:1 }}>{streak}</div>
          <div style={{ fontSize:10, color:'var(--text3)', fontWeight:700 }}>ngày liên tiếp</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background:'var(--surface)', borderRadius:'var(--r)', padding:18, marginBottom:14, boxShadow:'var(--sh)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
          <span style={{ fontSize:14, fontWeight:700 }}>Hành trình 30 ngày</span>
          <span style={{ fontSize:22, fontWeight:800, color:'var(--primary)' }}>{pct}%</span>
        </div>
        <div style={{ height:10, background:'var(--border)', borderRadius:99, overflow:'hidden', marginBottom:10 }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,var(--primary),#8b5cf6)', borderRadius:99, transition:'width .5s' }} />
        </div>
        <div style={{ display:'flex', gap:3, flexWrap:'wrap' }}>
          {Array.from({length:30}, (_,i) => {
            const done = completedDays.includes(i+1)
            return (
              <button key={i} onClick={() => onOpenDay(i+1)} title={`Ngày ${i+1}`}
                style={{ width:16, height:16, borderRadius:'50%', background: done ? 'var(--primary)' : 'var(--border)', border:'none', cursor:'pointer', transition:'transform .1s' }}
                onMouseEnter={e => e.target.style.transform='scale(1.3)'}
                onMouseLeave={e => e.target.style.transform=''} />
            )
          })}
        </div>
        <p style={{ marginTop:8, fontSize:12, color:'var(--text3)' }}>{completedDays.length} / 30 ngày hoàn thành</p>
      </div>

      {/* Next day CTA */}
      {nextDay && (
        <button onClick={() => onOpenDay(nextDay.id)}
          style={{ width:'100%', background:'var(--primary)', color:'#fff', borderRadius:'var(--r)', padding:'16px 20px', textAlign:'left', boxShadow:'var(--sh-lg)', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center', transition:'transform .1s' }}
          onMouseDown={e => e.currentTarget.style.transform='scale(.98)'}
          onMouseUp={e => e.currentTarget.style.transform=''}>
          <div>
            <p style={{ fontSize:11, opacity:.8, fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>
              Tiếp theo — Ngày {nextDay.id}
            </p>
            <p style={{ fontSize:17, fontWeight:800, lineHeight:1.3 }}>{nextDay.title}</p>
            <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
              {nextDay.tags.map(t => <span key={t} style={{ fontSize:11, padding:'2px 8px', borderRadius:99, background:'rgba(255,255,255,.2)', fontWeight:600 }}>{t}</span>)}
            </div>
          </div>
          <span style={{ fontSize:28, marginLeft:12 }}>▶</span>
        </button>
      )}

      {/* Phases */}
      {PHASES.map(phase => {
        const phaseDays = DAYS.filter(d => d.phase === phase.id)
        const done = phaseDays.filter(d => completedDays.includes(d.id)).length
        return (
          <div key={phase.id} style={{ marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:20 }}>{phase.emoji}</span>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:'var(--text)' }}>Giai đoạn {phase.id}: {phase.title}</div>
                  <div style={{ fontSize:11, color:'var(--text3)' }}>{phase.desc}</div>
                </div>
              </div>
              <span style={{ fontSize:13, fontWeight:800, color: done===phaseDays.length ? 'var(--green)' : 'var(--text3)' }}>
                {done}/{phaseDays.length}
              </span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(148px,1fr))', gap:8 }}>
              {phaseDays.map(day => {
                const isDone = completedDays.includes(day.id)
                return (
                  <button key={day.id} onClick={() => onOpenDay(day.id)}
                    style={{ background: isDone ? phase.bg : 'var(--surface)', border:`1.5px solid ${isDone ? phase.color : 'var(--border)'}`, borderRadius:'var(--r-sm)', padding:'12px 13px', textAlign:'left', cursor:'pointer', transition:'transform .1s', boxShadow: isDone ? 'none' : 'var(--sh)' }}
                    onMouseDown={e => e.currentTarget.style.transform='scale(.97)'}
                    onMouseUp={e => e.currentTarget.style.transform=''}>
                    <div style={{ fontSize:11, color: isDone ? phase.color : 'var(--text3)', fontWeight:800, marginBottom:3 }}>
                      {isDone ? '✓ ' : ''}Ngày {day.id}
                    </div>
                    <div style={{ fontSize:13, fontWeight:700, color: isDone ? phase.color : 'var(--text)', lineHeight:1.35 }}>
                      {day.title}
                    </div>
                    <div style={{ display:'flex', gap:4, marginTop:6, flexWrap:'wrap' }}>
                      {day.tags.slice(0,2).map(t => {
                        const c = TAG[t] || TAG['Học']
                        return <span key={t} style={{ fontSize:10, padding:'1px 6px', borderRadius:99, background:c.bg, color:c.color, fontWeight:700 }}>{t}</span>
                      })}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
