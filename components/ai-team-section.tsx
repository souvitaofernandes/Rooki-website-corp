"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle } from "lucide-react"

export function AITeamSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section id="ai-team" ref={sectionRef} className="relative z-10">
      <div className="bg-white rounded-b-[3rem] pt-16 sm:pt-24 pb-16 sm:pb-24 px-4 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div
              className={`inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-medium mb-6 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Demonstração da Rooki
            </div>

            <h2
              className={`text-4xl md:text-5xl font-bold text-slate-900 mb-4 transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Veja a Rooki{" "}
              <span className="bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text text-transparent">
                em ação
              </span>
            </h2>

            <p
              className={`text-xl text-slate-600 max-w-2xl mx-auto transition-all duration-1000 delay-400 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Veja como a Rooki analisa mensagens reais, identifica o golpe e orienta o cliente, tudo no WhatsApp.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-7xl mx-auto">
            {/* Left side - Text content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center lg:h-[600px] space-y-6 lg:space-y-8 order-2 lg:order-1">
              <div
                className={`transition-all duration-1000 delay-600 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
              >
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 lg:mb-6">
                  É isso que seu cliente vê
                </h3>

                <div className="space-y-3 lg:space-y-4 text-base lg:text-lg text-slate-700 leading-relaxed">
                  <p>
                    A qualquer hora, seu cliente manda a mensagem suspeita e a Rooki responde se é golpe, antes que ele
                    clique, pague ou passe a senha.
                  </p>

                  <p>
                    Cada conversa dessas pode estar acontecendo de madrugada, no fim de semana ou no minuto exato em que
                    o golpista cria a urgência.
                  </p>

                  <p className="text-lg lg:text-xl font-semibold text-slate-900">
                    Sem isso, quem paga a conta do golpe é o seu cliente, e a confiança na sua marca.
                  </p>
                </div>
              </div>

              <div
                className={`transition-all duration-1000 delay-800 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
              >
                <div className="p-4 lg:p-6 bg-slate-50 rounded-xl border-l-4 border-slate-900">
                  <p className="text-slate-800 font-medium text-sm lg:text-base">
                    "Antes a gente só descobria o golpe pelo chamado de estorno. Agora o cliente verifica antes e a perda
                    despencou."
                  </p>
                  <p className="text-xs lg:text-sm text-slate-600 mt-2">
                    — Head de Prevenção a Fraudes, fintech parceira
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Phone mockup */}
            <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
              <div className="max-w-md w-full">
                <div
                  className={`relative transition-all duration-1000 delay-600 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <div className="bg-[#0E0E33] rounded-[2.5rem] p-2 shadow-2xl">
                    <div className="bg-black rounded-[2rem] p-1">
                      {/* Phone screen — vídeo vertical com crop para ocultar chrome do YouTube */}
                      <div className="bg-black rounded-[1.5rem] overflow-hidden" style={{ height: '560px' }}>
                        <div
                          className="relative w-full h-full overflow-hidden"
                          style={{ borderRadius: '1.5rem' }}
                        >
                          <iframe
                            src="https://www.youtube.com/embed/0koqGoM3MW4?autoplay=1&mute=1&loop=1&playlist=0koqGoM3MW4&controls=0&modestbranding=1&playsinline=1&rel=0"
                            allow="autoplay; encrypted-media; fullscreen"
                            allowFullScreen
                            title="Rooki em ação"
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '120%',
                              height: '120%',
                              border: 'none',
                              borderRadius: '1.5rem',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
