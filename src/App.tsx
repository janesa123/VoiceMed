import { useState, useEffect, useRef } from 'react'

type Screen =
  | 'welcome'
  | 'language'
  | 'profile'
  | 'home'
  | 'scan'
  | 'scanning'
  | 'result'
  | 'history'
  | 'settings'
  | 'caregiver'

type VoiceState = 'idle' | 'listening' | 'understanding' | 'processing' | 'speaking' | 'error' | 'success'

interface Medicine {
  id: string
  name: string
  ingredient: string
  strength: string
  use: string
  expiry: string
  expiryStatus: 'valid' | 'expiring' | 'expired'
  warnings: string
  scanDate: string
}

const MEDICINES: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    ingredient: 'Paracetamol',
    strength: '500mg',
    use: 'Relieves mild to moderate pain and reduces fever',
    expiry: 'Dec 2026',
    expiryStatus: 'valid',
    warnings: 'Do not exceed 8 tablets in 24 hours. Avoid alcohol.',
    scanDate: 'Today, 10:42 AM',
  },
  {
    id: '2',
    name: 'Metformin 500mg',
    ingredient: 'Metformin Hydrochloride',
    strength: '500mg',
    use: 'Controls blood sugar in type 2 diabetes',
    expiry: 'Mar 2025',
    expiryStatus: 'expired',
    warnings: 'Take with food. Do not crush tablets.',
    scanDate: 'Yesterday, 3:15 PM',
  },
  {
    id: '3',
    name: 'Amlodipine 5mg',
    ingredient: 'Amlodipine Besylate',
    strength: '5mg',
    use: 'Treats high blood pressure and chest pain',
    expiry: 'Sep 2026',
    expiryStatus: 'expiring',
    warnings: 'May cause dizziness. Rise slowly from sitting.',
    scanDate: '2 days ago',
  },
]

function VoiceIndicator({ state }: { state: VoiceState }) {
  const colors: Record<VoiceState, string> = {
    idle: '#1E2A42',
    listening: '#14B8A6',
    understanding: '#8B5CF6',
    processing: '#F59E0B',
    speaking: '#14B8A6',
    error: '#EF4444',
    success: '#22C55E',
  }
  const color = colors[state]

  return (
    <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
      {(state === 'listening' || state === 'speaking') && (
        <>
          <div
            className="absolute rounded-full animate-pulse-ring"
            style={{ width: 96, height: 96, background: color, opacity: 0.15 }}
          />
          <div
            className="absolute rounded-full animate-pulse-ring-2"
            style={{ width: 96, height: 96, background: color, opacity: 0.1 }}
          />
        </>
      )}
      {state === 'processing' && (
        <div
          className="absolute rounded-full animate-spin-slow"
          style={{
            width: 100,
            height: 100,
            border: `3px solid transparent`,
            borderTopColor: color,
            borderRightColor: color,
          }}
        />
      )}
      <div
        className="relative rounded-full flex items-center justify-center transition-all duration-300"
        style={{ width: 80, height: 80, background: state === 'idle' ? '#0F1629' : color + '22', border: `2px solid ${color}` }}
      >
        {state === 'speaking' ? (
          <div className="flex items-end gap-1" style={{ height: 40 }}>
            {[...Array(7)].map((_, i) => (
              <div key={i} className="waveform-bar" style={{ height: 8 }} />
            ))}
          </div>
        ) : state === 'processing' ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" fill={color} />
            <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : state === 'error' ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M12 3L2 21h20L12 3z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          </svg>
        ) : state === 'success' ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="3" width="6" height="11" rx="3" stroke={color} strokeWidth="2" />
            <path d="M5 10a7 7 0 0014 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="17" x2="12" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </div>
  )
}

function VoiceStateLabel({ state }: { state: VoiceState }) {
  const labels: Record<VoiceState, string> = {
    idle: 'Tap or speak to begin',
    listening: 'Listening...',
    understanding: 'Understanding...',
    processing: 'Processing...',
    speaking: 'Speaking...',
    error: 'Please try again',
    success: 'Done!',
  }
  const colors: Record<VoiceState, string> = {
    idle: '#94A3B8',
    listening: '#14B8A6',
    understanding: '#8B5CF6',
    processing: '#F59E0B',
    speaking: '#14B8A6',
    error: '#EF4444',
    success: '#22C55E',
  }
  return (
    <p className="text-lg font-semibold tracking-wide animate-blink" style={{ color: colors[state], fontFamily: 'Nunito, sans-serif' }}>
      {labels[state]}
    </p>
  )
}

function CommandChip({ label, icon }: { label: string; icon: string }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
      style={{ background: '#172038', border: '1px solid #1E2A42', color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}
    >
      <span>{icon}</span>
      <span>"{label}"</span>
    </div>
  )
}

function ExpiryBadge({ status }: { status: Medicine['expiryStatus'] }) {
  const cfg = {
    valid: { label: 'Valid', bg: '#052E16', color: '#22C55E', border: '#166534' },
    expiring: { label: 'Expiring Soon', bg: '#451A03', color: '#F59E0B', border: '#92400E' },
    expired: { label: 'Expired', bg: '#450A0A', color: '#EF4444', border: '#7F1D1D' },
  }
  const c = cfg[status]
  return (
    <span
      className="text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontFamily: 'Nunito, sans-serif' }}
    >
      {c.label}
    </span>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [voiceState, setVoiceState] = useState<VoiceState>('listening')
  const [transcript, setTranscript] = useState('')
  const [appSpeaking, setAppSpeaking] = useState("Hello. How can I help you today?")
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [history] = useState<Medicine[]>(MEDICINES)
  const [scanProgress, setScanProgress] = useState(0)
  const [detectedLang] = useState('English')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const simulateVoiceSequence = (cmd: string, then: () => void, delay = 1200) => {
    setTranscript(cmd)
    setVoiceState('understanding')
    timerRef.current = setTimeout(() => {
      setVoiceState('processing')
      timerRef.current = setTimeout(() => {
        then()
        setVoiceState('speaking')
        timerRef.current = setTimeout(() => {
          setVoiceState('listening')
        }, 2000)
      }, 800)
    }, delay)
  }

  // Welcome → home after 3s
  useEffect(() => {
    if (screen === 'welcome') {
      timerRef.current = setTimeout(() => {
        simulateVoiceSequence('', () => {
          setScreen('home')
          setAppSpeaking('Welcome! What would you like to do?')
        }, 3000)
      }, 500)
    }
    if (screen === 'scanning') {
      setScanProgress(0)
      const interval = setInterval(() => {
        setScanProgress(p => {
          if (p >= 100) {
            clearInterval(interval)
            setVoiceState('success')
            setTimeout(() => {
              setSelectedMedicine(MEDICINES[0])
              setScreen('result')
              setVoiceState('speaking')
              setAppSpeaking('Medicine identified successfully. This is Paracetamol 500mg.')
              setTimeout(() => setVoiceState('listening'), 2500)
            }, 800)
            return 100
          }
          return p + 4
        })
      }, 80)
      return () => clearInterval(interval)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [screen])

  const handleCommand = (cmd: string, nextScreen: Screen, speech: string) => {
    simulateVoiceSequence(cmd, () => {
      setScreen(nextScreen)
      setAppSpeaking(speech)
    })
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#080D1A', fontFamily: 'Inter, sans-serif', maxWidth: 480, margin: '0 auto', position: 'relative' }}
    >
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-5 pt-4 pb-2"
        style={{ borderBottom: '1px solid #1E2A42' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
          <span className="text-xs font-semibold" style={{ color: '#22C55E', fontFamily: 'Nunito, sans-serif' }}>Voice Active</span>
        </div>
        <span style={{ color: '#F1F5F9', fontSize: 15, fontFamily: 'Nunito, sans-serif', fontWeight: 800 }}>MedVoice</span>
        <span className="text-xs" style={{ color: '#94A3B8' }}>🌐 {detectedLang}</span>
      </div>

      {/* App-speaking bar */}
      {appSpeaking && (
        <div
          className="mx-4 mt-3 px-4 py-3 rounded-2xl flex items-start gap-3 animate-float-up"
          style={{ background: '#0F1629', border: '1px solid #1E2A42' }}
        >
          <div className="mt-0.5 shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M11 5L6 9H2v6h4l5 4V5z" fill="#14B8A6" />
              <path d="M19.07 4.93a10 10 0 010 14.14" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
              <path d="M15.54 8.46a5 5 0 010 7.07" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-sm font-medium leading-relaxed" style={{ color: '#CBD5E1' }}>{appSpeaking}</p>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
        {screen === 'welcome' && <WelcomeScreen />}
        {screen === 'home' && (
          <HomeScreen
            onScan={() => handleCommand('Scan medicine', 'scan', 'Opening camera. Please hold the medicine strip in front of the camera.')}
            onHistory={() => handleCommand('Show my medicines', 'history', 'Here are your saved medicines.')}
            onSettings={() => handleCommand('Open settings', 'settings', 'Settings are open. You can change text size, voice speed, or language.')}
            onCaregiver={() => handleCommand('Open caregiver mode', 'caregiver', 'Opening caregiver mode. Authorization required.')}
          />
        )}
        {screen === 'scan' && (
          <ScanScreen
            onStartScan={() => {
              setTranscript('Scan')
              setVoiceState('processing')
              setAppSpeaking('Scanning medicine. Please hold steady.')
              setScreen('scanning')
            }}
            onBack={() => handleCommand('Cancel', 'home', 'Returning to home.')}
          />
        )}
        {screen === 'scanning' && <ScanningScreen progress={scanProgress} />}
        {screen === 'result' && selectedMedicine && (
          <ResultScreen
            medicine={selectedMedicine}
            onBack={() => handleCommand('Go back', 'home', 'Returning to home.')}
            onHistory={() => handleCommand('Show history', 'history', 'Here are your saved medicines.')}
          />
        )}
        {screen === 'history' && (
          <HistoryScreen
            medicines={history}
            onSelect={(m) => {
              simulateVoiceSequence(`Open ${m.name}`, () => {
                setSelectedMedicine(m)
                setScreen('result')
                setAppSpeaking(`Showing details for ${m.name}.`)
              })
            }}
            onBack={() => handleCommand('Go home', 'home', 'Returning to home.')}
          />
        )}
        {screen === 'settings' && (
          <SettingsScreen onBack={() => handleCommand('Go back', 'home', 'Returning to home.')} />
        )}
        {screen === 'caregiver' && (
          <CaregiverScreen onBack={() => handleCommand('Go back', 'home', 'Returning to home.')} />
        )}
      </div>

      {/* Voice control bar */}
      <div
        className="px-4 pt-4 pb-6"
        style={{ borderTop: '1px solid #1E2A42', background: '#080D1A' }}
      >
        {transcript && (
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs" style={{ color: '#94A3B8' }}>You said:</span>
            <span className="text-sm font-semibold" style={{ color: '#F1F5F9', fontFamily: 'Nunito, sans-serif' }}>"{transcript}"</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <VoiceStateLabel state={voiceState} />
          <VoiceIndicator state={voiceState} />
        </div>
        {voiceState === 'listening' && screen === 'home' && (
          <div className="mt-3 flex flex-wrap gap-2">
            <CommandChip label="Scan medicine" icon="📷" />
            <CommandChip label="My medicines" icon="💊" />
            <CommandChip label="Settings" icon="⚙️" />
            <CommandChip label="Help" icon="❓" />
          </div>
        )}
      </div>
    </div>
  )
}

function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6 animate-float-up">
      <div className="text-7xl">💊</div>
      <div className="text-center">
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 36, fontWeight: 900, color: '#F1F5F9', lineHeight: 1.1 }}>
          MedVoice
        </h1>
        <p style={{ color: '#14B8A6', fontSize: 16, fontWeight: 600, marginTop: 8, fontFamily: 'Nunito, sans-serif' }}>
          Voice Medicine Assistant
        </p>
      </div>
      <div className="text-center mt-4">
        <p style={{ color: '#F1F5F9', fontSize: 28, fontWeight: 800, fontFamily: 'Nunito, sans-serif', lineHeight: 1.3 }}>
          Hello.
        </p>
        <p style={{ color: '#CBD5E1', fontSize: 22, fontWeight: 600, fontFamily: 'Nunito, sans-serif', lineHeight: 1.3 }}>
          How can I help you?
        </p>
      </div>
      <p style={{ color: '#64748B', fontSize: 13, fontFamily: 'Inter, sans-serif', textAlign: 'center', maxWidth: 260 }}>
        No typing needed. Just speak naturally.
      </p>
    </div>
  )
}

function HomeScreen({ onScan, onHistory, onSettings, onCaregiver }: {
  onScan: () => void
  onHistory: () => void
  onSettings: () => void
  onCaregiver: () => void
}) {
  const actions = [
    { icon: '📷', label: 'Scan Medicine', sub: 'Say "Scan medicine"', color: '#14B8A6', bg: '#042F2E', border: '#0D9488', action: onScan },
    { icon: '💊', label: 'My Medicines', sub: 'Say "Show my medicines"', color: '#8B5CF6', bg: '#2E1065', border: '#6D28D9', action: onHistory },
    { icon: '👨‍👩‍👧', label: 'Caregiver Mode', sub: 'Say "Open caregiver"', color: '#F59E0B', bg: '#451A03', border: '#D97706', action: onCaregiver },
    { icon: '⚙️', label: 'Settings', sub: 'Say "Open settings"', color: '#94A3B8', bg: '#0F172A', border: '#334155', action: onSettings },
  ]

  return (
    <div className="flex flex-col gap-4 animate-float-up">
      <div className="mb-2">
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 26, fontWeight: 900, color: '#F1F5F9' }}>
          What would you like to do?
        </h2>
        <p style={{ color: '#64748B', fontSize: 13, marginTop: 4 }}>Speak any command below</p>
      </div>

      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.action}
          className="w-full text-left px-5 py-5 rounded-2xl flex items-center gap-4 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: a.bg, border: `1.5px solid ${a.border}` }}
        >
          <div
            className="flex items-center justify-center rounded-2xl shrink-0"
            style={{ width: 60, height: 60, background: a.color + '22', fontSize: 28 }}
          >
            {a.icon}
          </div>
          <div>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 20, fontWeight: 800, color: '#F1F5F9' }}>{a.label}</p>
            <p style={{ fontSize: 13, color: a.color, fontWeight: 600, marginTop: 3 }}>{a.sub}</p>
          </div>
        </button>
      ))}

      <div className="mt-2 p-4 rounded-2xl" style={{ background: '#0F1629', border: '1px solid #1E2A42' }}>
        <p style={{ color: '#64748B', fontSize: 12, fontFamily: 'Nunito, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Recent scan</p>
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 16, color: '#F1F5F9' }}>Paracetamol 500mg</p>
            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Today, 10:42 AM</p>
          </div>
          <ExpiryBadge status="valid" />
        </div>
      </div>
    </div>
  )
}

function ScanScreen({ onStartScan, onBack }: { onStartScan: () => void; onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)

  useEffect(() => {
    let active = true
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } } })
      .then((stream) => {
        if (!active) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
            setCameraReady(true)
          }
        }
      })
      .catch((err) => {
        if (active) setCameraError(err.name === 'NotAllowedError' ? 'Camera permission denied. Please allow camera access.' : 'Camera not available on this device.')
      })
    return () => {
      active = false
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  const handleScan = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    onStartScan()
  }

  const handleBack = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    onBack()
  }

  return (
    <div className="flex flex-col gap-4 animate-float-up">
      <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 24, fontWeight: 900, color: '#F1F5F9' }}>Scan Medicine</h2>

      {/* Live camera preview */}
      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{ height: 300, background: '#0A0F1E', border: '2px solid #14B8A6' }}
      >
        {!cameraError ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Corner guides */}
            <div className="absolute top-3 left-3 w-9 h-9" style={{ borderTop: '3px solid #14B8A6', borderLeft: '3px solid #14B8A6', borderRadius: '8px 0 0 0' }} />
            <div className="absolute top-3 right-3 w-9 h-9" style={{ borderTop: '3px solid #14B8A6', borderRight: '3px solid #14B8A6', borderRadius: '0 8px 0 0' }} />
            <div className="absolute bottom-3 left-3 w-9 h-9" style={{ borderBottom: '3px solid #14B8A6', borderLeft: '3px solid #14B8A6', borderRadius: '0 0 0 8px' }} />
            <div className="absolute bottom-3 right-3 w-9 h-9" style={{ borderBottom: '3px solid #14B8A6', borderRight: '3px solid #14B8A6', borderRadius: '0 0 8px 0' }} />
            {/* Scan line */}
            {cameraReady && (
              <div className="absolute left-6 right-6" style={{ top: '50%', height: 2, background: 'linear-gradient(90deg, transparent, #14B8A6, transparent)', animation: 'scanline 2s ease-in-out infinite' }} />
            )}
            {/* Guide label */}
            {cameraReady && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: '#080D1Aaa', color: '#14B8A6', fontFamily: 'Nunito, sans-serif', backdropFilter: 'blur(8px)' }}>
                  Point at medicine label
                </div>
              </div>
            )}
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: '#14B8A6', borderTopColor: 'transparent' }} />
                  <p style={{ color: '#14B8A6', fontSize: 14, fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>Starting camera...</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <span style={{ fontSize: 40 }}>📷</span>
            <p style={{ color: '#EF4444', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15, lineHeight: 1.4 }}>{cameraError}</p>
            <p style={{ color: '#475569', fontSize: 13 }}>You can still tap "Scan Now" to simulate a scan.</p>
          </div>
        )}
      </div>

      {/* Voice guidance */}
      <div className="rounded-2xl p-4" style={{ background: '#0F1629', border: '1px solid #1E2A42' }}>
        <p style={{ color: '#64748B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Voice Commands</p>
        <div className="flex flex-col gap-2">
          {[
            ['📸', '"Scan"', 'Capture the medicine'],
            ['↩️', '"Scan other side"', 'Flip for back label'],
            ['❌', '"Cancel"', 'Return to home'],
          ].map(([icon, cmd, desc]) => (
            <div key={cmd} className="flex items-center gap-3">
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ color: '#14B8A6', fontWeight: 600, fontSize: 13 }}>{cmd}</span>
              <span style={{ color: '#64748B', fontSize: 13 }}>— {desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleScan}
          className="flex-1 py-4 rounded-2xl font-extrabold text-lg transition-all active:scale-95"
          style={{ background: '#14B8A6', color: '#080D1A', fontFamily: 'Nunito, sans-serif' }}
        >
          📸 Scan Now
        </button>
        <button
          onClick={handleBack}
          className="px-5 py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
          style={{ background: '#172038', color: '#94A3B8', border: '1px solid #1E2A42', fontFamily: 'Nunito, sans-serif' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function ScanningScreen({ progress }: { progress: number }) {
  const steps = [
    { label: 'Reading medicine text', threshold: 25 },
    { label: 'Identifying medicine', threshold: 55 },
    { label: 'Checking expiry date', threshold: 75 },
    { label: 'Verifying information', threshold: 95 },
  ]

  return (
    <div className="flex flex-col items-center gap-8 py-8 animate-float-up">
      <div className="text-7xl animate-pulse">🔍</div>
      <div className="text-center">
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 26, fontWeight: 900, color: '#F1F5F9' }}>Scanning...</h2>
        <p style={{ color: '#64748B', fontSize: 14, marginTop: 6 }}>Hold medicine steady</p>
      </div>

      <div className="w-full rounded-full overflow-hidden" style={{ height: 8, background: '#172038' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #14B8A6, #8B5CF6)' }}
        />
      </div>

      <div className="w-full flex flex-col gap-3">
        {steps.map((s) => {
          const done = progress >= s.threshold
          const active = progress >= s.threshold - 25 && progress < s.threshold
          return (
            <div key={s.label} className="flex items-center gap-3">
              <div
                className="rounded-full shrink-0 flex items-center justify-center"
                style={{
                  width: 28,
                  height: 28,
                  background: done ? '#052E16' : active ? '#042F2E' : '#0F1629',
                  border: `2px solid ${done ? '#22C55E' : active ? '#14B8A6' : '#1E2A42'}`,
                }}
              >
                {done ? (
                  <span style={{ fontSize: 14 }}>✓</span>
                ) : active ? (
                  <div className="w-2 h-2 rounded-full animate-blink" style={{ background: '#14B8A6' }} />
                ) : null}
              </div>
              <span
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: 15,
                  fontWeight: 700,
                  color: done ? '#22C55E' : active ? '#14B8A6' : '#475569',
                }}
              >
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ResultScreen({ medicine, onBack, onHistory }: { medicine: Medicine; onBack: () => void; onHistory: () => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="flex flex-col gap-4 animate-float-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: '#22C55E', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>✓ Identified</span>
          </div>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 28, fontWeight: 900, color: '#F1F5F9', lineHeight: 1.1 }}>
            {medicine.name}
          </h2>
        </div>
        <ExpiryBadge status={medicine.expiryStatus} />
      </div>

      {/* Key info card */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: '#0F1629', border: '1px solid #1E2A42' }}>
        {[
          { label: 'Active Ingredient', value: medicine.ingredient },
          { label: 'Strength', value: medicine.strength },
          { label: 'Expiry Date', value: medicine.expiry },
        ].map(({ label, value }) => (
          <div key={label}>
            <p style={{ color: '#64748B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{label}</p>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Use */}
      <div className="rounded-2xl p-5" style={{ background: '#042F2E', border: '1px solid #0D9488' }}>
        <p style={{ color: '#14B8A6', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>General Use</p>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 17, fontWeight: 700, color: '#CCFBF1', lineHeight: 1.5 }}>{medicine.use}</p>
      </div>

      {/* Warnings */}
      <div className="rounded-2xl p-5" style={{ background: '#450A0A', border: '1px solid #7F1D1D' }}>
        <p style={{ color: '#EF4444', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>⚠️ Warnings</p>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 700, color: '#FEE2E2', lineHeight: 1.5 }}>{medicine.warnings}</p>
      </div>

      {/* Voice questions */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full py-4 rounded-2xl font-bold text-base"
          style={{ background: '#172038', color: '#94A3B8', border: '1px solid #1E2A42', fontFamily: 'Nunito, sans-serif' }}
        >
          Ask a question by voice →
        </button>
      )}

      {expanded && (
        <div className="rounded-2xl p-4" style={{ background: '#0F1629', border: '1px solid #1E2A42' }}>
          <p style={{ color: '#64748B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Say any question</p>
          {[
            '"What are the side effects?"',
            '"Can pregnant women use it?"',
            '"Tell me the warnings"',
            '"Generate report"',
          ].map((q) => (
            <p key={q} style={{ color: '#14B8A6', fontSize: 14, fontWeight: 600, marginBottom: 6, fontFamily: 'Nunito, sans-serif' }}>{q}</p>
          ))}
        </div>
      )}

      <div className="flex gap-3 pb-2">
        <button onClick={onBack} className="flex-1 py-4 rounded-2xl font-bold text-base transition-all active:scale-95" style={{ background: '#172038', color: '#94A3B8', border: '1px solid #1E2A42', fontFamily: 'Nunito, sans-serif' }}>
          Home
        </button>
        <button onClick={onHistory} className="flex-1 py-4 rounded-2xl font-bold text-base transition-all active:scale-95" style={{ background: '#172038', color: '#8B5CF6', border: '1px solid #4C1D95', fontFamily: 'Nunito, sans-serif' }}>
          History
        </button>
      </div>
    </div>
  )
}

function HistoryScreen({ medicines, onSelect, onBack }: {
  medicines: Medicine[]
  onSelect: (m: Medicine) => void
  onBack: () => void
}) {
  return (
    <div className="flex flex-col gap-4 animate-float-up">
      <div className="flex items-center justify-between mb-1">
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 24, fontWeight: 900, color: '#F1F5F9' }}>My Medicines</h2>
        <span style={{ color: '#64748B', fontSize: 13 }}>{medicines.length} saved</span>
      </div>

      <div className="rounded-2xl p-3 mb-1" style={{ background: '#0F1629', border: '1px solid #1E2A42' }}>
        <p style={{ color: '#64748B', fontSize: 12, fontFamily: 'Nunito, sans-serif' }}>
          Say <span style={{ color: '#14B8A6', fontWeight: 700 }}>"Show expired medicines"</span> or <span style={{ color: '#14B8A6', fontWeight: 700 }}>"What did I scan yesterday?"</span>
        </p>
      </div>

      {medicines.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m)}
          className="w-full text-left rounded-2xl p-5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: '#0F1629', border: '1px solid #1E2A42' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 18, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.2 }}>{m.name}</p>
              <p style={{ color: '#64748B', fontSize: 13, marginTop: 4 }}>{m.ingredient} · {m.strength}</p>
              <p style={{ color: '#475569', fontSize: 12, marginTop: 6 }}>Scanned: {m.scanDate}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <ExpiryBadge status={m.expiryStatus} />
              <span style={{ color: '#475569', fontSize: 12 }}>Exp: {m.expiry}</span>
            </div>
          </div>
        </button>
      ))}

      <button onClick={onBack} className="w-full py-4 rounded-2xl font-bold text-base mt-2 transition-all active:scale-95" style={{ background: '#172038', color: '#94A3B8', border: '1px solid #1E2A42', fontFamily: 'Nunito, sans-serif' }}>
        Back to Home
      </button>
    </div>
  )
}

function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [textSize, setTextSize] = useState(2)
  const [voiceSpeed, setVoiceSpeed] = useState(2)
  const [highContrast, setHighContrast] = useState(false)
  const [vibration, setVibration] = useState(true)

  return (
    <div className="flex flex-col gap-4 animate-float-up">
      <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 24, fontWeight: 900, color: '#F1F5F9' }}>Settings</h2>
      <p style={{ color: '#64748B', fontSize: 13, marginTop: -8 }}>Say a command to change any setting</p>

      {/* Text Size */}
      <div className="rounded-2xl p-5" style={{ background: '#0F1629', border: '1px solid #1E2A42' }}>
        <p style={{ color: '#64748B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Text Size</p>
        <div className="flex gap-2">
          {['Small', 'Medium', 'Large', 'X-Large'].map((s, i) => (
            <button
              key={s}
              onClick={() => setTextSize(i)}
              className="flex-1 py-2 rounded-xl font-bold transition-all"
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: 12,
                background: textSize === i ? '#14B8A6' : '#172038',
                color: textSize === i ? '#080D1A' : '#64748B',
                border: textSize === i ? 'none' : '1px solid #1E2A42',
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <p style={{ color: '#475569', fontSize: 11, marginTop: 8 }}>Say "Make text larger" or "Increase text size"</p>
      </div>

      {/* Voice Speed */}
      <div className="rounded-2xl p-5" style={{ background: '#0F1629', border: '1px solid #1E2A42' }}>
        <p style={{ color: '#64748B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Voice Speed</p>
        <div className="flex gap-2">
          {['Slow', 'Normal', 'Fast'].map((s, i) => (
            <button
              key={s}
              onClick={() => setVoiceSpeed(i)}
              className="flex-1 py-2 rounded-xl font-bold transition-all"
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: 13,
                background: voiceSpeed === i ? '#8B5CF6' : '#172038',
                color: voiceSpeed === i ? '#F1F5F9' : '#64748B',
                border: voiceSpeed === i ? 'none' : '1px solid #1E2A42',
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <p style={{ color: '#475569', fontSize: 11, marginTop: 8 }}>Say "Slow down voice" or "Speed up voice"</p>
      </div>

      {/* Toggles */}
      {[
        { label: 'High Contrast Mode', sub: 'Say "Turn on high contrast"', val: highContrast, set: setHighContrast },
        { label: 'Vibration Feedback', sub: 'Say "Turn on vibration"', val: vibration, set: setVibration },
      ].map(({ label, sub, val, set }) => (
        <div key={label} className="flex items-center justify-between rounded-2xl p-5" style={{ background: '#0F1629', border: '1px solid #1E2A42' }}>
          <div>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 800, color: '#F1F5F9' }}>{label}</p>
            <p style={{ color: '#475569', fontSize: 12, marginTop: 3 }}>{sub}</p>
          </div>
          <button
            onClick={() => set(!val)}
            className="rounded-full transition-all duration-300 relative"
            style={{ width: 52, height: 28, background: val ? '#14B8A6' : '#172038', border: val ? 'none' : '1px solid #334155' }}
          >
            <div
              className="absolute rounded-full transition-all duration-300"
              style={{ width: 22, height: 22, top: 3, left: val ? 27 : 3, background: '#F1F5F9' }}
            />
          </button>
        </div>
      ))}

      <button onClick={onBack} className="w-full py-4 rounded-2xl font-bold text-base mt-2 transition-all active:scale-95" style={{ background: '#172038', color: '#94A3B8', border: '1px solid #1E2A42', fontFamily: 'Nunito, sans-serif' }}>
        Back to Home
      </button>
    </div>
  )
}

function CaregiverScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col gap-5 animate-float-up">
      <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 24, fontWeight: 900, color: '#F1F5F9' }}>Caregiver Mode</h2>

      <div className="rounded-2xl p-5 text-center" style={{ background: '#451A03', border: '1px solid #D97706' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 18, fontWeight: 800, color: '#FED7AA', lineHeight: 1.4 }}>
          Authorization Required
        </p>
        <p style={{ color: '#92400E', fontSize: 14, marginTop: 8, fontFamily: 'Inter, sans-serif' }}>
          Say your caregiver PIN or ask the app to send an OTP to the registered caregiver number.
        </p>
      </div>

      <div className="rounded-2xl p-5" style={{ background: '#0F1629', border: '1px solid #1E2A42' }}>
        <p style={{ color: '#64748B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Voice Commands</p>
        {[
          ['"Send OTP to caregiver"', 'Sends an authorization code'],
          ['"Enter PIN"', 'Speak your 4-digit PIN'],
          ['"Cancel"', 'Return to home'],
        ].map(([cmd, desc]) => (
          <div key={cmd} className="flex items-start gap-3 mb-3">
            <span style={{ color: '#14B8A6', fontWeight: 700, fontSize: 14, minWidth: 160 }}>{cmd}</span>
            <span style={{ color: '#64748B', fontSize: 13 }}>{desc}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4" style={{ background: '#042F2E', border: '1px solid #0D9488' }}>
        <p style={{ color: '#14B8A6', fontSize: 13, fontWeight: 600, lineHeight: 1.5, fontFamily: 'Nunito, sans-serif' }}>
          🛡️ Caregiver access requires authorization to protect your privacy. Your complete medicine history is never automatically exposed.
        </p>
      </div>

      <button onClick={onBack} className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95" style={{ background: '#172038', color: '#94A3B8', border: '1px solid #1E2A42', fontFamily: 'Nunito, sans-serif' }}>
        Back to Home
      </button>
    </div>
  )
}
