'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import config from '@/config'

interface UserInput {
  year: string
  month: string
  day: string
  hour: string
  minute: string
  gender: string
  city: string
}

interface BaziLLMAnalysisSystemProps {
  userInput: UserInput
}

interface AnalysisResult {
  content: string
  loading: boolean
  error: string | null
  expanded: boolean
}

const analysisTypes = [
  { key: 'overall', name: '整体分析', endpoint: 'bazi_ai_base_analysis_stream' },
  { key: 'likeDislike', name: '喜忌分析', endpoint: 'bazi_ai_xiji_analysis_stream' },
  { key: 'bigLuck', name: '大运分析', endpoint: 'bazi_ai_dayun_analysis_stream' },
  { key: 'career', name: '事业分析', endpoint: 'bazi_ai_career_analysis_stream' },
  { key: 'relationship', name: '感情分析', endpoint: 'bazi_ai_love_analysis_stream' },
]

export function BaziLLMAnalysisSystem({ userInput }: BaziLLMAnalysisSystemProps) {
  const router = useRouter()
  const [analysisResults, setAnalysisResults] = useState<Record<string, AnalysisResult>>({})
  const abortControllersRef = useRef<Record<string, AbortController>>({})

  const fetchAnalysis = async (key: string, endpoint: string) => {
    if (analysisResults[key] && analysisResults[key].content) {
      setAnalysisResults(prev => ({
        ...prev,
        [key]: { ...prev[key], expanded: !prev[key].expanded }
      }))
      return
    }

    if (abortControllersRef.current[key]) {
      abortControllersRef.current[key].abort()
    }
    abortControllersRef.current[key] = new AbortController()

    setAnalysisResults(prev => ({
      ...prev,
      [key]: { content: '', loading: true, error: null, expanded: true }
    }))
    
    const formData = new FormData()
    // 修改这里，明确指定每个属性
    formData.append('year', userInput.year)
    formData.append('month', userInput.month)
    formData.append('day', userInput.day)
    formData.append('hour', userInput.hour)
    formData.append('minute', userInput.minute)
    formData.append('gender', userInput.gender)
    formData.append('city', userInput.city)

    try {
      const response = await fetch(`${config.apiBaseUrl}/${endpoint}`, {
        method: 'POST',
        body: formData,
        signal: abortControllersRef.current[key].signal
      })

      if (!response.body) {
        throw new Error('ReadableStream not supported')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let fullContent = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullContent += chunk

        setAnalysisResults(prev => ({
          ...prev,
          [key]: { ...prev[key], content: fullContent }
        }))
      }

      setAnalysisResults(prev => ({
        ...prev,
        [key]: { ...prev[key], loading: false, expanded: true }
      }))
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Failed to fetch analysis:", error)
        setAnalysisResults(prev => ({
          ...prev,
          [key]: { ...prev[key], error: "获取分析结果失败，请稍后重试。", loading: false }
        }))
      }
    } finally {
      delete abortControllersRef.current[key]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-6 flex flex-col justify-center sm:py-12 font-['Microsoft_YaHei']">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <Button 
            onClick={() => router.back()} 
            className="mb-8 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            variant="ghost"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回
          </Button>
          
          <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">详细八字解析</h1>
          
          <div className="space-y-4">
            {analysisTypes.map((type) => (
              <div key={type.key} className="w-full">
                <Button
                  onClick={() => fetchAnalysis(type.key, type.endpoint)}
                  className="w-full justify-between text-left bg-blue-50 hover:bg-blue-100 text-gray-800 border border-blue-200 rounded-lg"
                  variant="outline"
                >
                  <span>{type.name}</span>
                  {analysisResults[type.key]?.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                
                {analysisResults[type.key]?.expanded && (
                  <Card className="mt-2 bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md border border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 bg-opacity-80 py-2">
                      <CardTitle className="text-xl font-bold text-center text-gray-800">
                        {type.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 bg-white">
                      {analysisResults[type.key]?.loading ? (
                        <div className="flex justify-center items-center h-24">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      ) : (
                        <p className="text-gray-700 whitespace-pre-line max-h-96 overflow-y-auto text-sm">
                          {analysisResults[type.key]?.content || "暂无分析结果"}
                        </p>
                      )}
                      {analysisResults[type.key]?.error && (
                        <div className="text-red-500 mt-4 text-sm">{analysisResults[type.key].error}</div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
