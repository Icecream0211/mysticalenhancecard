'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

const mockResult: BaziAnalysisResult = {
  birth_year: 1989,
  is_solar: "公历",
  is_run_yuer: "非闰月",
  gender: "男",
  solar_date: "1989年3月18日",
  lunar_date: "1989年2月11日",
  bazi: {
    year: "己巳",
    month: "丁卯",
    day: "丁丑",
    hour: "丁未"
  },
  wuxing_scores: {
    "金": 2,
    "木": 17,
    "水": 2,
    "火": 22,
    "土": 17
  },
  gan_scores: {
    "甲": 0,
    "乙": 17,
    "丙": 5,
    "丁": 17,
    "戊": 2,
    "己": 15,
    "庚": 1,
    "辛": 1,
    "壬": 0,
    "癸": 2
  },
  strong_weak_score: {
    strong: 39,
    weak: false,
    remark: "通常>29为强，需要参考月份、坐支等"
  },
  da_yun: [
    "丙寅", "乙丑", "甲子", "癸亥", "壬戌", "辛酉",
    "庚申", "己未", "戊午", "丁巳", "丙辰", "乙卯"
  ],
  tiao_hou: "1庚2_甲",
  jin_bu_huan: "调候：喜庚甲  忌丙  大运：喜巳午亥子 忌寅卯申酉 备注：无官独杀",
  ge_ju: [
    "食伤生财：       财格：      印格：      杀印相生：最佳     官杀：体弱夭疾   伤官配印："
  ],
  temp_scores: {
    temps_scores: 14,
    remark: "正为暖燥，负为寒湿，正常区间[-6,6]"
  },
  liunian_dayun: [
    {
      start_age: 8,
      gan_zhi: "丁卯",
      remark: "8        丁卯 死 炉中火    财:丁－合壬　　　　　卯－死 - 乙伤　　　　　　　　 会:寅  合:未  神:天德 桃花 天乙",
      liunian: [
        { age: 8, year: 1996, gan_zhi: "丙子", gan_zhi_2: "丙子", remark: "  8 1996 丙子 帝 涧下水    才:丙＋冲壬　　　　　子＋帝 - 癸劫　　　　　　　　 刑:卯  害:未  被刑:卯  --夹：丑  神:大耗 月德 阳刃 红艳" },
        { age: 9, year: 1997, gan_zhi: "丁丑", gan_zhi_2: "丁丑", remark: "  9 1997 丁丑 衰 涧下水    财:丁－合壬　　　　　丑－衰 - 己官　癸劫　辛印　　 被刑:未  合:巳  冲:未  暗:寅  --夹：寅  神:天德" },
        { age: 10, year: 1998, gan_zhi: "戊寅", gan_zhi_2: "戊寅", remark: " 10 1998 戊寅 病 城头土    杀:戊＋　　　　　　　寅＋病 - 甲食　丙才　戊杀　　 会:卯  害:巳  刑:巳  神:文昌" },
        { age: 11, year: 1999, gan_zhi: "己卯", gan_zhi_2: "己卯", remark: " 11 1999 己卯 死 城头土    官:己－　　　　　　　卯－死 - 乙伤　　　　　　　　 会:寅  合:未  --夹：辰  神:桃花 天乙" },
        { age: 12, year: 2000, gan_zhi: "庚辰", gan_zhi_2: "庚辰", remark: " 12 2000 庚辰 墓 白蜡金    枭:庚＋　　　　　 　空辰＋墓 - 戊杀　乙伤　癸劫　　 害:卯  会:寅  会:卯  神:寡宿" },
        { age: 13, year: 2001, gan_zhi: "辛巳", gan_zhi_2: "辛巳", remark: " 13 2001 辛巳 绝 白蜡金    印:辛－合丙　　　　　巳－绝 - 丙才　戊杀　庚枭　　 被刑:寅  害:寅  会:未  神: 亡神 天乙" },
        { age: 14, year: 2002, gan_zhi: "壬午", gan_zhi_2: "壬午", remark: " 14 2002 壬午 胎 杨柳木    比:壬＋合丁冲丙　　　午＋胎 - 丁财　己官　　　　　 合:寅  会:巳  六:未  会:未  神:将星" },
        { age: 15, year: 2003, gan_zhi: "癸未", gan_zhi_2: "癸未", remark: " 15 2003 癸未 养 杨柳木    劫:癸－冲丁　　　　　未－养 - 己官　丁财　乙伤　　 会:巳  合:卯" },
        { age: 16, year: 2004, gan_zhi: "甲申", gan_zhi_2: "甲申", remark: " 16 2004 甲申 长 井泉水    食:甲＋合己　　　　　申＋长 - 庚枭　壬比　戊杀　　 刑:寅  六:巳  暗:卯  冲:寅  被刑:巳  神:孤辰 驿马" },
        { age: 17, year: 2005, gan_zhi: "乙酉", gan_zhi_2: "乙酉", remark: " 17 2005 乙酉 沐 井泉水    伤:乙－　　　　　　　酉－沐 - 辛印　　　　　　　　 合:巳  冲:卯" },
      ]
    },
    {
      start_age: 18,
      gan_zhi: "戊辰",
      remark: "18       戊辰 墓 大林木    杀:戊＋　　　　　　空辰＋墓 - 戊杀　乙伤　癸劫　　 会:寅  神:寡宿",
      liunian: [
        { age: 18, year: 2006, gan_zhi: "丙戌", gan_zhi_2: "丙戌", remark: " 18 2006 丙戌 冠 屋上土    才:丙＋冲壬　　　　　戌＋冠 - 戊杀　辛印　丁财　　 合:寅  冲:辰  刑:未  --拱：午  神:大耗 月德 华盖" },
        { age: 19, year: 2007, gan_zhi: "丁亥", gan_zhi_2: "丁亥", remark: " 19 2007 丁亥 建 屋上土    财:丁－合壬　 　　　　亥－建 - 壬比　甲食　　　　　 合:未  六:寅  冲:巳  --拱：卯  神:天德 劫煞" },
        { age: 20, year: 2008, gan_zhi: "戊子", gan_zhi_2: "戊子", remark: " 20 2008 戊子 帝 霹雳火    杀:戊＋　　　　　　　子＋帝 - 癸劫　　　　　　　　 合:辰   害:未  神:大耗 阳刃 红艳" },
        { age: 21, year: 2009, gan_zhi: "己丑", gan_zhi_2: "己丑", remark: " 21 2009 己丑 衰 霹雳火    官:己－　　　　　　　丑－衰 - 己官　癸劫　辛印　　 被刑:未  合:巳  冲:未  暗:寅  --拱：酉" },
        { age: 22, year: 2010, gan_zhi: "庚寅", gan_zhi_2: "庚寅", remark: " 22 2010 庚寅 病 松柏木    枭:庚＋　　　　　　　寅＋病 - 甲食　丙才　戊杀　　 会:辰  害:巳  刑:巳  神:文昌" },
        { age: 23, year: 2011, gan_zhi: "辛卯", gan_zhi_2: "辛卯", remark: " 23 2011 辛卯 死 松柏木    印:辛－合丙　　　　　卯－死 - 乙伤　　　　　　　　 会:寅  合:未  害:辰  会:辰  神:桃花 天乙" },
        { age: 24, year: 2012, gan_zhi: "壬辰", gan_zhi_2: "壬辰", remark: " 24 2012 壬辰 墓 长流水    比:壬＋合丁冲丙　　空辰＋墓 - 戊杀　乙伤　癸劫　　 被刑:辰  会:寅  刑:辰  --夹：卯  神:寡宿" },
        { age: 25, year: 2013, gan_zhi: "癸巳", gan_zhi_2: "癸巳", remark: " 25 2013 癸巳 绝 长流水    劫:癸－合戊冲丁　　　巳－绝 - 丙才　戊杀　庚枭　　 被刑:寅  害:寅  会:未  神: 亡神 天乙" },
        { age: 26, year: 2014, gan_zhi: "甲午", gan_zhi_2: "甲午", remark: " 26 2014 甲午 胎 砂中金    食:甲＋合己　　　　　午＋胎 - 丁财　己官　　　　　 合:寅  会:巳  六:未  会:未  神:将星" },
        { age: 27, year: 2015, gan_zhi: "乙未", gan_zhi_2: "乙未", remark: " 27 2015 乙未 养 砂中金    伤:乙－　　　　　　　未－养 - 己官　丁财　乙伤　　 会:巳" },
      ]
    },
    // Add more DaYun periods here...
  ]
};

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
  
  const [selectedDaYun, setSelectedDaYun] = useState<DaYun>(mockResult.liunian_dayun[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInput(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setUserInput(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    // For now, we'll just move to the next step
    setStep(2)
  }

  const scrollToSelected = (index: number) => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const scrollLeft = (scrollWidth - clientWidth) * (index / (mockResult.liunian_dayun.length - 1));
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
              <div><span className="font-medium">公历日期：</span>{mockResult.solar_date}</div>
              <div><span className="font-medium">农历日期：</span>{mockResult.lunar_date}</div>
              <div><span className="font-medium">性别：</span>{mockResult.gender}</div>
              <div><span className="font-medium">历法：</span>{mockResult.is_solar}</div>
              <div><span className="font-medium">是否闰月：</span>{mockResult.is_run_yuer}</div>
            </div>
          </section>

          {/* 八字 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">八字</h2>
            <div className="grid grid-cols-4 gap-4 text-center">
              {Object.entries(mockResult.bazi).map(([key, value]) => (
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
              {Object.entries(mockResult.wuxing_scores).map(([element, score]) => (
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
              {Object.entries(mockResult.gan_scores).map(([gan, score]) => (
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
              <div><span className="font-medium">强度：</span>{mockResult.strong_weak_score.strong}</div>
              <div><span className="font-medium">是否弱：</span>{mockResult.strong_weak_score.weak ? '是' : '否'}</div>
              <div><span className="font-medium">备注：</span>{mockResult.strong_weak_score.remark}</div>
            </div>
          </section>

          {/* 大运 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">大运</h2>
            <div className="grid grid-cols-6 gap-2 text-center">
              {mockResult.da_yun.map((dayun, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded">
                  {dayun}
                </div>
              ))}
            </div>
          </section>

          {/* 其他信息 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">其他信息</h2>
            <div><span className="font-medium">调候：</span>{mockResult.tiao_hou}</div>
            <div><span className="font-medium">金不换：</span>{mockResult.jin_bu_huan}</div>
            <div><span className="font-medium">格局：</span>{mockResult.ge_ju.join(', ')}</div>
          </section>

          {/* 温度得分 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">温度得分</h2>
            <div>
              <div><span className="font-medium">得分：</span>{mockResult.temp_scores.temps_scores}</div>
              <div><span className="font-medium">备注：</span>{mockResult.temp_scores.remark}</div>
            </div>
          </section>

          {/* 大运流年图 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">大运流年图</h2>
            
            {/* 大运选择器 */}
            <div className="relative mb-6">
              <div ref={scrollRef} className="flex overflow-x-auto pb-2 hide-scrollbar">
                {mockResult.liunian_dayun.map((daYun, index) => (
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
                    <div>{mockResult.birth_year + daYun.start_age - 1}</div>
                    <div className="text-sm">{daYun.start_age}岁</div>
                    <div className="font-bold">{daYun.gan_zhi}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 选中的大运详情 */}
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

            {/* 流年详情 */}
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

            {/* 导航按钮 */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  const index = mockResult.liunian_dayun.findIndex(d => d.start_age === selectedDaYun.start_age);
                  if (index > 0) {
                    setSelectedDaYun(mockResult.liunian_dayun[index - 1]);
                    scrollToSelected(index - 1);
                  }
                }}
                className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={selectedDaYun.start_age === mockResult.liunian_dayun[0].start_age}
              >
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                上一大运
              </button>
              <button
                onClick={() => {
                  const index = mockResult.liunian_dayun.findIndex(d => d.start_age === selectedDaYun.start_age);
                  if (index < mockResult.liunian_dayun.length - 1) {
                    setSelectedDaYun(mockResult.liunian_dayun[index + 1]);
                    scrollToSelected(index + 1);
                  }
                }}
                className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={selectedDaYun.start_age === mockResult.liunian_dayun[mockResult.liunian_dayun.length - 1].start_age}
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