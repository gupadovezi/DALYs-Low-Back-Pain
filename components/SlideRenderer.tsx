
import React from 'react';
import { SlideContent } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface Props {
  slide: SlideContent;
}

const SlideRenderer: React.FC<Props> = ({ slide }) => {
  const renderChart = () => {
    if (!slide.chartData || slide.chartType === 'none') return null;

    return (
      <div className="h-64 w-full mt-6 bg-white/50 p-4 rounded-xl border border-slate-100">
        <ResponsiveContainer width="100%" height="100%">
          {slide.chartType === 'bar' ? (
            <BarChart data={slide.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              {slide.chartData[0]?.secondary && <Bar dataKey="secondary" fill="#10b981" radius={[4, 4, 0, 0]} />}
            </BarChart>
          ) : slide.chartType === 'line' ? (
            <LineChart data={slide.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          ) : (
            <PieChart>
              <Pie
                data={slide.chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {slide.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white p-8 md:p-12 shadow-2xl rounded-3xl border border-slate-200 overflow-hidden">
      <div className="flex-1">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-2">
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p className="text-xl text-blue-600 font-medium mb-8">{slide.subtitle}</p>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <ul className="space-y-4">
              {slide.bulletPoints.map((point, i) => (
                <li key={i} className="flex items-start text-lg text-slate-700 leading-relaxed">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mt-3 mr-4 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col justify-center">
            {renderChart()}
            {slide.imagePrompt && !slide.chartData && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <img 
                  src={`https://picsum.photos/seed/${slide.id}/800/600`} 
                  alt="Slide Visual"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {slide.footer && (
        <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-sm">
          <span>{slide.footer}</span>
          <span className="font-semibold text-blue-500">Public Health Insight</span>
        </div>
      )}
    </div>
  );
};

export default SlideRenderer;
