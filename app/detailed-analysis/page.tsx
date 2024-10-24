'use client'

import React from 'react'
import { BaziLLMAnalysisSystem } from '@/components/bazi_LLM_analysis_system'
import { useUserInput } from '../../contexts/UserInputContext'

export default function DetailedAnalysisPage() {
  const { userInput } = useUserInput()

  if (!userInput.year) {
    return <div>No user input available. Please go back and enter your details.</div>
  }

  return <BaziLLMAnalysisSystem userInput={userInput} />
}
