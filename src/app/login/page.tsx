import Link from 'next/link'

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams
  
  const getErrorMessage = () => {
    switch (error) {
      case 'invalid':
        return 'Invalid password. Please try again.'
      case 'rate_limited':
        return 'Too many login attempts. Please wait before trying again.'
      default:
        return null
    }
  }

  const errorMessage = getErrorMessage()

  return (
    <div style={{
      position: 'relative',
      zIndex: 10,
      padding: '20px',
      backgroundColor: 'white',
      color: 'black',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px', color: 'black' }}>Admin Login</h1>
      
      {errorMessage && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb',
          maxWidth: '300px',
          textAlign: 'center'
        }}>
          {errorMessage}
        </div>
      )}
      
      <form action="/api/auth/login" method="POST" style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color: 'black' }}>Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              width: '200px'
            }}
          />
        </div>
        <button 
          type="submit" 
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>
      <p><Link href="/" style={{ color: 'blue' }}>Back to Survey</Link></p>
    </div>
  )
}
