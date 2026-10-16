import Link from "next/link";
import { Bot, MessageSquare, NotebookPen, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { V2Shell } from "@/components/workspace/v2-shell";

const metrics = [
  { label: "AI 自动接待", value: "1,286", hint: "今日 · 占比 68%", icon: Bot },
  { label: "人工辅助采纳", value: "312", hint: "建议回复采纳率 74%", icon: Sparkles },
  { label: "自动翻译", value: "568", hint: "覆盖 9 个语种", icon: MessageSquare },
  { label: "知识命中", value: "82%", hint: "近 7 天平均命中率", icon: NotebookPen },
];

const scenarios = [
  { href: "/v2/employee", title: "配置 AI 客服员工", description: "基础模式快速上线，专业模式接知识库和工具。", action: "去配置" },
  { href: "/v2/knowledge", title: "维护知识库", description: "维护 FAQ、政策和多语言答案。", action: "去维护" },
  { href: "/v2/reminders", title: "处理基础提醒", description: "超时、失败和转人工提醒集中处理。", action: "查看提醒" },
];

export default function V2OverviewPage() {
  return (
    <V2Shell activeHref="/v2" title="V2 总览">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)] lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <Badge className="rounded-full bg-slate-950 text-white">V2 智能工作台</Badge>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight lg:text-3xl">让人工更省力，让 AI 接得住重复问题</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                V2 把 AI 客服员工当成一个可分配的“员工”。你可以先选账号、写人设、开自动回复；
                也可以在专业模式里挂知识库、工具和更细的转人工规则。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/v2/employee" className={buttonVariants()}>配置 AI 员工</Link>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-sm text-white/70">当前运行</p>
              <div className="mt-4 space-y-4">
                {[
                  { name: "售前助手", value: "负责 4 个 WhatsApp 账号" },
                  { name: "售后专员", value: "命中退款政策 38 次" },
                  { name: "海外客服", value: "已暂停 · 等待审核" },
                ].map((item) => (
                  <div key={item.name} className="rounded-2xl bg-white/10 p-4">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="mt-1 text-xs text-white/70">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="border-slate-200/70 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.45)]">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Icon className="size-4" /></div>
                  </div>
                  <div className="mt-4 text-3xl font-semibold tracking-tight">{item.value}</div>
                  <div className="mt-1 text-xs text-slate-500">{item.hint}</div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {scenarios.map((item) => (
            <Card key={item.href} className="border-slate-200/70 transition-shadow hover:shadow-[0_20px_55px_-42px_rgba(15,23,42,0.5)]">
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{item.href}</span>
                <Link href={item.href} className={buttonVariants({ size: "sm", variant: "outline" })}>{item.action}</Link>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </V2Shell>
  );
}
