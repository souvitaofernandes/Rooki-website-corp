"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, Clock, Zap } from "lucide-react"

const conversations = [
  {
    title: "Cobrança por PIX falsa",
    messages: [
      {
        text: "Oi! Recebi um PIX de cobrança que diz ser da Enel. É golpe?",
        sender: "customer",
        delay: 0,
      },
      {
        text: "Vou verificar. Me encaminha o print da cobrança e a chave PIX que apareceu.",
        sender: "ai",
        delay: 1000,
      },
      {
        text: "Pronto, mandei. A chave é um CPF aleatório.",
        sender: "customer",
        delay: 2500,
      },
      {
        text: "É golpe. A Enel não cobra por PIX com chave de CPF de terceiros. O boleto real vem no seu nome e com código de barras. Não pague.",
        sender: "ai",
        delay: 3500,
      },
      { text: "Ainda bem que verifiquei! E se já tivessem me ligado também?", sender: "customer", delay: 5000 },
      {
        text: "Se ligarem se passando pela empresa, desligue e ligue você no número oficial da conta. Golpista cria urgência pra você não checar.",
        sender: "ai",
        delay: 6000,
      },
      { text: "Faz sentido. Vou bloquear o contato.", sender: "customer", delay: 7500 },
      {
        text: "Boa decisão. Qualquer outra mensagem suspeita, é só me encaminhar. Estou aqui 24h.",
        sender: "ai",
        delay: 8500,
      },
    ],
  },
  {
    title: "Link falso por SMS",
    messages: [
      {
        text: "Recebi um SMS dizendo que minha conta será bloqueada. Tem um link.",
        sender: "customer",
        delay: 0,
      },
      {
        text: "Não clique. Me manda o link inteiro que eu analiso o destino antes de você abrir.",
        sender: "ai",
        delay: 1000,
      },
      {
        text: "Mandei. Parece o site do banco.",
        sender: "customer",
        delay: 2500,
      },
      {
        text: "O visual é cópia, mas o domínio não é o oficial do banco. É uma página falsa pra capturar sua senha.",
        sender: "ai",
        delay: 4000,
      },
      { text: "Como confirmo o site certo então?", sender: "customer", delay: 5500 },
      {
        text: "Abra o app oficial do banco direto, nunca por link recebido. Te mando o domínio verdadeiro pra comparar.",
        sender: "ai",
        delay: 6500,
      },
    ],
  },
  {
    title: "Golpe da falsa entrega",
    messages: [
      {
        text: 'São 23h e recebi "sua entrega está retida, pague a taxa". É verdade?',
        sender: "customer",
        delay: 0,
      },
      {
        text: "Vou checar. Você está esperando alguma encomenda com taxa pendente de verdade?",
        sender: "ai",
        delay: 1000,
      },
      { text: "Não, não comprei nada que tenha taxa.", sender: "customer", delay: 2500 },
      {
        text: "Então é golpe de falsa entrega. Os Correios e transportadoras não cobram taxa por link de SMS. Apague a mensagem e não clique.",
        sender: "ai",
        delay: 3500,
      },
      {
        text: "E se eu já tiver clicado antes de te perguntar?",
        sender: "customer",
        delay: 5000,
      },
      {
        text: "Se só abriu, troque a senha por garantia. Se digitou algum dado, avise seu banco agora. Posso te orientar no passo a passo.",
        sender: "ai",
        delay: 6000,
      },
    ],
  },
]

export function AITeamSection() {
  const sectionRef = useRef<HTMLElement>(null) // Added section ref for intersection observer
  const [isVisible, setIsVisible] = useState(false)
  const [currentConversation, setCurrentConversation] = useState(0)
  const [displayedMessages, setDisplayedMessages] = useState<any[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log("[v0] AI Team Section is now visible")
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [displayedMessages, isTyping])

  useEffect(() => {
    const conversation = conversations[currentConversation]
    setDisplayedMessages([])
    setIsTyping(false)

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    let messageIndex = 0

    const showNextMessage = () => {
      if (messageIndex >= conversation.messages.length) {
        // Wait 3 seconds then move to next conversation
        timeoutRef.current = setTimeout(() => {
          setCurrentConversation((prev) => (prev + 1) % conversations.length)
        }, 3000)
        return
      }

      const message = conversation.messages[messageIndex]

      timeoutRef.current = setTimeout(() => {
        if (message.sender === "ai") {
          setIsTyping(true)
          timeoutRef.current = setTimeout(() => {
            setDisplayedMessages((prev) => [...prev, message])
            setIsTyping(false)
            messageIndex++
            showNextMessage()
          }, 800) // Reduced typing delay from 1500ms to 800ms for faster replies
        } else {
          setDisplayedMessages((prev) => [...prev, message])
          messageIndex++
          showNextMessage()
        }
      }, message.delay)
    }

    showNextMessage()

    // Cleanup timeout on unmount or conversation change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentConversation])

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
                  <div className="bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl">
                    <div className="bg-black rounded-[2rem] p-1">
                      <div className="bg-white rounded-[1.5rem] overflow-hidden">
                        {/* Status bar */}
                        <div className="bg-slate-50 px-6 py-3 flex justify-between items-center text-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                            <span className="font-medium text-slate-700">Rooki</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">24/7</span>
                          </div>
                        </div>

                        <div className="bg-slate-900 px-6 py-4 text-white">
                          <div className="flex items-center gap-3">
                            <img
                              src="/images/michael-ai-agent.jpg"
                              alt="Michael - AI Agent"
                              className="w-8 h-8 rounded-full object-cover mr-2 mt-1 flex-shrink-0"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">Rooki — Verificação</h3>
                              <p className="text-xs text-slate-300">Online no WhatsApp</p>
                            </div>
                            <div className="text-xs text-green-400 flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              Online
                            </div>
                          </div>
                        </div>

                        {/* Chat messages */}
                        <div
                          ref={chatContainerRef}
                          className="h-96 overflow-y-scroll scrollbar-hide p-4 space-y-3 bg-slate-50"
                          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                          {displayedMessages.map((message, index) => (
                            <div
                              key={index}
                              className={`flex ${message.sender === "customer" ? "justify-end" : "justify-start"}`}
                            >
                              {message.sender === "ai" && (
                                <img
                                  src="/images/michael-ai-agent.jpg"
                                  alt="Michael"
                                  className="w-6 h-6 rounded-full object-cover mr-2 mt-1 flex-shrink-0"
                                />
                              )}
                              <div
                                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                                  message.sender === "customer"
                                    ? "bg-slate-900 text-white rounded-br-md"
                                    : "bg-white text-slate-800 shadow-sm border border-slate-200 rounded-bl-md"
                                }`}
                              >
                                {message.text.split("\n").map((line, i) => (
                                  <div key={i}>{line}</div>
                                ))}
                              </div>
                              {message.sender === "customer" && (
                                <div className="w-6 h-6 rounded-full bg-slate-400 ml-2 mt-1 flex-shrink-0 flex items-center justify-center text-xs text-white font-medium">
                                  C
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Typing indicator */}
                          {isTyping && (
                            <div className="flex justify-start items-start">
                              <img
                                src="/images/michael-ai-agent.jpg"
                                alt="Michael"
                                className="w-6 h-6 rounded-full object-cover mr-2 mt-1 flex-shrink-0"
                              />
                              <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-slate-200">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                  <div
                                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-4 bg-white border-t border-slate-200">
                          <div className="flex items-center gap-3 bg-slate-100 rounded-full px-4 py-2">
                            <span className="text-slate-500 text-sm lg:text-base flex-1">Rooki está verificando...</span>
                            <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                              <Zap className="w-3 h-3 text-white" />
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
        </div>
      </div>
    </section>
  )
}
