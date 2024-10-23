'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import debounce from 'lodash/debounce'

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

export function BaziLLMAnalysisSystem({ userInput }: BaziLLMAnalysisSystemProps) {
  const router = useRouter()
  const [analysisContent, setAnalysisContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const contentRef = useRef<HTMLParagraphElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const debouncedSetAnalysisContent = useCallback(
    debounce((content: string) => {
      setAnalysisContent(prev => prev + content)
    }, 100),
    []
  )

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      setLoading(true)
      setError(null)
      setAnalysisContent("")
      
      const formData = new FormData()
      Object.entries(userInput).forEach(([key, value]) => {
        formData.append(key, value)
      })

      try {
        const response = await fetch('http://127.0.0.1:8000/bazi_ai_base_analysis_stream', {
          method: 'POST',
          body: formData,
          signal: abortControllerRef.current.signal
        })

        if (!response.body) {
          throw new Error('ReadableStream not supported')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.trim() !== '') {
              debouncedSetAnalysisContent(line + '\n')
            }
          }
        }

        if (buffer.trim() !== '') {
          debouncedSetAnalysisContent(buffer)
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Failed to fetch analysis:", error)
          setError("获取分析结果失败，请稍后重试。")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [userInput, debouncedSetAnalysisContent])

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [analysisContent])

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 font-['Microsoft_YaHei']">
      <div className="relative py-3 sm:max-w-5xl sm:mx-auto w-full px-4 sm:px-0">
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
          
          <Card className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-cyan-100 to-light-blue-100 bg-opacity-80">
              <CardTitle className="text-2xl font-bold text-center text-gray-800">分析结果</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <p 
                  ref={contentRef}
                  className="text-gray-700 whitespace-pre-line h-96 overflow-y-auto"
                >
                  {loading ? "正在生成分析结果..." : analysisContent}
                </p>
              )}
              {error && (
                <Button onClick={() => fetchAnalysis()} className="mt-4">
                  重试
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
