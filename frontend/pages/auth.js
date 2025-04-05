import { useState } from 'react'
import { signUpWithEmail, signInWithEmail } from '../utils/auth'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    let result
    if (mode === 'signin') {
      result = await signInWithEmail(email, password)
    } else {
      result = await signUpWithEmail(email, password)
    }
    setMessage(result.error ? result.error.message : 'Success!')
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={handleSubmit}>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</button>
      <p>{message}</p>
      <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
        Switch to {mode === 'signin' ? 'Sign Up' : 'Sign In'}
      </button>
    </div>
  )
}