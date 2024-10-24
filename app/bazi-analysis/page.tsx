'use client'

import { BaziAnalysisSystem } from '@/components/bazi-analysis-system'
import { useUserInput } from '../../contexts/UserInputContext'

export default function BaziAnalysisPage() {
  const { userInput } = useUserInput()

  if (!userInput.year) {
    return <div>No user input available. Please go back and enter your details.</div>
  }

  return <BaziAnalysisSystem userInput={userInput} />
}
