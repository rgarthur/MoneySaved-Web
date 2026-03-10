export default function header(){
    return (
        <header className="top-0 w-full z-50 flex items-center justify-between px-8 py-4
        bg-white/5 backdrop-blur-lg border-b border-white/10 text-white transition-all duration-300 hover:bg-white/10">

            <a href="/extrato">
                <h2 className="text-2xl font-bold tracking-tighter hover:text-blue-400 transition-colors cursor-pointer"
                style={{ textShadow: '0 0 8px rgba(255,255,255,0.3)' }}>
                    Money Saved
                </h2>
            </a>

        <nav className="flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
            <a href="/extratos" className="hover:text-blue-400 hover:drop-shadow-[0_0_5px_rgba(96,165,250,0.8)] transition-all">
                Meus Extratos
            </a>
            <a href="/extratoMes" className="hover:text-blue-400 hover:drop-shadow-[0_0_5px_rgba(96,165,250,0.8)] transition-all">
                Extrato Atual
            </a>
        </nav>
        
        </header>
    );
}