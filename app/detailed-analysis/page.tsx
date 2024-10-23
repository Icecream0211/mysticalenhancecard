'use client'

import React, { useEffect, useState } from 'react'
import { BaziLLMAnalysisSystem } from '@/components/bazi_LLM_analysis_system'
import { useSearchParams } from 'next/navigation'

interface UserInput {
  year: string
  month: string
  day: string
  hour: string
  minute: string
  gender: string
  city: string
}

export default function DetailedAnalysisPage() {
  const searchParams = useSearchParams()
  const [userInput, setUserInput] = useState<UserInput | null>(null)

  useEffect(() => {
    const input: UserInput = {
      year: searchParams.get('year') || '',
      month: searchParams.get('month') || '',
      day: searchParams.get('day') || '',
      hour: searchParams.get('hour') || '',
      minute: searchParams.get('minute') || '',
      gender: searchParams.get('gender') || '',
      city: searchParams.get('city') || '',
    }
    setUserInput(input)
  }, [searchParams])

  if (!userInput) {
    return <div>Loading...</div>
  }

  return <BaziLLMAnalysisSystem userInput={userInput} />
}
