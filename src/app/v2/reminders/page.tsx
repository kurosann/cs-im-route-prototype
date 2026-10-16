"use client";

import { useState } from "react";
import { BellRing, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { V2Shell } from "@/components/workspace/v2-shell";
import { cn } from "@/lib/utils";

type Reminder = {
  id: string;
  title: string;
  detail: string;
  level: "高" | "中" | "低";
  time: string;
  done: boolean;
};

const initialReminders: Reminder[] = [
  { id: "1", title: "会话 12 分钟未响应", detail: "客户：李然 · WhatsApp · 意图：退款", level: "高", time: "刚刚", done: false },
  { id: "2", title: "AI 连续 2 次回答失败", detail: "员工：售后专员 · 已自动转人工", level: "中", time: "2 分钟前", done: false },
  { id: "3", title: "WhatsApp 凭证失效", detail: "业务渠道离线，3 个账号停止接待", level: "高", time: "5 分钟前", done: false },
  { id: "4", title: "消息投递失败", detail: "Telegram · 第 2 次重试", level: "中", time: "8 分钟前", done: false },
  { id: "5", title: "客服切换为在线", detail: "Lucía 已开始值班", level: "低", time: "12 分钟前", done: true },
];

const levelClass = {
  高: "bg-red-50 text-red-600 border-red-100",
  中: "bg-amber-50 text-amber-700 border-amber-100",
  低: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function V2RemindersPage() {
  const [reminders, setReminders] = useState(initialReminders);
  const [showDone, setShowDone] = useState(true);
  const waiting = reminders.filter((item) => !item.done).length;

  return (
    <V2Shell activeHref="/v2/reminders" title="基础提醒">
      <div className="space-y-5">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle>待处理提醒</CardTitle>
                <CardDescription>当前还有 {waiting} 条提醒未完成。</CardDescription>
              </div>
              <Button variant={showDone ? "outline" : "secondary"} onClick={() => setShowDone(!showDone)}>{showDone ? "隐藏已完成" : "显示已完成"}</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders
              .filter((item) => showDone || !item.done)
              .map((item) => (
                <div key={item.id} className={cn("flex flex-wrap items-center gap-4 rounded-3xl border bg-white p-4 transition-colors", item.done ? "border-slate-100 opacity-60" : "border-slate-200 hover:border-slate-300")}>
                  <div className={cn("flex size-11 items-center justify-center rounded-2xl border", levelClass[item.level])}>
                    <BellRing className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("text-sm font-medium", item.done && "line-through")}>{item.title}</span>
                      <Badge variant="outline" className={`rounded-full ${levelClass[item.level]}`}>{item.level}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{item.time}</span>
                    <Button size="sm" variant={item.done ? "ghost" : "outline"} onClick={() => setReminders((current) => current.map((entry) => entry.id === item.id ? { ...entry, done: !entry.done } : entry))}>
                      <Check className="size-4" />{item.done ? "恢复" : "完成"}
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "超时提醒", value: "普通 10 分钟 / 高风险 3 分钟" },
            { title: "失败提醒", value: "投递失败自动重试 3 次" },
            { title: "转人工提醒", value: "客户主动要求立即提醒" },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader><CardTitle className="text-base">{item.title}</CardTitle></CardHeader>
              <CardContent className="text-sm text-slate-600">{item.value}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </V2Shell>
  );
}
