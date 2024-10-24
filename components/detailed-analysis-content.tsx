'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DetailedAnalysisContent() {
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

  return (
    <div>
      <h1>详细分析</h1>
      <pre>{JSON.stringify(userInput, null, 2)}</pre>
    </div>
  )
}
