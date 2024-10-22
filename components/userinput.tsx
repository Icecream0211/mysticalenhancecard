'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from 'next/navigation'

interface UserInput {
  year: string
  month: string
  day: string
  hour: string
  minute: string
  gender: string
  city: string
}

export function UserInputForm() {
  const router = useRouter()
  const [userInput, setUserInput] = useState<UserInput>({
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    gender: '',
    city: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInput(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setUserInput(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const queryString = new URLSearchParams(userInput).toString()
    router.push(`/bazi-analysis?${queryString}`)
  }

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
