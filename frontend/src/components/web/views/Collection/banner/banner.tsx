export default function CollectionBanner() {
    return (
        <section
            id="hero"
            className="relative h-[600px] w-full flex items-center overflow-hidden"
        >
            {/* Imagem de fundo */}
            <div
                className="
                    absolute inset-0
                    bg-[url('/img/web/collection/CollectionBanner.jpg')]
                    bg-cover 
                    bg-bottom
                    bg-no-repeat
                "
            />

            {/* Overlay opcional */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Texto à esquerda */}
            <div className="relative z-10 text-white px-6 md:px-12 max-w-4xl">
                <h1 className="font-playfair text-primary text-5xl md:text-6xl font-bold mb-4 text-left">
                    Coleção de relógios de luxo
                </h1>

                <p className="text-md md:text-xl max-w-2xl leading-relaxed text-gray-200 text-left">
                    Experimente a essência do luxo com nossa coleção exclusiva de relógios, inspirados na sofisticação atemporal e nosso espírito ousado.
                </p>
            </div>
        </section>
    );
}
