"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react"

interface CalculatorInputs {
  monthlyVisitors: number
  currentConversionRate: number
  averageOrderValue: number
  businessType: string
}

export function ROICalculatorSection() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyVisitors: 10000,
    currentConversionRate: 2,
    averageOrderValue: 150,
    businessType: "ecommerce",
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

  const getBusinessDefaults = () => {
    const businessDefaults = {
      ecommerce: { avgOrder: 85, maxOrder: 500, conversion: 35, response: 80, satisfaction: 45 },
      retail: { avgOrder: 65, maxOrder: 300, conversion: 30, response: 75, satisfaction: 40 },
      realestate: { avgOrder: 5000, maxOrder: 50000, conversion: 40, response: 85, satisfaction: 50 },
      hospitality: { avgOrder: 180, maxOrder: 1000, conversion: 25, response: 70, satisfaction: 35 },
      healthcare: { avgOrder: 250, maxOrder: 2000, conversion: 45, response: 90, satisfaction: 55 },
      finance: { avgOrder: 1200, maxOrder: 10000, conversion: 35, response: 85, satisfaction: 50 },
      automotive: { avgOrder: 25000, maxOrder: 100000, conversion: 30, response: 75, satisfaction: 40 },
      default: { avgOrder: 150, maxOrder: 2000, conversion: 35, response: 80, satisfaction: 45 },
    }

    return businessDefaults[inputs.businessType as keyof typeof businessDefaults] || businessDefaults.default
  }

  useEffect(() => {
    const defaults = getBusinessDefaults()
    setInputs((prev) => ({ ...prev, averageOrderValue: defaults.avgOrder }))
  }, [inputs.businessType])

  const businessConfig = getBusinessDefaults()
  const improvements = {
    conversion: businessConfig.conversion,
    response: businessConfig.response,
    satisfaction: businessConfig.satisfaction,
  }

  // Current metrics
  const currentLeads = Math.round((inputs.monthlyVisitors * inputs.currentConversionRate) / 100)
  const currentRevenue = currentLeads * inputs.averageOrderValue

  // Improved metrics with AI chatbot
  const newConversionRate = inputs.currentConversionRate * (1 + improvements.conversion / 100)
  const newLeads = Math.round((inputs.monthlyVisitors * newConversionRate) / 100)
  const newRevenue = newLeads * inputs.averageOrderValue

  // Gains
  const additionalLeads = newLeads - currentLeads
  const additionalRevenue = newRevenue - currentRevenue
  const revenueIncrease = ((newRevenue - currentRevenue) / currentRevenue) * 100

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
                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Segmento</label>
                  <Select
                    value={inputs.businessType}
                    onValueChange={(value) => setInputs((prev) => ({ ...prev, businessType: value }))}
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="ecommerce">Fintech</SelectItem>
                      <SelectItem value="retail">Banco digital</SelectItem>
                      <SelectItem value="realestate">Telecom</SelectItem>
                      <SelectItem value="hospitality">Seguradora</SelectItem>
                      <SelectItem value="healthcare">Cooperativa</SelectItem>
                      <SelectItem value="finance">Meios de pagamento</SelectItem>
                      <SelectItem value="automotive">Varejo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Monthly Visitors */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Clientes na base:{" "}
                    <span className="text-white font-semibold">{inputs.monthlyVisitors.toLocaleString()}</span>
                  </label>
                  <Slider
                    value={[inputs.monthlyVisitors]}
                    onValueChange={([value]) => setInputs((prev) => ({ ...prev, monthlyVisitors: value }))}
                    max={100000}
                    min={1000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10 mil</span>
                    <span>10 mi</span>
                  </div>
                </div>

                {/* Conversion Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Clientes que recebem golpe/mês:{" "}
                    <span className="text-white font-semibold">{inputs.currentConversionRate}%</span>
                  </label>
                  <Slider
                    value={[inputs.currentConversionRate]}
                    onValueChange={([value]) => setInputs((prev) => ({ ...prev, currentConversionRate: value }))}
                    max={10}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1%</span>
                    <span>30%</span>
                  </div>
                </div>

                {/* Average Order Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Prejuízo médio por golpe:{" "}
                    <span className="text-white font-semibold">R$ {inputs.averageOrderValue.toLocaleString()}</span>
                  </label>
                  <Slider
                    value={[inputs.averageOrderValue]}
                    onValueChange={([value]) => setInputs((prev) => ({ ...prev, averageOrderValue: value }))}
                    max={businessConfig.maxOrder}
                    min={25}
                    step={inputs.businessType === "automotive" || inputs.businessType === "realestate" ? 1000 : 25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>R$ 200</span>
                    <span>R$ {businessConfig.maxOrder.toLocaleString()}</span>
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
                          <span className="font-medium text-white">Mercado:</span> golpes via PIX e phishing são a
                          fraude que mais cresce no Brasil
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-gray-300">
                          <span className="font-medium text-white">Velocidade:</span> a verificação devolve o veredito em
                          menos de 10 segundos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-gray-300">
                          <span className="font-medium text-white">Confiança:</span> cliente que verifica antes abre
                          menos chamado de estorno
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
                {/* Current vs New Metrics */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="text-center p-3 md:p-4 rounded-lg bg-gray-700/30">
                    <div className="text-xs md:text-sm text-gray-400 mb-1">Hoje</div>
                    <div className="text-xl md:text-2xl font-bold text-white">{currentLeads}</div>
                    <div className="text-xs text-gray-400">golpes/mês</div>
                  </div>
                  <div className="text-center p-3 md:p-4 rounded-lg bg-white/10 border border-white/20">
                    <div className="text-xs md:text-sm text-gray-300 mb-1">Com a Rooki</div>
                    <div className="text-xl md:text-2xl font-bold text-white">{newLeads}</div>
                    <div className="text-xs text-gray-300">golpes evitados/mês</div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
                      <span className="text-sm md:text-base text-white">Golpes evitados</span>
                    </div>
                    <span className="text-lg md:text-xl font-bold text-white">+{additionalLeads}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
                      <span className="text-sm md:text-base text-white">Perda evitada</span>
                    </div>
                    <span className="text-lg md:text-xl font-bold text-white">
                      R$ {additionalRevenue.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
                      <span className="text-sm md:text-base text-white">Redução de exposição</span>
                    </div>
                    <span className="text-lg md:text-xl font-bold text-white">+{revenueIncrease.toFixed(1)}%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
                      <span className="text-sm md:text-base text-white">Tempo de verificação</span>
                    </div>
                    <span className="text-lg md:text-xl font-bold text-white">{improvements.response}% mais rápido</span>
                  </div>
                </div>

                {/* Annual Projection */}
                <div className="mt-6 md:mt-8 p-4 md:p-6 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-center">
                    <div className="text-xs md:text-sm text-gray-300 mb-2">Perda potencial evitada por ano</div>
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                      R$ {(additionalRevenue * 12).toLocaleString()}
                    </div>
                    <div className="text-xs md:text-sm text-gray-400">
                      Estimativa baseada nos seus dados e em médias de mercado
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
            * Estimativa com base em médias de mercado. Os números reais variam por base e segmento.
          </p>
        </div>
      </div>
    </section>
  )
}
