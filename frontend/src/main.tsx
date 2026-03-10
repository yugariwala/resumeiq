import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#161B22',
              border: '1px solid #30363D',
              color: '#C9D1D9',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
          theme="dark"
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
