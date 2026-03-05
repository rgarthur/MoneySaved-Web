export default function header(){
    return (
        <header className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-4
        bg-white/5 backdrop-blur-lg border-b border-white/10 text-white transition-all duration-300 hover:bg-white/10">

            <a href="#home">
                <h2 className="text-2xl font-bold tracking-tighter hover:text-blue-400 transition-colors cursor-pointer"
                style={{ textShadow: '0 0 8px rgba(255,255,255,0.3)' }}>
                    Money Saved
                </h2>
            </a>

        <nav className="flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
            <a href="https://github.com/rgarthur" className="hover:text-blue-400 hover:drop-shadow-[0_0_5px_rgba(96,165,250,0.8)] transition-all">
                Opa
            </a>
            <a href="#presentationCard" className="hover:text-blue-400 hover:drop-shadow-[0_0_5px_rgba(96,165,250,0.8)] transition-all">
                Sobre Mim
            </a>
            <a href="#journey" className="hover:text-blue-400 hover:drop-shadow-[0_0_5px_rgba(96,165,250,0.8)] transition-all">
                Jornada
            </a>
             <a href="#skills" className="hover:text-blue-400 hover:drop-shadow-[0_0_5px_rgba(96,165,250,0.8)] transition-all">
                Linguagens e Frameworks
            </a>
        </nav>
        
        </header>
    );
}