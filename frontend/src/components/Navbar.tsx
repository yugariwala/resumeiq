import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard, Upload, LogIn, LogOut, Zap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, signOut } = useAuth()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const userInitial = (user?.user_metadata?.full_name?.[0] ?? user?.email?.[0] ?? '?').toUpperCase()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close drawer on route change
    useEffect(() => { setDrawerOpen(false) }, [location.pathname])

    // Lock body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [drawerOpen])

    const navLinks = [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Demo', href: '/demo' },
    ]

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'glass-nav'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-1.5 select-none">
                            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
                            <span className="text-xl font-bold text-white">Resume</span>
                            <span className="text-xl font-bold text-[#3B82F6]">IQ</span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) =>
                                link.href.startsWith('/') ? (
                                    <Link key={link.label} to={link.href}
                                        className="text-[#8B949E] hover:text-white transition-colors text-sm font-medium">
                                        {link.label}
                                    </Link>
                                ) : (
                                    <a key={link.label} href={link.href}
                                        className="text-[#8B949E] hover:text-white transition-colors text-sm font-medium">
                                        {link.label}
                                    </a>
                                )
                            )}
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            {user ? (
                                <>
                                    <Link to="/dashboard"
                                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#C9D1D9] hover:text-white transition-colors rounded-lg hover:bg-white/5">
                                        <LayoutDashboard size={15} /> Dashboard
                                    </Link>
                                    <Link to="/upload"
                                        className="btn-shimmer px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                                        Analyse Free
                                    </Link>
                                    <div className="w-px h-6 bg-[#30363D] mx-1" />
                                    <div className="w-8 h-8 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center text-xs font-bold text-[#3B82F6]">
                                        {userInitial}
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#8B949E] hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                                    >
                                        <LogOut size={15} /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login"
                                        className="px-4 py-2 text-sm font-medium text-[#C9D1D9] hover:text-white transition-colors rounded-lg hover:bg-white/5">
                                        Login
                                    </Link>
                                    <Link to="/upload"
                                        className="btn-shimmer px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                                        Analyse Free
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="md:hidden p-2 text-[#8B949E] hover:text-white transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ════ MOBILE SLIDE-IN DRAWER ════ */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDrawerOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
                        />

                        {/* Drawer panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed top-0 right-0 z-[70] h-full w-72 max-w-[85vw] bg-[#161B22] border-l border-[#30363D] shadow-2xl md:hidden flex flex-col"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363D]">
                                <Link to="/" className="flex items-center gap-1.5 select-none">
                                    <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
                                    <span className="text-lg font-bold text-white">Resume</span>
                                    <span className="text-lg font-bold text-[#3B82F6]">IQ</span>
                                </Link>
                                <button
                                    onClick={() => setDrawerOpen(false)}
                                    className="p-2 text-[#8B949E] hover:text-white transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Drawer Links */}
                            <nav className="flex-1 px-5 py-6 space-y-1">
                                {navLinks.map((link) =>
                                    link.href.startsWith('/') ? (
                                        <Link key={link.label} to={link.href}
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#C9D1D9] hover:text-white hover:bg-[#1C2333] text-sm font-medium transition-colors">
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a key={link.label} href={link.href} onClick={() => setDrawerOpen(false)}
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#C9D1D9] hover:text-white hover:bg-[#1C2333] text-sm font-medium transition-colors">
                                            {link.label}
                                        </a>
                                    )
                                )}

                                <div className="border-t border-[#30363D] pt-4 mt-4 space-y-1">
                                    {user ? (
                                        <>
                                            <Link to="/dashboard"
                                                className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#C9D1D9] hover:text-white hover:bg-[#1C2333] text-sm font-medium transition-colors">
                                                <LayoutDashboard size={16} className="text-[#3B82F6]" /> Dashboard
                                            </Link>
                                            <button
                                                onClick={handleSignOut}
                                                className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#C9D1D9] hover:text-red-400 hover:bg-[#1C2333] text-sm font-medium transition-colors w-full text-left"
                                            >
                                                <LogOut size={16} className="text-[#8B949E]" /> Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/dashboard"
                                                className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#C9D1D9] hover:text-white hover:bg-[#1C2333] text-sm font-medium transition-colors">
                                                <LayoutDashboard size={16} className="text-[#3B82F6]" /> Dashboard
                                            </Link>
                                            <Link to="/login"
                                                className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#C9D1D9] hover:text-white hover:bg-[#1C2333] text-sm font-medium transition-colors">
                                                <LogIn size={16} className="text-[#8B949E]" /> Login
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </nav>

                            {/* Drawer CTA */}
                            <div className="px-5 py-5 border-t border-[#30363D]">
                                <Link to="/upload"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20">
                                    <Upload size={16} /> Analyse My Resume Free
                                </Link>
                                <Link to="/demo"
                                    className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 border border-[#30363D] text-[#C9D1D9] hover:text-white text-sm font-medium rounded-xl transition-all">
                                    <Zap size={14} className="text-[#F59E0B]" /> See Demo
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
