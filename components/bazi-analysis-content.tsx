'use client'

import { useSearchParams } from 'next/navigation'
import { BaziLLMAnalysisSystem } from './bazi_LLM_analysis_system'
import { useEffect, useState } from 'react'

export default function BaziAnalysisContent() {
  const searchParams = useSearchParams()
  const [userInput, setUserInput] = useState({
    year: '', month: '', day: '', hour: '', minute: '', gender: '', city: ''
  })

  useEffect(() => {
    setUserInput({
      year: searchParams.get('year') || '',
      month: searchParams.get('month') || '',
      day: searchParams.get('day') || '',
      hour: searchParams.get('hour') || '',
      minute: searchParams.get('minute') || '',
      gender: searchParams.get('gender') || '',
      city: searchParams.get('city') || '',
    })
  }, [searchParams])

  return <BaziLLMAnalysisSystem userInput={userInput} />
}
