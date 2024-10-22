'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AnalysisSection {
  title: string;
  content: string;
}

export function BaziLLMAnalysisSystem() {
  const router = useRouter()
  const [analysisContent, setAnalysisContent] = useState<AnalysisSection[]>([
    { title: "命盘", content: "" },
    { title: "喜忌", content: "" },
    { title: "大运", content: "" },
    { title: "事业", content: "" },
    { title: "感情", content: "" },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true)
      try {
        // 这里应该是实际的API调用
        // 以下是模拟流式输出的示例
        for (let i = 0; i < analysisContent.length; i++) {
          const response = await simulateStreamResponse(analysisContent[i].title)
          setAnalysisContent(prev => 
            prev.map((section, index) => 
              index === i ? { ...section, content: response } : section
            )
          )
        }
      } catch (error) {
        console.error("Failed to fetch analysis:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [])

  // 模拟流式响应
  const simulateStreamResponse = async (title: string): Promise<string> => {
    return new Promise((resolve) => {
      let result = ""
      const interval = setInterval(() => {
        result += `这是${title}的详细分析内容。`.repeat(5)
        if (result.length > 200) {
          clearInterval(interval)
          resolve(result)
        }
      }, 100)
    })
  }

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
          
          {loading ? (
            <div className="text-center text-2xl text-gray-600">正在生成您的八字详细解析...</div>
          ) : (
            <div className="space-y-8">
              {analysisContent.map((section, index) => (
                <Card key={index} className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-cyan-100 to-light-blue-100 bg-opacity-80">
                    <CardTitle className="text-2xl font-bold text-center text-gray-800">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
