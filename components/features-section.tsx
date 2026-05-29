"use client"

import { useEffect, useRef, useState } from "react"

const AnimatedChatDemo = ({ isActive }: { isActive: boolean }) => {
  const [messages, setMessages] = useState([
    { text: "Recebi essa cobrança por PIX. É golpe?", isBot: true, visible: false },
    { text: "Manda o print ou o link que eu verifico", isBot: false, visible: false },
    { text: "Esse link imita o banco, mas o domínio é falso. Não clique.", isBot: true, visible: false },
  ])
  const [typingDots, setTypingDots] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [cycleCount, setCycleCount] = useState(0)

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timeInterval)
  }, [])

  useEffect(() => {
    if (!isActive) return

    const scenarios = [
      [
        { text: "Recebi essa cobrança por PIX. É golpe?", isBot: true },
        { text: "Manda o print ou o link que eu verifico", isBot: false },
        { text: "Esse link imita o banco, mas o domínio é falso. Não clique.", isBot: true },
      ],
      [
        { text: "Estou aqui 24h pra verificar o que você receber.", isBot: true },
        { text: "Recebi um link de sorteio, posso confiar?", isBot: false },
        { text: "Vou checar o link agora pra você.", isBot: true },
      ],
      [
        { text: "Boa noite! O que você quer verificar?", isBot: true },
        { text: "Me ligaram dizendo que são do banco", isBot: false },
        {
          text: "Banco não pede senha por ligação. Desligue e ligue você mesmo no número do cartão.",
          isBot: true,
        },
      ],
    ]

    const currentScenario = scenarios[cycleCount % scenarios.length]
    setMessages(currentScenario.map((msg) => ({ ...msg, visible: false })))

    const timer = setTimeout(() => {
      setMessages((prev) => prev.map((msg, i) => ({ ...msg, visible: i === 0 })))

      setTimeout(() => {
        setMessages((prev) => prev.map((msg, i) => ({ ...msg, visible: i <= 1 })))

        setTimeout(() => {
          const typingInterval = setInterval(() => {
            setTypingDots((prev) => (prev + 1) % 4)
          }, 500)

          setTimeout(() => {
            clearInterval(typingInterval)
            setMessages((prev) => prev.map((msg) => ({ ...msg, visible: true })))

            setTimeout(() => {
              setCycleCount((prev) => prev + 1)
            }, 3000)
          }, 2000)
        }, 1000)
      }, 1500)
    }, 500)

    return () => clearTimeout(timer)
  }, [isActive, cycleCount])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32 overflow-hidden relative">
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-slate-500 font-medium">24/7</span>
      </div>
      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.isBot ? "justify-start" : "justify-end"} transition-all duration-500 ${
              msg.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <div
              className={`max-w-[80%] px-3 py-1.5 rounded-full text-xs ${
                msg.isBot ? "bg-slate-200 text-slate-700" : "bg-blue-500 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {typingDots > 0 && (
          <div className="flex justify-start">
            <div className="bg-slate-200 px-3 py-1.5 rounded-full">
              <div className="flex space-x-1">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className={`w-1 h-1 bg-slate-500 rounded-full transition-opacity duration-300 ${
                      typingDots >= dot ? "opacity-100" : "opacity-30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const AnimatedLinkScanDemo = ({ isActive }: { isActive: boolean }) => {
  const [stage, setStage] = useState<"idle" | "scanning" | "blocked">("idle")

  useEffect(() => {
    if (!isActive) return

    let timeouts: ReturnType<typeof setTimeout>[] = []
    const cycle = () => {
      setStage("scanning")
      timeouts.push(
        setTimeout(() => {
          setStage("blocked")
          timeouts.push(
            setTimeout(() => {
              setStage("idle")
              timeouts.push(setTimeout(cycle, 1200))
            }, 2400),
          )
        }, 1800),
      )
    }

    timeouts.push(setTimeout(cycle, 500))
    return () => timeouts.forEach(clearTimeout)
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32 flex flex-col justify-center relative">
      <div className="flex items-center gap-2 mb-2">
        <svg
          className={`w-3.5 h-3.5 shrink-0 transition-colors ${stage === "blocked" ? "text-red-500" : "text-slate-400"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
            clipRule="evenodd"
          />
        </svg>
        <div
          className={`flex-1 bg-white rounded px-2 py-1 text-[10px] font-mono truncate border transition-all ${
            stage === "blocked"
              ? "border-red-300 text-red-600 line-through"
              : "border-slate-200 text-slate-600"
          }`}
        >
          banc0-seguro-pix.xyz/login
        </div>
      </div>

      <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            stage === "scanning"
              ? "bg-blue-500 w-full transition-[width] duration-[1700ms] ease-linear"
              : stage === "blocked"
                ? "bg-red-500 w-full"
                : "bg-blue-500 w-0"
          }`}
        />
      </div>

      <div className="mt-2 flex items-center gap-1.5 h-4">
        {stage === "blocked" ? (
          <>
            <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[11px] font-semibold text-red-600">Link suspeito · bloqueado</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] text-slate-500">
              {stage === "scanning" ? "Analisando link…" : "Aguardando link"}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

const AnimatedTimerDemo = ({ isActive }: { isActive: boolean }) => {
  const [seconds, setSeconds] = useState(0)
  const [done, setDone] = useState(false)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (!isActive) return

    setSeconds(0)
    setDone(false)

    const target = 8
    let current = 0
    const interval = setInterval(() => {
      current += 1
      setSeconds(current)
      if (current >= target) {
        clearInterval(interval)
        setTimeout(() => setDone(true), 150)
      }
    }, 220)

    const resetTimer = setTimeout(() => setCycle((c) => c + 1), 4800)

    return () => {
      clearInterval(interval)
      clearTimeout(resetTimer)
    }
  }, [isActive, cycle])

  const radius = 34
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(seconds / 8, 1)

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32 flex items-center justify-center gap-4 relative">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} stroke="#e2e8f0" strokeWidth="6" fill="none" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#3b82f6"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-200 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-slate-900 tabular-nums leading-none">
            {seconds}s
          </span>
          <span className="text-[8px] text-slate-500 uppercase tracking-wider mt-0.5">
            análise
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${seconds >= 1 ? "bg-blue-500" : "bg-slate-300"}`} />
          <span className="text-[10px] text-slate-600">Recebido</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${seconds >= 4 ? "bg-blue-500" : "bg-slate-300"}`} />
          <span className="text-[10px] text-slate-600">Analisando</span>
        </div>
        <div className="flex items-center gap-1.5">
          {done ? (
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="#00FC6E" strokeWidth="4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          )}
          <span className={`text-[10px] ${done ? "text-slate-700 font-medium" : "text-slate-600"}`}>
            Concluído
          </span>
        </div>
      </div>
    </div>
  )
}

const AnimatedEmailDemo = ({ isActive }: { isActive: boolean }) => {
  const [emails, setEmails] = useState([
    { subject: "Cobrança suspeita", status: "unread" },
    { subject: "Boleto recebido", status: "unread" },
    { subject: "Link de banco", status: "unread" },
  ])

  useEffect(() => {
    if (!isActive) return

    emails.forEach((_, index) => {
      setTimeout(
        () => {
          setEmails((prev) => prev.map((email, i) => (i === index ? { ...email, status: "replied" } : email)))
        },
        1000 + index * 800,
      )
    })
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32 overflow-hidden">
      <div className="space-y-2">
        {emails.map((email, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 p-2 rounded transition-all duration-500 ${
              email.status === "replied" ? "bg-green-100" : "bg-white"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${email.status === "replied" ? "bg-green-500" : "bg-blue-500"}`} />
            <span className="text-xs text-slate-700 flex-1">{email.subject}</span>
            {email.status === "replied" && (
              <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const AnimatedScamClassifyDemo = ({ isActive }: { isActive: boolean }) => {
  const scams = [
    { name: "Golpe de PIX", risk: "Alto", tone: "red" as const },
    { name: "Phishing", risk: "Alto", tone: "red" as const },
    { name: "Falso atendente", risk: "Médio", tone: "orange" as const },
  ]
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (!isActive) return

    setVisibleCount(0)
    const timeouts = scams.map((_, index) =>
      setTimeout(() => setVisibleCount(index + 1), 500 + index * 600),
    )

    return () => timeouts.forEach(clearTimeout)
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32 overflow-hidden">
      <div className="space-y-1.5">
        {scams.map((scam, i) => {
          const visible = i < visibleCount
          const isRed = scam.tone === "red"
          return (
            <div
              key={i}
              className={`flex items-center gap-2 px-1.5 py-1 rounded transition-all duration-500 ${
                visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              }`}
            >
              <svg
                className={`w-3.5 h-3.5 shrink-0 ${isRed ? "text-red-500" : "text-orange-500"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs text-slate-700 flex-1 truncate">{scam.name}</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isRed ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                }`}
              >
                {scam.risk}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const AnimatedIntegrationsDemo = ({ isActive }: { isActive: boolean }) => {
  const [connections, setConnections] = useState([
    { name: "CRM", connected: false },
    { name: "WhatsApp", connected: false },
    { name: "SMS", connected: false },
    { name: "E-mail", connected: false },
  ])

  useEffect(() => {
    if (!isActive) return

    connections.forEach((_, index) => {
      setTimeout(
        () => {
          setConnections((prev) => prev.map((conn, i) => (i === index ? { ...conn, connected: true } : conn)))
        },
        500 + index * 400,
      )
    })
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32">
      <div className="grid grid-cols-2 gap-2">
        {connections.map((conn, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 p-2 rounded transition-all duration-500 ${
              conn.connected ? "bg-green-100" : "bg-white"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                conn.connected ? "bg-green-500" : "bg-slate-300"
              }`}
            />
            <span className="text-xs text-slate-700">{conn.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-center">
        <div className="text-xs text-slate-500">{connections.filter((c) => c.connected).length}/4 conectados</div>
      </div>
    </div>
  )
}

const features = [
  {
    title: "Verificação no WhatsApp 24/7",
    description:
      "O cliente encaminha a mensagem, o link ou o áudio. A Rooki analisa e diz se parece golpe, a qualquer hora, sem fila e sem espera.",
    demo: AnimatedChatDemo,
    size: "large",
  },
  {
    title: "Detecção de link falso",
    description:
      "Analisa o link antes do clique e identifica páginas que se passam por banco, loja ou órgão público.",
    demo: AnimatedLinkScanDemo,
    size: "medium",
  },
  {
    title: "Resposta em segundos",
    description:
      "O veredito chega em menos de 10 segundos, no mesmo canal onde o cliente recebeu a mensagem. Sem app novo, sem cadastro.",
    demo: AnimatedTimerDemo,
    size: "medium",
  },
  {
    title: "Verificação de cobranças",
    description:
      "Confere boletos, faturas e cobranças por e-mail e SMS, e alerta quando o beneficiário foi trocado.",
    demo: AnimatedEmailDemo,
    size: "large",
  },
  {
    title: "Classificação do golpe",
    description:
      "Identifica o tipo de golpe, de PIX a phishing e falso atendente, e orienta o passo seguro na hora.",
    demo: AnimatedScamClassifyDemo,
    size: "medium",
  },
  {
    title: "Integração com sua operação",
    description:
      "Conecta a verificação aos canais que o cliente já usa: WhatsApp, SMS, e-mail, app e redes, sem trocar a infraestrutura.",
    demo: AnimatedIntegrationsDemo,
    size: "medium",
  },
]

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeDemo, setActiveDemo] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log("[v0] Features Section is now visible") // Added debug log
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
    <section id="features" ref={sectionRef} className="relative z-10">
      <div className="bg-white rounded-t-[3rem] pt-16 sm:pt-24 pb-16 sm:pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-slate-200 rounded-full animate-float"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i * 0.5}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div
            className={`text-center mb-12 sm:mb-20 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H1V9H3V15H1V17H3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V17H23V15H21V9H23ZM19 9V15H5V9H19ZM7.5 11.5C7.5 10.67 8.17 10 9 10S10.5 10.67 10.5 11.5 9.83 13 9 13 7.5 12.33 7.5 11.5ZM13.5 11.5C13.5 10.67 14.17 10 15 10S16.5 10.67 16.5 11.5 15.83 13 15 13 13.5 12.33 13.5 11.5ZM12 16C13.11 16 14.08 16.59 14.71 17.5H9.29C9.92 16.59 10.89 16 12 16Z" />
              </svg>
              Verificação 24/7, em todo canal
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 text-balance mb-4 sm:mb-6">
              A Rooki{" "}
              <span className="bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text text-transparent">
                nunca dorme
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
              Enquanto seu cliente recebe a mensagem suspeita, a Rooki analisa e responde se é golpe, em segundos, sem
              que ele precise sair do WhatsApp.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group transition-all duration-1000 ${feature.size === "large" ? "md:col-span-2" : ""}`}
                style={{
                  transitionDelay: isVisible ? `${300 + index * 100}ms` : "0ms",
                }}
                onMouseEnter={() => setActiveDemo(index)}
                onMouseLeave={() => setActiveDemo(null)}
              >
                <div className="bg-white rounded-2xl p-6 sm:p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 hover:border-slate-300">
                  <div className="mb-6">
                    <feature.demo isActive={activeDemo === index || isVisible} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
