'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axios from 'axios'

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

export function BaziAnalysisSystem() {
  const [step, setStep] = useState(1)
  const [userInput, setUserInput] = useState<UserInput>({
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    gender: '',
    city: ''
  })
  
  const [selectedDaYun, setSelectedDaYun] = useState<DaYun | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [analysisResult, setAnalysisResult] = useState<BaziAnalysisResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInput(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setUserInput(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('year', userInput.year);
    formData.append('month', userInput.month);
    formData.append('day', userInput.day);
    formData.append('hour', userInput.hour);
    formData.append('minute', userInput.minute);
    formData.append('gender', userInput.gender === 'male' ? '男' : '女');
    formData.append('city', userInput.city);

    try {
      const response = await axios.post('http://127.0.0.1:8000/calculate_bazi_need/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setAnalysisResult(response.data);
      if (response.data.liunian_dayun && response.data.liunian_dayun.length > 0) {
        setSelectedDaYun(response.data.liunian_dayun[0]);
      }
      setStep(2);
    } catch (error) {
      console.error('Error fetching bazi analysis:', error);
      // 这里可以添加错误处理，比如显示一个错误消息给用户
    }
  };

  const scrollToSelected = (index: number) => {
    if (scrollRef.current && analysisResult) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const scrollLeft = (scrollWidth - clientWidth) * (index / (analysisResult.liunian_dayun.length - 1));
      scrollRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <h1 className="text-2xl font-semibold mb-5 text-center">输入出生信息</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="year">年份</Label>
                <Input id="year" name="year" value={userInput.year} onChange={handleInputChange} placeholder="例如：1990" required />
              </div>
              <div>
                <Label htmlFor="month">月份</Label>
                <Input id="month" name="month" value={userInput.month} onChange={handleInputChange} placeholder="1-12" required />
              </div>
              <div>
                <Label htmlFor="day">日期</Label>
                <Input id="day" name="day" value={userInput.day} onChange={handleInputChange} placeholder="1-31" required />
              </div>
              <div>
                <Label htmlFor="hour">小时</Label>
                <Input id="hour" name="hour" value={userInput.hour} onChange={handleInputChange} placeholder="0-23" required />
              </div>
              <div>
                <Label htmlFor="minute">分钟</Label>
                <Input id="minute" name="minute" value={userInput.minute} onChange={handleInputChange} placeholder="0-59" required />
              </div>
              <div>
                <Label htmlFor="gender">性别</Label>
                <Select name="gender" onValueChange={(value) => handleSelectChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">出生城市</Label>
                <Input id="city" name="city" value={userInput.city} onChange={handleInputChange} placeholder="例如：北京" required />
              </div>
              <Button type="submit" className="w-full">开始解析</Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // If we're on step 2, show the analysis result
  if (step === 2 && !analysisResult) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-5xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">八字分析结果</h1>
          
          {/* 基本信息 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">基本信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">公历日期：</span>{analysisResult?.solar_date}</div>
              <div><span className="font-medium">农历日期：</span>{analysisResult?.lunar_date}</div>
              <div><span className="font-medium">性别：</span>{analysisResult?.gender}</div>
              <div><span className="font-medium">历法：</span>{analysisResult?.is_solar}</div>
              <div><span className="font-medium">是否闰月：</span>{analysisResult?.is_run_yuer}</div>
            </div>
          </section>

          {/* 八字 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">八字</h2>
            <div className="grid grid-cols-4 gap-4 text-center">
              {Object.entries(analysisResult?.bazi).map(([key, value]) => (
                <div key={key} className="bg-gray-100 p-2 rounded">
                  <div className="font-medium text-gray-600">{key}</div>
                  <div className="text-lg">{value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 五行得分 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">五行得分</h2>
            <div className="flex justify-between">
              {Object.entries(analysisResult?.wuxing_scores).map(([element, score]) => (
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
              {Object.entries(analysisResult?.gan_scores).map(([gan, score]) => (
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
              <div><span className="font-medium">强度：</span>{analysisResult?.strong_weak_score.strong}</div>
              <div><span className="font-medium">是否弱：</span>{analysisResult?.strong_weak_score.weak ? '是' : '否'}</div>
              <div><span className="font-medium">备注：</span>{analysisResult?.strong_weak_score.remark}</div>
            </div>
          </section>

          {/* 大运 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">大运</h2>
            <div className="grid grid-cols-6 gap-2 text-center">
              {analysisResult?.da_yun.map((dayun, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded">
                  {dayun}
                </div>
              ))}
            </div>
          </section>

          {/* 其他信息 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">其他信息</h2>
            <div><span className="font-medium">调候：</span>{analysisResult?.tiao_hou}</div>
            <div><span className="font-medium">金不换：</span>{analysisResult?.jin_bu_huan}</div>
            <div><span className="font-medium">局：</span>{analysisResult?.ge_ju.join(', ')}</div>
          </section>

          {/* 温度得分 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">温度得分</h2>
            <div>
              <div><span className="font-medium">得分：</span>{analysisResult?.temp_scores.temps_scores}</div>
              <div><span className="font-medium">备注：</span>{analysisResult?.temp_scores.remark}</div>
            </div>
          </section>

          {/* 大运流年图 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">大运流年图</h2>
            
            {/* 大运选择器 */}
            <div className="relative mb-6">
              <div ref={scrollRef} className="flex overflow-x-auto pb-2 hide-scrollbar">
                {analysisResult?.liunian_dayun.map((daYun, index) => (
                  <button
                    key={daYun.start_age}
                    onClick={() => {
                      setSelectedDaYun(daYun);
                      scrollToSelected(index);
                    }}
                    className={`flex-shrink-0 w-24 p-2 text-center border rounded mr-2 ${
                      selectedDaYun.start_age === daYun.start_age
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

            {/* 选中的大运详情 */}
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
            <div className="border rounded p-4">
              <h4 className="text-lg font-semibold mb-2">流年详情</h4>
              <div className="space-y-2">
                {selectedDaYun?.liunian.map((liuNian, index) => (
                  <div key={index} className="border-b pb-2">
                    <p className="font-medium">{liuNian.year}年 ({liuNian.age}岁) - {liuNian.gan_zhi}</p>
                    <p className="text-sm">{liuNian.remark}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 导航按钮 */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  const index = analysisResult?.liunian_dayun.findIndex(d => d.start_age === selectedDaYun.start_age);
                  if (index > 0) {
                    setSelectedDaYun(analysisResult?.liunian_dayun[index - 1]);
                    scrollToSelected(index - 1);
                  }
                }}
                className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={selectedDaYun.start_age === analysisResult?.liunian_dayun[0].start_age}
              >
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                上一大运
              </button>
              <button
                onClick={() => {
                  const index = analysisResult?.liunian_dayun.findIndex(d => d.start_age === selectedDaYun.start_age);
                  if (index < analysisResult?.liunian_dayun.length - 1) {
                    setSelectedDaYun(analysisResult?.liunian_dayun[index + 1]);
                    scrollToSelected(index + 1);
                  }
                }}
                className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={selectedDaYun.start_age === analysisResult?.liunian_dayun[analysisResult?.liunian_dayun.length - 1].start_age}
              >
                下一大运
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
