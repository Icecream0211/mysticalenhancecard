'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeftIcon, ChevronRightIcon, MessageSquareIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axios from 'axios'
import html2canvas from 'html2canvas'
import { useRouter, useSearchParams } from 'next/navigation'
import config from '@/config'
import { useUserInput } from '../contexts/UserInputContext'  // 导入 useUserInput hook

interface UserInput {
  year: string
  month: string
  day: string
  hour: string
  minute: string
  gender: string
  city: string
}

interface LiuNian {
  age: number;
  year: number;
  gan_zhi: string;
  gan_zhi_2: string;
  remark: string;
}

interface DaYun {
  start_age: number;
  start_year: number;
  gan_zhi: string;
  remark: string;
  liunian: LiuNian[];
}

interface BaziAnalysisResult {
  birth_year: number;
  is_solar: string;
  is_run_yuer: string;
  gender: string;
  solar_date: string;
  lunar_date: string;
  bazi: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  wuxing_scores: {
    [key: string]: number;
  };
  gan_scores: {
    [key: string]: number;
  };
  strong_weak_score: {
    strong: number;
    weak: boolean;
    remark: string;
  };
  da_yun: string[];
  tiao_hou: string;
  jin_bu_huan: string;
  ge_ju: string[];
  temp_scores: {
    temps_scores: number;
    remark: string;
  };
  liunian_dayun: DaYun[];
}

interface BaziAnalysisSystemProps {
  userInput: UserInput
}

// 将 decodeText 函数移到组件外部
const decodeText = (text: string | undefined): string => {
  if (!text) return '';
  try {
    return decodeURIComponent(escape(text));
  } catch (e) {
    console.error('Decoding failed', e);
    return text;
  }
};

export function BaziAnalysisSystem({ userInput }: BaziAnalysisSystemProps) {
  const router = useRouter()
  const [analysisResult, setAnalysisResult] = useState<BaziAnalysisResult | null>(null);
  const [selectedDaYun, setSelectedDaYun] = useState<DaYun | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  // 使用 useMemo 缓存解码后的结果
  const decodedAnalysisResult = useMemo(() => {
    if (!analysisResult) return null;
    return {
      ...analysisResult,
      solar_date: decodeText(analysisResult.solar_date),
      lunar_date: decodeText(analysisResult.lunar_date),
      gender: decodeText(analysisResult.gender),
      is_solar: decodeText(analysisResult.is_solar),
      is_run_yuer: decodeText(analysisResult.is_run_yuer),
    };
  }, [analysisResult]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!userInput.year) return; // 如果没有用户输入，不进行API调用
      setLoading(true)

      const formData = new FormData();
      Object.entries(userInput).forEach(([key, value]) => {
        formData.append(key, value);
      });

      try {
        console.log('🚀 发送八字计算请求:', requestData);
        const response = await axios.post(`${config.apiBaseUrl}/calculate_bazi_need/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        });
        console.log('✅ API响应成功:', response.data);
        setAnalysisResult(response.data);
        if (response.data.liunian_dayun && response.data.liunian_dayun.length > 0) {
          setSelectedDaYun(response.data.liunian_dayun[0]);
        }
      } catch (error) {
        console.error('❌ API调用失败:', error);
        // 可以在这里添加用户友好的错误提示
      } finally {
        setLoading(false)
      }
    };

    fetchAnalysis();
  }, [userInput]);

  const scrollToSelected = (index: number) => {
    if (scrollRef.current && analysisResult) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const scrollLeft = (scrollWidth - clientWidth) * (index / (analysisResult.liunian_dayun.length - 1));
      scrollRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  const saveAsImage = async () => {
    if (resultRef.current) {
      const canvas = await html2canvas(resultRef.current)
      const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
      const link = document.createElement('a')
      link.download = 'bazi-analysis-result.png'
      link.href = image
      link.click()
    }
  }

  const handleDetailedAnalysis = () => {
    router.push('/detailed-analysis')
  }

  if (!userInput.year) {
    return <div>No user input available. Please go back and enter your details.</div>;
  }

  if (loading) {
    return <div>Loading analysis...</div>;
  }

  if (!analysisResult) {
    return <div>No analysis result available. Please try again.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      {/* Add this fixed button at the top */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => {/* Handle AI analysis */}}
          className="rounded-full p-3 bg-blue-500 text-white shadow-lg"
        >
          <MessageSquareIcon className="w-6 h-6" />
        </Button>
      </div>

      <div className="relative py-3 sm:max-w-5xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div ref={resultRef} className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">八字分析结果</h1>
          
          {/* 基本信息 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">基本信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">公历日期：</span>{decodedAnalysisResult?.solar_date}</div>
              <div><span className="font-medium">农历日期：</span>{decodedAnalysisResult?.lunar_date}</div>
              <div><span className="font-medium">性别：</span>{decodedAnalysisResult?.gender}</div>
              <div><span className="font-medium">历法：</span>{decodedAnalysisResult?.is_solar}</div>
              <div><span className="font-medium">是否闰月：</span>{decodedAnalysisResult?.is_run_yuer}</div>
            </div>
          </section>

          {/* 新的详细解析按钮 */}
          <div className="mb-8 text-center">
            <button
              onClick={handleDetailedAnalysis}
              className="px-6 py-3 rounded-full text-white font-semibold
                         bg-gradient-to-r from-blue-400 to-purple-500
                         hover:from-blue-500 hover:to-purple-600
                         transition-all duration-300 ease-in-out
                         shadow-lg hover:shadow-xl
                         transform hover:-translate-y-1
                         relative overflow-hidden"
            >
              <span className="relative z-10">查看详细解析</span>
              <span className="absolute inset-0 bg-white opacity-25 transform scale-x-0 scale-y-0 origin-center transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:scale-y-100 rounded-full"></span>
            </button>
          </div>

          {/* 八字 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">八字</h2>
            <div className="grid grid-cols-4 gap-4 text-center">
              {Object.entries(decodedAnalysisResult?.bazi || {}).map(([key, value]) => (
                <div key={key} className="bg-gray-100 p-2 rounded">
                  <div className="font-medium text-gray-600">
                    {key === 'year' ? '年柱' :
                     key === 'month' ? '月柱' :
                     key === 'day' ? '日柱' :
                     key === 'hour' ? '时柱' : key}
                  </div>
                  <div className="text-lg">{value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 五行得分 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">五行得分</h2>
            <div className="flex justify-between">
              {Object.entries(decodedAnalysisResult?.wuxing_scores || {}).map(([element, score]) => (
                <div key={element} className="text-center">
                  <div className="font-medium">{element}</div>
                  <div className="text-lg">{score}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 天干得分 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">天干得分</h2>
            <div className="grid grid-cols-5 gap-4 text-center">
              {Object.entries(decodedAnalysisResult?.gan_scores || {}).map(([gan, score]) => (
                <div key={gan} className="bg-gray-100 p-2 rounded">
                  <div className="font-medium">{gan}</div>
                  <div>{score}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 强弱分数 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">强弱分数</h2>
            <div>
              <div><span className="font-medium">强度：</span>{decodedAnalysisResult?.strong_weak_score.strong}</div>
              <div><span className="font-medium">是否弱：</span>{decodedAnalysisResult?.strong_weak_score.weak ? '是' : '否'}</div>
              <div><span className="font-medium">备注：</span>{decodedAnalysisResult?.strong_weak_score.remark}</div>
            </div>
          </section>

          {/* 大运 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">大运</h2>
            <div className="grid grid-cols-6 gap-2 text-center">
              {decodedAnalysisResult?.da_yun.map((dayun, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded">
                  {dayun}
                </div>
              ))}
            </div>
          </section>

          {/* 其他信息 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">其信息</h2>
            <div><span className="font-medium">调候：</span>{decodedAnalysisResult?.tiao_hou}</div>
            <div><span className="font-medium">金不换：</span>{decodedAnalysisResult?.jin_bu_huan}</div>
            <div><span className="font-medium">局：</span>{decodedAnalysisResult?.ge_ju.join(', ')}</div>
          </section>

          {/* 温度得分 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">温度得分</h2>
            <div>
              <div><span className="font-medium">得分：</span>{decodedAnalysisResult?.temp_scores.temps_scores}</div>
              <div><span className="font-medium">备注：</span>{decodedAnalysisResult?.temp_scores.remark}</div>
            </div>
          </section>

          {/* 大运流年图 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">大运流年图</h2>
            
            {/* 大运选择器 */}
            <div className="relative mb-6">
              <div ref={scrollRef} className="flex overflow-x-auto pb-2 hide-scrollbar">
                {decodedAnalysisResult?.liunian_dayun.map((daYun, index) => (
                  <button
                    key={daYun.start_age}
                    onClick={() => {
                      setSelectedDaYun(daYun);
                      scrollToSelected(index);
                    }}
                    className={`flex-shrink-0 w-24 p-2 text-center border rounded mr-2 ${
                      selectedDaYun?.start_age === daYun.start_age
                        ? 'bg-blue-500 text-white'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <div>{daYun.start_year}</div>
                    <div className="text-sm">{daYun.start_age}岁</div>
                    <div className="font-bold">{daYun.gan_zhi}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 选中的大详情 */}
            {selectedDaYun && (
              <div className="border rounded p-4 mb-4">
                <h3 className="text-xl font-bold mb-2">
                  {selectedDaYun.start_age}岁 - {selectedDaYun.start_age + 9}岁 ({selectedDaYun.gan_zhi})
                </h3>
                <p className="text-sm mb-4">{selectedDaYun.remark}</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {selectedDaYun.liunian.map((liuNian, index) => (
                    <div key={index} className="text-center border rounded p-2">
                      <div>{liuNian.year}</div>
                      <div className="font-bold">{liuNian.gan_zhi}</div>
                      <div className="text-xs">{liuNian.age}岁</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 流年详情 */}
            {selectedDaYun && (
              <div className="border rounded p-4">
                <h4 className="text-lg font-semibold mb-2">流年详情</h4>
                <div className="space-y-2">
                  {selectedDaYun.liunian.map((liuNian, index) => (
                    <div key={index} className="border-b pb-2">
                      <p className="font-medium">{liuNian.year}年 ({liuNian.age}岁) - {liuNian.gan_zhi}</p>
                      <p className="text-sm">{liuNian.remark}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 导航按钮 */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  const index = decodedAnalysisResult?.liunian_dayun.findIndex(d => d.start_age === selectedDaYun?.start_age);
                  if (index !== undefined && index > 0) {
                    setSelectedDaYun(decodedAnalysisResult?.liunian_dayun[index - 1] as DaYun);
                    scrollToSelected(index - 1);
                  }
                }}
                className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={selectedDaYun?.start_age === decodedAnalysisResult?.liunian_dayun[0]?.start_age}
              >
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                上一大运
              </button>
              <button
                onClick={() => {
                  const index = decodedAnalysisResult?.liunian_dayun.findIndex(d => d.start_age === selectedDaYun?.start_age);
                  if (index !== undefined && decodedAnalysisResult && index < decodedAnalysisResult.liunian_dayun.length - 1) {
                    setSelectedDaYun(decodedAnalysisResult.liunian_dayun[index + 1]);
                    scrollToSelected(index + 1);
                  }
                }}
                className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={selectedDaYun?.start_age === decodedAnalysisResult?.liunian_dayun[decodedAnalysisResult?.liunian_dayun.length - 1]?.start_age}
              >
                下一大运
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            </div>
          </section>

          {/* 在最后添加保存/分享按钮 */}
          <div className="mt-8 text-center">
            <Button 
              onClick={saveAsImage} 
              className="px-6 py-2 rounded text-white font-semibold
                         bg-gradient-to-r from-cyan-400 to-light-blue-500
                         hover:from-cyan-500 hover:to-light-blue-600
                         transition-colors duration-300"
            >
              保存/分享
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
