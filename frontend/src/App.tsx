import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import UploadPage from '@/pages/UploadPage'
import ProcessingPage from '@/pages/ProcessingPage'
import ResultsPage from '@/pages/ResultsPage'
import DashboardPage from '@/pages/DashboardPage'
import DemoPage from '@/pages/DemoPage'
import SharePage from '@/pages/SharePage'
import EnvErrorPage from '@/pages/EnvErrorPage'
import ProtectedRoute from '@/components/ProtectedRoute'
import ScrollProgress from '@/components/ScrollProgress'

// ── Check required env at startup ─────────────────────────────────────────────
const REQUIRED_VITE_ENV = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const
const missingEnv = REQUIRED_VITE_ENV.filter((key) => !import.meta.env[key])

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()

  // Show setup error if env vars are missing
  if (missingEnv.length > 0) {
    return <EnvErrorPage missing={missingEnv as unknown as string[]} />
  }

  return (
    <>
      <ScrollProgress />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
          <Route path="/signup" element={<AnimatedPage><SignupPage /></AnimatedPage>} />
          <Route path="/upload" element={<ProtectedRoute><AnimatedPage><UploadPage /></AnimatedPage></ProtectedRoute>} />
          <Route path="/processing/:analysisId" element={<ProtectedRoute><AnimatedPage><ProcessingPage /></AnimatedPage></ProtectedRoute>} />
          <Route path="/results/:analysisId" element={<ProtectedRoute><AnimatedPage><ResultsPage /></AnimatedPage></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><AnimatedPage><DashboardPage /></AnimatedPage></ProtectedRoute>} />
          <Route path="/demo" element={<AnimatedPage><DemoPage /></AnimatedPage>} />
          <Route path="/share/:token" element={<AnimatedPage><SharePage /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App
