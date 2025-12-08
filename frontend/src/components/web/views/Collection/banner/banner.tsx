export default function CollectionBanner() {
    return (
        <section
            id="hero"
            className="relative h-[300px] w-full flex items-center justify-center overflow-hidden"
        >
            {/* Fundo com gradiente */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary dark:from-zinc-600 dark:to-zinc-700 to-primary" />
            
            {/* Forma de onda decorativa */}
            <div className="absolute inset-0 opacity-10">
                <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path 
                        fill="currentColor" 
                        fillOpacity="1" 
                        d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    />
                </svg>
            </div>

            {/* Texto centralizado */}
            <div className="relative z-10 text-center px-6 md:px-12 max-w-4xl">
                <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-4 text-primary-foreground">
                    Conheça o Futuro
                </h1>

                <p className="text-md md:text-xl max-w-2xl mx-auto leading-relaxed text-primary-foreground/90">
                    Experimente a essência do luxo com nossa coleção exclusiva de relógios, inspirados na sofisticação atemporal e nosso espírito ousado.
                </p>
            </div>
        </section>
    );
}