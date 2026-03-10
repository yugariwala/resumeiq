/**
 * Shown instead of the app when required Vite env vars are missing.
 */
export default function EnvErrorPage({ missing }: { missing: string[] }) {
    return (
        <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-[#161B22] border border-[#EF4444]/40 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">⚙️</div>
                <h1 className="text-2xl font-bold text-white mb-2">Setup Required</h1>
                <p className="text-[#8B949E] text-sm mb-6">
                    The following environment variables are required but missing.
                    Create a <code className="text-[#F59E0B] text-xs bg-[#0D1117] px-1.5 py-0.5 rounded">.env</code> file
                    in <code className="text-[#F59E0B] text-xs bg-[#0D1117] px-1.5 py-0.5 rounded">frontend/</code> to fix this:
                </p>
                <div className="space-y-2 mb-8 text-left">
                    {missing.map((key) => (
                        <div key={key} className="flex items-center gap-2 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg px-4 py-2.5">
                            <span className="text-[#EF4444] text-xs font-mono">❌ {key}</span>
                        </div>
                    ))}
                </div>
                <div className="bg-[#0D1117] rounded-xl p-4 text-left text-xs font-mono text-[#10B981] leading-relaxed">
                    <p className="text-[#8B949E] mb-2"># frontend/.env</p>
                    <p>VITE_SUPABASE_URL=https://xxxxx.supabase.co</p>
                    <p>VITE_SUPABASE_ANON_KEY=eyJ...</p>
                </div>
                <p className="text-xs text-[#8B949E] mt-4">
                    After adding the .env file, restart the dev server with{' '}
                    <code className="text-[#F59E0B]">npm run dev</code>.
                </p>
            </div>
        </div>
    )
}
