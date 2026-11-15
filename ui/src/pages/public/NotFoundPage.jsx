import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="page" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#0f766e' }}>404</h1>
      <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn">
        Return to Home
      </Link>
    </div>
  )
}

export default NotFoundPage
