"use client"

import { useEffect, useRef } from "react"
import { TestimonialsColumn } from "@/components/ui/testimonials-column"

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-element")
            elements.forEach((element, index) => {
              setTimeout(() => {
                element.classList.add("animate-fade-in-up")
              }, index * 300)
            })
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const testimonials = [
    {
      text: "Ia pagar um boleto de 'regularização' que parecia do governo. Mandei pra Rooki e ela mostrou que o órgão não cobra assim.",
      name: "Usuária, 54 anos",
      role: "Golpe de falso boleto",
    },
    {
      text: "Recebi ligação do 'banco' pedindo o código do SMS. A Rooki já tinha me avisado que banco nunca pede isso. Não passei nada.",
      name: "Usuário, 31 anos",
      role: "Golpe do falso atendente",
    },
    {
      text: "Quase caí num link de 'prêmio' no fim de semana. Verifiquei e era página clonada. Bloqueei na hora.",
      name: "Usuária, 27 anos",
      role: "Golpe de phishing",
    },
    {
      text: "Como parceiros, a queda nos chamados de estorno foi o que mais nos chamou atenção. O cliente resolve a dúvida antes de errar.",
      name: "Head de Cyber",
      role: "Fintech parceira",
    },
    {
      text: "Meu pai ia transferir pra 'conta segura' que o golpista mandou. Verificou comigo na Rooki e parou a tempo.",
      name: "Familiar de usuário",
      role: "Golpe da conta segura",
    },
    {
      text: "Encaminhei um áudio de WhatsApp pedindo dinheiro como se fosse minha filha. A Rooki sinalizou clonagem de conta.",
      name: "Usuária, 60 anos",
      role: "Golpe do familiar",
    },
    {
      text: "Recebi cobrança de uma compra que não fiz. Verifiquei antes de clicar em 'contestar' e era o golpe que tava no link.",
      name: "Usuário, 43 anos",
      role: "Golpe da falsa compra",
    },
    {
      text: "O bom é não precisar entender de tecnologia. Mando o que recebo e a Rooki me diz na hora se é golpe.",
      name: "Usuário, 68 anos",
      role: "Golpe verificado a tempo",
    },
  ]

  return (
    <section id="testimonials" ref={sectionRef} className="relative pt-16 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section - Keep as user loves it */}
        <div className="text-center mb-16 md:mb-32">
          <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out inline-flex items-center gap-2 text-white/60 text-sm font-medium tracking-wider uppercase mb-6">
            <div className="w-8 h-px bg-white/30"></div>
            Casos reais
            <div className="w-8 h-px bg-white/30"></div>
          </div>
          <h2 className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 tracking-tight text-balance">
            Golpes que não <span className="font-medium italic">aconteceram</span>
          </h2>
          <p className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Casos reais de pessoas que checaram a tempo. Identidades preservadas.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out relative flex justify-center items-center min-h-[600px] md:min-h-[800px] overflow-hidden">
          <div
            className="flex gap-8 max-w-6xl"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            <TestimonialsColumn testimonials={testimonials.slice(0, 3)} duration={15} className="flex-1" />
            <TestimonialsColumn
              testimonials={testimonials.slice(2, 5)}
              duration={12}
              className="flex-1 hidden md:block"
            />
            <TestimonialsColumn
              testimonials={testimonials.slice(1, 4)}
              duration={18}
              className="flex-1 hidden lg:block"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
