'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const DetailedAnalysisContent = dynamic(() => import('@/components/detailed-analysis-content'), { ssr: false })

export default function DetailedAnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailedAnalysisContent />
    </Suspense>
  )
}
