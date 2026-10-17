'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { type CheckboxCount } from '@/lib/data/analytics'

type AnalyticsGraphProps = {
  title: string
  data: CheckboxCount[]
}

export function AnalyticsGraph({
  title,
  data,
}: AnalyticsGraphProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">
        {title}
      </h2>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 10,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              type="number"
              allowDecimals={false}
            />

            <YAxis
              type="category"
              dataKey="value"
              width={140}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
                contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '4px 8px',
                }}
                labelStyle={{
                    color: '#1e3b5f',
                    fontWeight: 600,
                }}
                itemStyle={{
                    color: '#64748b',
                }}
            />

            <Bar
              dataKey="count"
              name="Responses"
              fill="#1e3b5f"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}