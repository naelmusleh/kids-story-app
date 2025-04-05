import Link from 'next/link'

export default function Nav() {
  return (
    <nav style={{ padding: 20, background: '#f0f0f0' }}>
      <Link href="/dashboard" style={{ marginRight: 20 }}>Dashboard</Link>
      <Link href="/create" style={{ marginRight: 20 }}>Create Story</Link>
      <Link href="/auth">Login</Link>
    </nav>
  )
}