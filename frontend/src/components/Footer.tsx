import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="relative gradient-border-top bg-[#020408] overflow-hidden">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className="text-[20vw] font-black text-white/[0.02] leading-none tracking-tighter">
                    RESUMEIQ
                </span>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    {/* Left — Logo + Tagline */}
                    <div>
                        <Link to="/" className="flex items-center gap-1.5 select-none">
                            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
                            <span className="text-xl font-bold text-white">Resume</span>
                            <span className="text-xl font-bold text-[#3B82F6]">IQ</span>
                        </Link>
                        <p className="mt-2 text-[#8B949E] text-sm">
                            Beat the ATS. Land the job.
                        </p>
                    </div>

                    {/* Right — Links */}
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-[#8B949E] hover:text-white transition-colors text-sm">
                            Privacy
                        </a>
                        <a href="#" className="text-[#8B949E] hover:text-white transition-colors text-sm">
                            Terms
                        </a>
                        <a href="#" className="text-[#8B949E] hover:text-white transition-colors text-sm">
                            Contact
                        </a>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-[#8B949E] text-xs">
                        © 2026 ResumeIQ. Powered by Claude AI &amp; Gemini 3.
                    </p>
                </div>
            </div>
        </footer>
    )
}
