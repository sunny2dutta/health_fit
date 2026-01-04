import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AssessmentProvider } from './context/AssessmentContext'

import './index.css'
import App from './App.tsx'
import { AuthCallback } from './components/AuthCallback.tsx'
import { Dashboard } from './components/Dashboard.tsx'
import { ChatWidget } from './components/ChatWidget.tsx'

import { ErrorBoundary } from './components/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AssessmentProvider>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/*" element={<App />} />
          </Routes>
          <ChatWidget />
        </AssessmentProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
