"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryStat } from "@/lib/stats";

export function CategoryChart({ data }: { data: CategoryStat[] }) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>カテゴリ別達成率</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm text-muted-foreground">まだタスクがありません。</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>カテゴリ別達成率</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div style={{ width: "100%", height: Math.max(160, data.length * 44) }}>
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} unit="%" />
              <YAxis
                type="category"
                dataKey="name"
                width={84}
                tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                  backgroundColor: "hsl(var(--popover))",
                }}
                formatter={(value: number, _name, item) => [
                  `${value}% (${item.payload.completed}/${item.payload.total})`,
                  "達成率",
                ]}
              />
              <Bar dataKey="rate" radius={[0, 8, 8, 0]} barSize={16}>
                {data.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
