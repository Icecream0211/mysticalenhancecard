'use client'

import { BaziAnalysisSystem } from '@/components/bazi-analysis-system'
import { useUserInput } from '../../contexts/UserInputContext'

export default function BaziAnalysisPage() {
  const { userInput } = useUserInput()
  
  if (!userInput.year) {
    return <div>Loading user input...</div>
  }

  return <BaziAnalysisSystem userInput={userInput} />
}
