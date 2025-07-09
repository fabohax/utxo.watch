"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExchangeRates {
  USD: number
  EUR: number
  GBP: number
  JPY: number
  CAD: number
  AUD: number
  CHF: number
  CNY: number
}

// Mock exchange rates (in a real app, these would come from an API)
const mockExchangeRates: ExchangeRates = {
  USD: 45234.67,
  EUR: 41250.32,
  GBP: 35678.9,
  JPY: 6789012.45,
  CAD: 61234.56,
  AUD: 67890.12,
  CHF: 40123.45,
  CNY: 325678.9,
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
]

export function CurrencyConverter() {
  const [satoshis, setSatoshis] = useState("100000000") // 1 BTC in satoshis
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [fiatAmount, setFiatAmount] = useState("")
  const [conversionMode, setConversionMode] = useState<"sats-to-fiat" | "fiat-to-sats">("sats-to-fiat")
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(mockExchangeRates)

  // Simulate real-time exchange rate updates
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeRates((prev) => ({
        USD: prev.USD + (Math.random() - 0.5) * 100,
        EUR: prev.EUR + (Math.random() - 0.5) * 90,
        GBP: prev.GBP + (Math.random() - 0.5) * 80,
        JPY: prev.JPY + (Math.random() - 0.5) * 10000,
        CAD: prev.CAD + (Math.random() - 0.5) * 120,
        AUD: prev.AUD + (Math.random() - 0.5) * 130,
        CHF: prev.CHF + (Math.random() - 0.5) * 85,
        CNY: prev.CNY + (Math.random() - 0.5) * 600,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Convert satoshis to fiat
  const convertSatsToFiat = (sats: string, currency: string) => {
    const satoshiAmount = Number.parseFloat(sats) || 0
    const btcAmount = satoshiAmount / 100000000 // Convert sats to BTC
    const rate = exchangeRates[currency as keyof ExchangeRates] || 0
    return btcAmount * rate
  }

  // Convert fiat to satoshis
  const convertFiatToSats = (fiat: string, currency: string) => {
    const fiatAmount = Number.parseFloat(fiat) || 0
    const rate = exchangeRates[currency as keyof ExchangeRates] || 0
    const btcAmount = fiatAmount / rate
    return Math.round(btcAmount * 100000000) // Convert BTC to sats
  }

  // Handle satoshi input change
  const handleSatoshiChange = (value: string) => {
    setSatoshis(value)
    if (conversionMode === "sats-to-fiat") {
      const converted = convertSatsToFiat(value, selectedCurrency)
      setFiatAmount(converted.toFixed(2))
    }
  }

  // Handle fiat input change
  const handleFiatChange = (value: string) => {
    setFiatAmount(value)
    if (conversionMode === "fiat-to-sats") {
      const converted = convertFiatToSats(value, selectedCurrency)
      setSatoshis(converted.toString())
    }
  }

  // Handle currency change
  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency)
    if (conversionMode === "sats-to-fiat" && satoshis) {
      const converted = convertSatsToFiat(satoshis, currency)
      setFiatAmount(converted.toFixed(2))
    } else if (conversionMode === "fiat-to-sats" && fiatAmount) {
      const converted = convertFiatToSats(fiatAmount, currency)
      setSatoshis(converted.toString())
    }
  }

  // Toggle conversion mode
  const toggleConversionMode = () => {
    const newMode = conversionMode === "sats-to-fiat" ? "fiat-to-sats" : "sats-to-fiat"
    setConversionMode(newMode)

    // Recalculate based on new mode
    if (newMode === "sats-to-fiat" && satoshis) {
      const converted = convertSatsToFiat(satoshis, selectedCurrency)
      setFiatAmount(converted.toFixed(2))
    } else if (newMode === "fiat-to-sats" && fiatAmount) {
      const converted = convertFiatToSats(fiatAmount, selectedCurrency)
      setSatoshis(converted.toString())
    }
  }

  const selectedCurrencyInfo = currencies.find((c) => c.code === selectedCurrency)
  const currentRate = exchangeRates[selectedCurrency as keyof ExchangeRates]

  // Auto-convert on mount
  useEffect(() => {
    if (conversionMode === "sats-to-fiat" && satoshis) {
      const converted = convertSatsToFiat(satoshis, selectedCurrency)
      setFiatAmount(converted.toFixed(2))
    }
  }, [exchangeRates, selectedCurrency])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">


        {/* Input Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="satoshis">Satoshis</Label>
            <Input
              id="satoshis"
              type="number"
              placeholder="Enter satoshis..."
              value={satoshis}
              onChange={(e) => handleSatoshiChange(e.target.value)}
              className="font-mono"
            />
            <div className="text-xs text-muted-foreground">
              {satoshis && !isNaN(Number(satoshis)) ? `${(Number(satoshis) / 100000000).toFixed(8)} BTC` : "0 BTC"}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fiat">
              {selectedCurrencyInfo?.name} ({selectedCurrencyInfo?.symbol})
            </Label>
            <Input
              id="fiat"
              type="number"
              placeholder={`Enter ${selectedCurrency}...`}
              value={fiatAmount}
              onChange={(e) => handleFiatChange(e.target.value)}
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 space-x-2">
          {/* Currency Selection */}
          <div className="col-span-2">
            <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currency.symbol}</span>
                      <span>{currency.code}</span>
                      <span className="text-muted-foreground text-sm">- {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
                  {/* Conversion Mode Toggle */}
          <div className="flex justify-center">
            <Button variant="outline" size="sm" onClick={toggleConversionMode} className="py-2 bg-transparent">
              <ArrowUpDown className="w-4 h-4" />
              {conversionMode === "sats-to-fiat" ? "Sats → Fiat" : "Fiat → Sats"}
            </Button>
          </div>
        </div>

        {/* Quick Conversion Buttons */}
        <div className="space-y-2">
          <Label className="text-sm">Quick Convert</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSatoshiChange("100000000")} className="text-xs">
              1 BTC
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSatoshiChange("10000000")} className="text-xs">
              0.1 BTC
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSatoshiChange("1000000")} className="text-xs">
              0.01 BTC
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSatoshiChange("100000")} className="text-xs">
              0.001 BTC
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
