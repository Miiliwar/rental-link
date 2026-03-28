import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/config'
import './index.css'
import App from './App.tsx'
import { AuthProfileProvider } from './context/AuthProfileContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProfileProvider>
      <App />
    </AuthProfileProvider>
  </StrictMode>,
)
