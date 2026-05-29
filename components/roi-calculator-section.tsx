"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, ShieldCheck } from "lucide-react"

interface CalculatorInputs {
  customerBase: number
  scamRate: number
  averageLoss: number
  segment: string
}

const FATIA_EVITAVEL = 0.4

const formatBR = (value: number) =>
  Math.round(value).toLocaleString("pt-BR", { maximumFractionDigits: 0 })

const formatBRL = (value: number) => `R$ ${formatBR(value)}`

export function ROICalculatorSection() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    customerBase: 100000,
    scamRate: 24,
    averageLoss: 1300,
    segment: "fintech",
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    const section = document.getElementById("roi-calculator")
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const vitimasAno = inputs.customerBase * (inputs.scamRate / 100)
  const perdaAnual = vitimasAno * inputs.averageLoss
  const perdaEvitavel = perdaAnual * FATIA_EVITAVEL
  const golpesEvitaveis = vitimasAno * FATIA_EVITAVEL

  return (
    <section id="roi-calculator" className="py-16 md:py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white/80">Calculadora de exposição</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 text-balance">
            Quanto sua base perde em{" "}
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              golpes por ano
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto text-balance">
            Estime a perda potencial da sua base a golpes digitais e o quanto a verificação pode evitar.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* Calculator Inputs */}
          <div
            className={`transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Card className="p-6 md:p-8 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/15%),theme(backgroundColor.white/5%))] border-white/20 backdrop-blur-sm shadow-2xl h-full flex flex-col">
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-6 md:mb-8">Dados da sua base</h3>

              <div className="space-y-8 flex-1">
                {/* Segment */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Segmento</label>
                  <Select
                    value={inputs.segment}
                    onValueChange={(value) => setInputs((prev) => ({ ...prev, segment: value }))}
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#15153f] border-gray-700">
                      <SelectItem value="fintech">Fintech</SelectItem>
                      <SelectItem value="banco-digital">Banco digital</SelectItem>
                      <SelectItem value="telecom">Telecom</SelectItem>
                      <SelectItem value="seguradora">Seguradora</SelectItem>
                      <SelectItem value="meios-pagamento">Meios de pagamento</SelectItem>
                      <SelectItem value="varejo">Varejo</SelectItem>
                      <SelectItem value="cooperativa">Cooperativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer Base */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Clientes na base:{" "}
                    <span className="text-white font-semibold">{formatBR(inputs.customerBase)}</span>
                  </label>
                  <Slider
                    value={[inputs.customerBase]}
                    onValueChange={([value]) => setInputs((prev) => ({ ...prev, customerBase: value }))}
                    max={10000000}
                    min={10000}
                    step={10000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10 mil</span>
                    <span>10 mi</span>
                  </div>
                </div>

                {/* Scam Rate (per year) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Clientes que sofrem golpe com perda por ano:{" "}
                    <span className="text-white font-semibold">{inputs.scamRate}%</span>
                  </label>
                  <Slider
                    value={[inputs.scamRate]}
                    onValueChange={([value]) => setInputs((prev) => ({ ...prev, scamRate: value }))}
                    max={54}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5%</span>
                    <span>54%</span>
                  </div>
                </div>

                {/* Average Loss */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Prejuízo médio por golpe:{" "}
                    <span className="text-white font-semibold">{formatBRL(inputs.averageLoss)}</span>
                  </label>
                  <Slider
                    value={[inputs.averageLoss]}
                    onValueChange={([value]) => setInputs((prev) => ({ ...prev, averageLoss: value }))}
                    max={5700}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>R$ 100</span>
                    <span>R$ 5.700</span>
                  </div>
                </div>

                <div className="flex-1"></div>
              </div>

              <div className="mt-6 lg:hidden">
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="animate-bounce">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-primary font-medium">Role para ver o resultado</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">💡 Dados de mercado</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-gray-300">
                          <span className="font-medium text-white">51%</span> dos brasileiros foram vítimas de fraude em
                          2024 (Serasa Experian)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-gray-300">
                          <span className="font-medium text-white">40%</span> das vítimas não reconhecem o golpe a tempo
                          (GASA)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-gray-300">
                          <span className="font-medium text-white">Prejuízo médio por vítima:</span> R$ 1.300 a R$ 5.700
                          (Serasa / GASA)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div
            className={`transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Card className="p-6 md:p-8 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/15%),theme(backgroundColor.white/5%))] border-white/20 backdrop-blur-sm shadow-2xl h-full flex flex-col">
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-6 md:mb-8">
                Sua exposição com a Rooki
              </h3>

              <div className="space-y-6 flex-1">
                {/* Hoje vs Com a Rooki */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="text-center p-3 md:p-4 rounded-lg bg-gray-700/30">
                    <div className="text-xs md:text-sm text-gray-400 mb-1">Hoje</div>
                    <div className="text-xl md:text-2xl font-bold text-white">{formatBR(vitimasAno)}</div>
                    <div className="text-xs text-gray-400">golpes com perda/ano</div>
                  </div>
                  <div className="text-center p-3 md:p-4 rounded-lg bg-white/10 border border-white/20">
                    <div className="text-xs md:text-sm text-gray-300 mb-1">Com a Rooki</div>
                    <div className="text-xl md:text-2xl font-bold text-white">{formatBR(golpesEvitaveis)}</div>
                    <div className="text-xs text-gray-300">golpes evitáveis/ano</div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
                      <span className="text-sm md:text-base text-white">Golpes com perda por ano</span>
                    </div>
                    <span className="text-lg md:text-xl font-bold text-white">{formatBR(vitimasAno)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
                      <span className="text-sm md:text-base text-white">Perda anual estimada</span>
                    </div>
                    <span className="text-lg md:text-xl font-bold text-white">{formatBRL(perdaAnual)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
                      <div className="flex flex-col">
                        <span className="text-sm md:text-base text-white">
                          Fatia evitável (não reconhecida a tempo)
                        </span>
                        <span className="text-xs text-gray-400">fonte: GASA</span>
                      </div>
                    </div>
                    <span className="text-lg md:text-xl font-bold text-white">40%</span>
                  </div>
                </div>

                {/* Annual Projection */}
                <div className="mt-6 md:mt-8 p-4 md:p-6 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-center">
                    <div className="text-xs md:text-sm text-gray-300 mb-2">Perda que a Rooki ajuda a evitar por ano</div>
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                      {formatBRL(perdaEvitavel)}
                    </div>
                    <div className="text-xs md:text-sm text-gray-400">
                      Estimativa baseada em médias de mercado (Serasa Experian e GASA, 2024–2025)
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-12 md:mt-16 transition-all duration-700 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-sm text-gray-400 mt-4">
            * Estimativa baseada em médias de mercado (Serasa Experian e GASA, 2024–2025). Os números reais variam por
            base e segmento.
          </p>
        </div>
      </div>
    </section>
  )
}
