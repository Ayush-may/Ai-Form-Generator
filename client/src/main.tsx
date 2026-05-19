import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './Router.tsx'
import AiChatProvider from './providers/AiChatProvider.tsx'
import AuthProvider from './providers/AuthProvider.tsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <>
    <Router />
    <Toaster
      position="top-right"
      expand={false}
      richColors={true}
    />
  </>
)
