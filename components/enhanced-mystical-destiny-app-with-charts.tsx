'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { Star, Moon, Sun, Share2, TrendingUp, Activity, Compass, Zap } from 'lucide-react';
import html2canvas from 'html2canvas';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  ScatterChart, Scatter, ZAxis,
  BarChart, Bar, Cell,
  PieChart, Pie,
} from 'recharts';

import { Text, ReferenceLine } from 'recharts';
import { scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
// Simulated API call
const fetchDestinyAnalysis = async (birthInfo: { date: string; city: string; gender: string }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  // Simulated API response
  return {
    birthChart: `✨ 您的八字命盘：
      天干：甲乙丙丁
      地支：子丑寅卯
      五行：木多火少 📜`,
    tenYearFortune: `📈 大运解析：
      25-34岁：事业上升期 🌟
      35-44岁：感情稳定期 💖
      45-54岁：财运旺盛期 💰`,
    likeAndDislike: `⚖️ 喜忌格局：
      喜用神：金、水 🌊
      忌神：火、土 🔥
      平衡建议：多接触水属性事物 `,
    careerDevelopment: `💼 事业发展：
      优势：创新能力强，领导才能突出 🚀
      挑战：需要提高耐心和细节把控 🔺
      建议：多尝试管理岗位，发挥长处 📊`,
    loveAnalysis: `❤️ 感情解析：
      桃花运：时有起伏，整体良好 💫
      适合对象：性格温和，善解人意 🤝
      建议：保持开放心态，主动表达感受 🗨️`,
    fiveElements: [
      { element: '木', value: 8, description: '强旺，代表创造力与生机旺盛' },
      { element: '火', value: 6, description: '中等，象征热情与活力' },
      { element: '土', value: 4, description: '偏弱，需要稳定与踏实' },
      { element: '金', value: 7, description: '较强，体现决断力与坚毅' },
      { element: '水', value: 5, description: '平衡，代表智慧与适应能力' },
    ],
    threeYearsForecast: [
      { year: 2023, overall: 7, wealth: 6, health: 8, love: 7 },
      { year: 2024, overall: 8, wealth: 7, health: 7, love: 8 },
      { year: 2025, overall: 9, wealth: 8, health: 8, love: 9 },
    ],
    monthlyFortune: [
      { year: 2023, month: 1, score: 7 },
      { year: 2023, month: 2, score: 6 },
      { year: 2023, month: 3, score: 8 },
      { year: 2023, month: 4, score: 7 },
      { year: 2023, month: 5, score: 9 },
      { year: 2023, month: 6, score: 6 },
      { year: 2023, month: 7, score: 8 },
      { year: 2023, month: 8, score: 7 },
      { year: 2023, month: 9, score: 9 },
      { year: 2023, month: 10, score: 8 },
      { year: 2023, month: 11, score: 7 },
      { year: 2023, month: 12, score: 8 },
      { year: 2024, month: 1, score: 8 },
      { year: 2024, month: 2, score: 7 },
      { year: 2024, month: 3, score: 9 },
      { year: 2024, month: 4, score: 8 },
      { year: 2024, month: 5, score: 7 },
      { year: 2024, month: 6, score: 9 },
      { year: 2024, month: 7, score: 8 },
      { year: 2024, month: 8, score: 7 },
      { year: 2024, month: 9, score: 9 },
      { year: 2024, month: 10, score: 8 },
      { year: 2024, month: 11, score: 7 },
      { year: 2024, month: 12, score: 9 },
      { year: 2025, month: 1, score: 9 },
      { year: 2025, month: 2, score: 8 },
      { year: 2025, month: 3, score: 7 },
      { year: 2025, month: 4, score: 9 },
      { year: 2025, month: 5, score: 8 },
      { year: 2025, month: 6, score: 7 },
      { year: 2025, month: 7, score: 9 },
      { year: 2025, month: 8, score: 8 },
      { year: 2025, month: 9, score: 7 },
      { year: 2025, month: 10, score: 9 },
      { year: 2025, month: 11, score: 8 },
      { year: 2025, month: 12, score: 8 },
    ],
    luckyUnluckyElements: [
      { name: '木', value: 30, type: 'lucky' },
      { name: '火', value: 20, type: 'lucky' },
      { name: '土', value: 15, type: 'unlucky' },
      { name: '金', value: 25, type: 'lucky' },
      { name: '水', value: 10, type: 'unlucky' },
    ],
    directionColors: [
      { direction: '东', color: '绿色', meaning: '代表生机与成长，有助于新项目启动', value: 1 },
      { direction: '南', color: '红色', meaning: '象征热情与活力，利于人际交往', value: 1 },
      { direction: '西', color: '白色', meaning: '代表纯洁与正义，有助于学习与考试', value: 1 },
      { direction: '北', color: '黑色', meaning: '象征智慧与神秘，有利于思考与规划', value: 1 },
      { direction: '中', color: '黄色', meaning: '代表稳定与平衡，有助于调和各方面运势', value: 1 },
    ],
  };
};

type AnalysisCardProps = {
  title: string;
  content: string;
  emoji: string;
  style: React.CSSProperties;
};

type ChartProps = {
  data: any; // 理想情况下，应该为每种图表定义更具体的类型
};

type ChartSectionProps = {
  title: string;
  children: React.ReactNode;
};

// 修改 AnalysisCard 组件的定义
const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, content, emoji, style }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  const cardAnimation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(50px)',
    config: config.wobbly,
  });

  const borderAnimation = useSpring({
    boxShadow: isVisible ? '0 4px 20px rgba(0, 0, 0, 0.1)' : '0 0 0px rgba(0, 0, 0, 0)',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <animated.div ref={cardRef} style={{
      ...cardAnimation,
      ...borderAnimation,
      ...style,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '25px',
      opacity: 0.9,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '60%',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        zIndex: 0,
      }} />
      <h3 style={{
        fontSize: '24px',
        marginBottom: '15px',
        fontFamily: 'Georgia, Times New Roman, serif',
        fontWeight: 700,
        color: 'rgba(58, 58, 58, 0.9)',
        textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 1,
        WebkitTextStroke: '1px #222222',
      }}>
        <span style={{ marginRight: '10px' }}>{emoji}</span>
        {title}
      </h3>
      <p style={{
        whiteSpace: 'pre-wrap',
        lineHeight: '1.6',
        fontFamily: 'Arial, Helvetica, sans-serif',
        textIndent: '1em',
        fontSize: '18px',
        fontWeight: 400,
        color: '#222222',
        position: 'relative',
        zIndex: 1,
      }}>
        {content}
      </p>
    </animated.div>
  );
};

type LuckyUnluckyElement = {
  name: string;
  value: number;
  type: 'lucky' | 'unlucky';
};

type DirectionColor = {
  direction: '东' | '南' | '西' | '北' | '中';
  color: string;
  meaning: string;
  value: number;
};

const NavTab: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      fontSize: '18px',
      padding: '10px 20px',
      backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
      color: active ? '#ffffff' : '#cccccc',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }}
  >
    {label}
  </button>
);

const ChartCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  const cardAnimation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(50px)',
    config: config.wobbly,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <animated.div ref={cardRef} style={{
      ...cardAnimation,
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '20px',
      margin: '20px auto',
      width: '90%',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        {icon}
        <h3 style={{
          fontSize: '24px',
          marginLeft: '10px',
          color: '#ffffff',
          textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
        }}>
          {title}
        </h3>
      </div>
      {children}
    </animated.div>
  );
};

const FiveElementsRadarChart: React.FC<ChartProps> = ({ data }) => {
  const COLORS = {
    木: '#4CAF50',
    火: '#FF5722',
    土: '#FFC107',
    金: '#9E9E9E',
    水: '#2196F3',
  };

  return (
    <RadarChart width={300} height={300} data={data} style={{ margin: 'auto' }}>
      <PolarGrid stroke="rgba(255, 255, 255, 0.3)" />
      <PolarAngleAxis dataKey="element" tick={{ fill: '#ffffff' }} />
      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#ffffff' }} />
      <Radar name="五行强度" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      <Tooltip
        contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }}
        labelStyle={{ color: '#ffffff' }}
        itemStyle={{ color: '#ffffff' }}
      />
    </RadarChart>
  );
};

const ThreeYearsForecastChart: React.FC<ChartProps> = ({ data }) => {
  const COLORS = {
    overall: '#2196F3',
    wealth: '#4CAF50',
    health: '#FF5722',
    love: '#E91E63',
  };

  return (
    <div>
      <LineChart width={500} height={300} data={data} style={{ margin: 'auto' }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis dataKey="year" stroke="#ffffff" label={{ value: '年份', position: 'insideBottomRight', offset: -10, fill: '#ffffff' }} />
        <YAxis domain={[0, 10]} stroke="#ffffff" label={{ value: '运势评分', angle: -90, position: 'insideLeft', fill: '#ffffff' }} />
        <Tooltip
          contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }}
          labelStyle={{ color: '#ffffff' }}
          itemStyle={{ color: '#ffffff' }}
        />
        <Legend />
        {Object.entries(COLORS).map(([key, color]) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
      <p style={{ textAlign: 'center', marginTop: '10px' }}>此图展示了未来三年在不同方面的运势变化趋势。</p>
    </div>
  );
};

const FortuneHeatMap: React.FC<ChartProps> = ({ data }) => {
  const years = Array.from(new Set(data.map((item: any) => item.year)));
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const formattedData = years.flatMap(year =>
    months.map(month => {
      const matchingData = data.find((item: any) => item.year === year && item.month === month);
      return { year, month, score: matchingData ? matchingData.score : 0 };
    })
  );

  const colorScale = scaleSequential(interpolateBlues).domain([0, 10]);

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>未来三年每月运势强弱变化趋势</h3>
      <ScatterChart width={500} height={300} margin={{ top: 20, right: 20, bottom: 20, left: 20 }} style={{ margin: 'auto' }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis type="number" dataKey="month" name="月份" unit="月" stroke="#ffffff" />
        <YAxis type="number" dataKey="year" name="年份" unit="年" stroke="#ffffff" />
        <ZAxis type="number" dataKey="score" range={[0, 500]} name="运势评分" unit="分" />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }}
          labelStyle={{ color: '#ffffff' }}
          itemStyle={{ color: '#ffffff' }}
          formatter={(value: any, name: string) => [value, name === 'score' ? '运势评分' : name]}
        />
        <Scatter
          name="运势热力图"
          data={formattedData}
          fill="#8884d8"
          shape="rect"
        >
          {formattedData.map((entry: any, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={colorScale(entry.score)}
            />
          ))}
        </Scatter>
      </ScatterChart>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <span>运势强弱：</span>
        <span style={{ background: 'linear-gradient(to right, #f7fbff, #08306b)', width: '100px', height: '20px', marginLeft: '10px' }}></span>
        <span style={{ marginLeft: '10px' }}>弱 → 强</span>
      </div>
    </div>
  );
};

const LuckyUnluckyElementsChart: React.FC<ChartProps> = ({ data }) => {
  const COLORS = {
    lucky: '#4CAF50',
    unlucky: '#FF5722',
  };

  const ICONS = {
    木: '🌳',
    火: '🔥',
    土: '🏔️',
    金: '🏅',
    水: '💧',
  };

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>喜用神与忌用神在五行中的数量分布</h3>
      <BarChart width={500} height={300} data={data} style={{ margin: 'auto' }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis dataKey="name" stroke="#ffffff" label={{ value: '五行元素', position: 'insideBottomRight', offset: -10, fill: '#ffffff' }} />
        <YAxis stroke="#ffffff" label={{ value: '数量/强度', angle: -90, position: 'insideLeft', fill: '#ffffff' }} />
        <Tooltip
          contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }}
          labelStyle={{ color: '#ffffff' }}
          itemStyle={{ color: '#ffffff' }}
        />
        <Legend />
        <Bar dataKey="value" fill="#8884d8">
          {(data as LuckyUnluckyElement[]).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.type]} />
          ))}
        </Bar>
        <ReferenceLine y={0} stroke="#ffffff" />
        {data.map((entry, index) => (
          <Text
            key={`label-${index}`}
            x={index * (500 / data.length) + (500 / data.length) / 2}
            y={300}
            textAnchor="middle"
            verticalAnchor="start"
            fill="#ffffff"
          >
            {ICONS[entry.name as keyof typeof ICONS]}
          </Text>
        ))}
      </BarChart>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <span style={{ color: COLORS.lucky, marginRight: '10px' }}>■ 喜用神</span>
        <span style={{ color: COLORS.unlucky }}>■ 忌用神</span>
      </div>
    </div>
  );
};

const DirectionColorPairingChart: React.FC<ChartProps> = ({ data }) => {
  const COLORS: Record<DirectionColor['direction'], string> = {
    东: '#4CAF50',
    南: '#FF5722',
    西: '#FFFFFF',
    北: '#000000',
    中: '#FFC107',
  };

  return (
    <PieChart width={400} height={400} style={{ margin: 'auto' }}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {(data as DirectionColor[]).map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[entry.direction]} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }}
        labelStyle={{ color: '#ffffff' }}
        itemStyle={{ color: '#ffffff' }}
      />
    </PieChart>
  );
};

const ChartSection: React.FC<ChartSectionProps> = ({ title, children }) => (
  <div style={{ marginBottom: '30px' }}>
    <h2 style={{
      fontSize: '28px',
      marginBottom: '15px',
      fontFamily: 'Georgia, Times New Roman, serif',
      fontWeight: 700,
      color: '#ffffff',
      textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
    }}>
      {title}
    </h2>
    {children}
  </div>
);

export function EnhancedMysticalDestinyAppWithCharts() {
  const [birthInfo, setBirthInfo] = useState({ date: '', city: '', gender: 'female' });
  const [analysis, setAnalysis] = useState<any>(null); // 使用 any 类型，或者定义一个更具体的类型
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const resultsRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const result = await fetchDestinyAnalysis(birthInfo);
      setAnalysis(result);
    } catch (err) {
      setError('解析失败，请检查输入内容并重试');
    } finally {
      setIsLoading(false);
    }
  };

  const buttonAnimation = useSpring({
    from: { scale: 1 },
    to: async (next) => {
      while (true) {
        await next({ scale: 1.05 });
        await next({ scale: 1 });
      }
    },
    config: { duration: 1000 },
  });

  const handleShare = useCallback(() => {
    if (resultsRef.current) {
      html2canvas(resultsRef.current).then((canvas) => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = 'mystical-destiny-analysis.png';
        link.click();
      });
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a2a',
      color: '#ffffff',
      fontFamily: 'Arial, Helvetica, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <h1 style={{
        fontFamily: 'Georgia, Times New Roman, serif',
        fontSize: '2.5rem',
        marginBottom: '2rem',
        textShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff',
        textAlign: 'center',
        color: '#ffffff',
        WebkitTextStroke: '1px #222222',
      }}>
        Mystical Destiny Revealer
      </h1>
      <form onSubmit={handleSubmit} style={{ width: '90%', maxWidth: '600px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="date" style={{ display: 'block', marginBottom: '0.5rem', color: '#ffffff' }}>Birth Date & Time:</label>
          <input
            type="datetime-local"
            id="date"
            value={birthInfo.date}
            onChange={(e) => setBirthInfo({ ...birthInfo, date: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid #4a0e4a',
              borderRadius: '4px',
              color: '#ffffff'
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="city" style={{ display: 'block', marginBottom: '0.5rem', color: '#ffffff' }}>Birth City:</label>
          <input
            type="text"
            id="city"
            value={birthInfo.city}
            onChange={(e) => setBirthInfo({ ...birthInfo, city: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid #4a0e4a',
              borderRadius: '4px',
              color: '#ffffff'
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="gender" style={{ display: 'block', marginBottom: '0.5rem', color: '#ffffff' }}>Gender:</label>
          <select
            id="gender"
            value={birthInfo.gender}
            onChange={(e) => setBirthInfo({ ...birthInfo, gender: e.target.value })}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid #4a0e4a',
              borderRadius: '4px',
              color: '#ffffff'
            }}
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
        <animated.button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#4a0e4a',
            border: 'none',
            borderRadius: '4px',
            color: '#ffffff',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            ...buttonAnimation
          }}
          disabled={isLoading}
        >
          {isLoading ? '命运正在揭晓，请稍候……' : '揭开命运的面纱'}
        </animated.button>
      </form>
      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          border: '1px solid #ff0000',
          borderRadius: '4px',
          color: '#ff0000',
          width: '90%',
          maxWidth: '600px',
        }}>
          {error}
        </div>
      )}
      {analysis && (
        <div ref={resultsRef} style={{ marginTop: '2rem', width: '100%', maxWidth: '800px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', width: '90%', margin: '0 auto' }}>
            <NavTab label="命盘概览" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <NavTab label="运势预测" active={activeTab === 'forecast'} onClick={() => setActiveTab('forecast')} />
            <NavTab label="五行分析" active={activeTab === 'fiveElements'} onClick={() => setActiveTab('fiveElements')} />
            <NavTab label="喜用神分布" active={activeTab === 'luckyElements'} onClick={() => setActiveTab('luckyElements')} />
          </div>
          {activeTab === 'overview' && (
            <>
              <ChartCard title="命盘分析" icon={<Compass size={24} />}>
                <AnalysisCard
                  title="命盘分析"
                  content={analysis.birthChart}
                  emoji="✨"
                  style={{ background: 'linear-gradient(135deg, #E6D9B8, #D4AF37)' }}
                />
              </ChartCard>
              <ChartCard title="���运解析" icon={<TrendingUp size={24} />}>
                <AnalysisCard
                  title="大运解析"
                  content={analysis.tenYearFortune}
                  emoji="📈"
                  style={{ background: 'linear-gradient(135deg, #C9E7F2, #87CEEB)' }}
                />
              </ChartCard>
              <ChartCard title="喜忌格局" icon={<Activity size={24} />}>
                <AnalysisCard
                  title="喜忌格局"
                  content={analysis.likeAndDislike}
                  emoji="⚖️"
                  style={{ background: 'linear-gradient(135deg, #E0D7F6, #B19CD9)' }}
                />
              </ChartCard>
            </>
          )}
          {activeTab === 'forecast' && (
            <>
              <ChartCard title="未来三年运势预测" icon={<TrendingUp size={24} />}>
                <ThreeYearsForecastChart data={analysis.threeYearsForecast} />
                <p style={{ textAlign: 'center', marginTop: '10px' }}>此图展示了未来三年在不同方面的运势变化趋势。</p>
              </ChartCard>
              <ChartCard title="运势热力图" icon={<Activity size={24} />}>
                <FortuneHeatMap data={analysis.monthlyFortune} />
                <p style={{ textAlign: 'center', marginTop: '10px' }}>此热力图展示了未来三年每月的运势强弱变化。</p>
              </ChartCard>
            </>
          )}
          {activeTab === 'fiveElements' && (
            <>
              <ChartCard title="五行平衡雷达图" icon={<Compass size={24} />}>
                <FiveElementsRadarChart data={analysis.fiveElements} />
                <p style={{ textAlign: 'center', marginTop: '10px' }}>此雷达图展示了您八字中五行元素的强弱平衡情况。</p>
              </ChartCard>
              <ChartCard title="方位与颜色配对图" icon={<Compass size={24} />}>
                <DirectionColorPairingChart data={analysis.directionColors} />
                <p style={{ textAlign: 'center', marginTop: '10px' }}>此饼图展示了不同方位及其对应的幸运颜色。</p>
              </ChartCard>
            </>
          )}
          {activeTab === 'luckyElements' && (
            <ChartCard title="喜用神与忌用神分布图" icon={<Zap size={24} />}>
              <LuckyUnluckyElementsChart data={analysis.luckyUnluckyElements} />
              <p style={{ textAlign: 'center', marginTop: '10px' }}>此柱状图展示了对您有利和不利的五行元素分布。</p>
            </ChartCard>
          )}
          <animated.button
            onClick={handleShare}
            style={{
              width: '90%',
              padding: '0.75rem',
              backgroundColor: '#4a0e4a',
              border: 'none',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              marginTop: '1rem',
              background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
              ...buttonAnimation
            }}
            title="点击下载当前内容为图片格式，或右键选择图片另存为"
          >
            <Share2 style={{ marginRight: '0.5rem' }} />
            📤 分享给好友 / ⬇️ 下载图片
          </animated.button>
        </div>
      )}
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <Star style={{ color: '#ffff00', marginRight: '10px' }} />
        <Moon style={{ color: '#c0c0c0', marginRight: '10px' }} />
        <Sun style={{ color: '#ffa500' }} />
      </div>
    </div>
  );
}