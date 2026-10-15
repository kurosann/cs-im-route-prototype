"use client";

import Link from "next/link";
import { AppWindow, ArrowRightLeft, Bell, ChevronDown, FileText, Inbox, LayoutDashboard, MessageSquare, Paperclip, Search, Send, Settings, Sparkles, Webhook, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { initialConversations, pageTitles, rolePages, type Conversation, type PageId, type Role } from "./mock-data";

const navItems: { id: PageId; label: string; group: "work" | "config" | "system" }[] = [
  { id: "overview", label: "总览", group: "work" },
  { id: "conversations", label: "会话", group: "work" },
  { id: "chat", label: "聊天室", group: "work" },
  { id: "apps", label: "业务渠道", group: "config" },
  { id: "channels", label: "转发渠道", group: "config" },
  { id: "ai", label: "AI 客服", group: "config" },
  { id: "webhook", label: "Webhook", group: "config" },
  { id: "logs", label: "消息日志", group: "config" },
  { id: "settings", label: "设置", group: "system" },
];

const statusMap = {
  waiting: { label: "待人工", className: "bg-red-50 text-red-600" },
  ai: { label: "AI 已处理", className: "bg-emerald-50 text-emerald-600" },
  agent: { label: "人工处理中", className: "bg-blue-50 text-blue-600" },
};

const navIcons: Record<PageId, typeof LayoutDashboard> = {
  overview: LayoutDashboard,
  conversations: Inbox,
  chat: MessageSquare,
  apps: AppWindow,
  channels: ArrowRightLeft,
  ai: Sparkles,
  webhook: Webhook,
  logs: FileText,
  settings: Settings,
};

export function WorkspaceShell({ initialPage = "overview", initialRole = "agent" }: { initialPage?: PageId; initialRole?: Role }) {
  const role = initialRole;
  const [activePage, setActivePage] = useState<PageId>(initialPage);
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState(initialConversations[0].id);
  const [draft, setDraft] = useState("");

  const allowedPages = rolePages[role];
  const visibleNav = navItems.filter((item) => allowedPages.includes(item.id));
  const activeConversation = conversations.find((item) => item.id === activeConversationId) ?? conversations[0];

  const metrics = useMemo(
    () => ({
      waiting: conversations.filter((item) => item.status === "waiting").length,
      ai: conversations.filter((item) => item.status === "ai").length,
      agent: conversations.filter((item) => item.status === "agent").length,
    }),
    [conversations]
  );

  function selectConversation(id: string) {
    setActiveConversationId(id);
    setActivePage("chat");
  }

  function sendMessage() {
    if (!draft.trim()) return;
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              status: "agent",
              owner: "张晓",
              lastMessage: draft,
              time,
              messages: [
                ...conversation.messages,
                { id: `m${conversation.messages.length + 1}`, role: "agent", text: draft, time },
              ],
            }
          : conversation
      )
    );
    setDraft("");
  }

  return (
    <div className="flex h-screen bg-slate-50 text-foreground">
      <aside className="hidden w-72 shrink-0 border-r bg-background lg:flex lg:flex-col">
        <div className="flex h-16 items-center justify-between gap-3 border-b px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">◎</div>
            <div>
              <div className="text-sm font-semibold">聚合客服</div>
              <div className="text-xs text-muted-foreground">统一工作台</div>
            </div>
          </div>
          <button className="flex items-center gap-1.5 rounded-full border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted" title="切换租户">
            <span className="max-w-20 truncate font-medium">橙子科技</span>
            <ChevronDown className="size-3" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">客服工作</p>
          {visibleNav.filter((item) => item.group === "work").map((item) => (
            <button key={item.id} onClick={() => setActivePage(item.id)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors", activePage === item.id ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>{(() => { const Icon = navIcons[item.id]; return <Icon className="size-4" />; })()}{item.label}</button>
          ))}
          <p className="px-3 pb-2 pt-5 text-[11px] font-medium uppercase tracking-wider text-slate-400">接入配置</p>
          {visibleNav.filter((item) => item.group === "config").map((item) => (
            <button key={item.id} onClick={() => setActivePage(item.id)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors", activePage === item.id ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>{(() => { const Icon = navIcons[item.id]; return <Icon className="size-4" />; })()}{item.label}</button>
          ))}
          <p className="px-3 pb-2 pt-5 text-[11px] font-medium uppercase tracking-wider text-slate-400">系统</p>
          {visibleNav.filter((item) => item.group === "system").map((item) => (
            <button key={item.id} onClick={() => setActivePage(item.id)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors", activePage === item.id ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>{(() => { const Icon = navIcons[item.id]; return <Icon className="size-4" />; })()}{item.label}</button>
          ))}
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background/85 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold">{pageTitles[activePage]}</h1>
            <Badge variant="outline" className="hidden rounded-full border-amber-200 bg-amber-50 text-[11px] font-medium text-amber-700 sm:inline-flex">仅为原型 · 非实际效果图 · v1</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden w-72 items-center gap-2 rounded-xl border bg-background px-3 md:flex"><Search className="size-4 text-muted-foreground" /><input className="h-8 w-full bg-transparent text-sm outline-none" placeholder="搜索会话 / 客户 / 消息 ID" /></div>
            <button className="relative flex size-9 items-center justify-center rounded-xl border bg-background text-muted-foreground"><Bell className="size-4" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-red-500" /></button>
            <div className="hidden items-center gap-2 rounded-xl border bg-background px-2 py-1.5 md:flex"><div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-medium text-primary-foreground">张</div><span className="text-xs font-medium">张晓</span></div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1600px] flex-1 overflow-y-auto p-5 lg:p-8">
          {activePage === "overview" && (
            <section className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "待人工", value: metrics.waiting, hint: "5 条超过 3 分钟未响应", icon: Inbox, tone: "bg-red-50 text-red-600" },
                  { label: "今日消息", value: "12,470", hint: "较昨日 +8.2%", icon: MessageSquare, tone: "bg-blue-50 text-blue-600" },
                  { label: "AI 已处理", value: metrics.ai, hint: "占比 71.7%", icon: Sparkles, tone: "bg-sky-50 text-sky-600" },
                  { label: "投递失败", value: "7", hint: "3 条等待重试", icon: Zap, tone: "bg-amber-50 text-amber-600" },
                ].map((metric) => (
                  <Card key={metric.label} className="border-slate-200/70 shadow-[0_10px_35px_-30px_rgba(15,23,42,0.35)]">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                        <div className={cn("flex size-9 items-center justify-center rounded-xl", metric.tone)}>{(() => { const Icon = metric.icon; return <Icon className="size-4" />; })()}</div>
                      </div>
                      <div className="mt-3 text-3xl font-semibold tracking-tight">{metric.value}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{metric.hint}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader className="pb-4"><CardTitle>待处理会话</CardTitle><CardDescription>按最近消息排序，点击后直接进入聊天室。</CardDescription></CardHeader>
                <CardContent className="space-y-3">
                  {conversations.slice(0, 3).map((conversation) => (
                    <button key={conversation.id} onClick={() => selectConversation(conversation.id)} className="flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors hover:border-primary/30 hover:bg-muted/40">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-medium">{conversation.customer.slice(0, 1)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2"><span className="font-medium">{conversation.customer}</span><span className={cn("rounded-full px-2 py-0.5 text-[11px]", statusMap[conversation.status].className)}>{statusMap[conversation.status].label}</span></div>
                        <p className="mt-1 truncate text-sm text-muted-foreground">{conversation.app} · {conversation.lastMessage}</p>
                      </div>
                      <span className="hidden text-xs text-muted-foreground sm:block">{conversation.time}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </section>
          )}

          {activePage === "conversations" && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow><TableHead>客户</TableHead><TableHead>业务渠道</TableHead><TableHead>最近消息</TableHead><TableHead>状态</TableHead><TableHead>负责人</TableHead><TableHead /></TableRow></TableHeader>
                  <TableBody>
                    {conversations.map((conversation) => (
                      <TableRow key={conversation.id}>
                        <TableCell><div className="font-medium">{conversation.customer}</div><div className="text-xs text-muted-foreground">{conversation.customerId}</div></TableCell>
                        <TableCell>{conversation.app}</TableCell>
                        <TableCell className="max-w-64 truncate">{conversation.lastMessage}</TableCell>
                        <TableCell><Badge className={cn("border-transparent", statusMap[conversation.status].className)}>{statusMap[conversation.status].label}</Badge></TableCell>
                        <TableCell>{conversation.owner}</TableCell>
                        <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => selectConversation(conversation.id)}>查看</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {(activePage === "chat" || activePage === "conversations") && activePage === "chat" && (
            <div className="grid h-[calc(100vh-11rem)] overflow-hidden rounded-2xl border bg-background shadow-[0_20px_70px_-50px_rgba(15,23,42,0.5)] lg:grid-cols-[330px_1fr_360px]">
              <div className="hidden border-r lg:block">
                <div className="flex h-14 items-center justify-between border-b px-4"><span className="font-medium">会话</span><Button variant="outline" size="sm">筛选</Button></div>
                <ScrollArea className="h-[calc(100%-3.5rem)]">
                  <div className="divide-y">
                    {conversations.map((conversation) => (
                      <button key={conversation.id} onClick={() => setActiveConversationId(conversation.id)} className={cn("w-full border-b px-4 py-4 text-left transition-colors", activeConversation.id === conversation.id ? "bg-primary/5" : "hover:bg-muted/40")}>
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-medium">{conversation.customer.slice(0, 1)}</div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between"><span className="truncate text-sm font-medium">{conversation.customer}</span><span className="ml-2 shrink-0 text-[11px] text-muted-foreground">{conversation.time}</span></div>
                            <p className="mt-1 truncate text-xs text-muted-foreground">{conversation.lastMessage}</p>
                            <span className={cn("mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px]", statusMap[conversation.status].className)}>{statusMap[conversation.status].label}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex min-w-0 flex-col">
                <div className="flex h-16 shrink-0 items-center justify-between border-b px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-medium">{activeConversation.customer.slice(0, 1)}</div>
                    <div><div className="text-sm font-medium">{activeConversation.customer}</div><div className="text-xs text-muted-foreground">{activeConversation.app} · {activeConversation.customerId}</div></div>
                  </div>
                  <div className="flex gap-2"><Button variant="outline" size="sm">认领</Button><Button size="sm" onClick={() => setConversations(current => current.map(item => item.id === activeConversation.id ? { ...item, status: "agent", owner: "张晓" } : item))}>人工接管</Button></div>
                </div>
                <ScrollArea className="flex-1 bg-muted/30 p-5">
                  <div className="space-y-4">
                    {activeConversation.messages.map((message) => (
                      <div key={message.id} className={cn(message.role === "system" ? "mx-auto max-w-fit rounded-full bg-background px-3 py-1 text-center text-[11px] text-muted-foreground" : message.role === "customer" ? "max-w-[74%] rounded-3xl rounded-bl-lg bg-background p-3.5 text-sm shadow-[0_8px_24px_-24px_rgba(15,23,42,0.4)]" : "ml-auto max-w-[74%] rounded-3xl p-3.5 text-sm", message.role === "ai" && "rounded-br-lg bg-sky-100 text-sky-900", message.role === "agent" && "rounded-br-lg bg-primary text-primary-foreground")}>
                        {message.role !== "system" && <div className="mb-1 text-[11px] opacity-70">{message.role === "customer" ? `客户 · ${message.time}` : message.role === "agent" ? `坐席 · ${message.time}` : `AI · ${message.time}`}</div>}
                        {message.text}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t bg-background p-4">
                  <div className="rounded-2xl border bg-muted/30 p-3">
                    <Textarea rows={3} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="回复客户..." className="border-none bg-transparent p-0 focus-visible:ring-0" />
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground"><button className="rounded-lg p-2 hover:bg-background"><Paperclip className="size-4" /></button><button className="rounded-lg p-2 hover:bg-background"><MessageSquare className="size-4" /></button><button className="rounded-lg p-2 hover:bg-background"><Sparkles className="size-4" /></button></div>
                      <div className="flex gap-2"><Button variant="outline" size="sm">转发</Button><Button size="sm" onClick={sendMessage}><Send className="size-3.5" />发送</Button></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden border-l bg-background p-5 lg:block">
                <h3 className="font-semibold">客户信息</h3>
                <div className="mt-4 flex items-center gap-3"><Avatar className="size-11"><AvatarFallback>{activeConversation.customer.slice(0, 1)}</AvatarFallback></Avatar><div><div className="text-sm font-medium">{activeConversation.customer}</div><div className="text-xs text-muted-foreground">{activeConversation.customerId}</div></div></div>
                <Separator className="my-5" />
                <div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">业务渠道</span><span>{activeConversation.app}</span></div><div className="flex justify-between"><span className="text-muted-foreground">当前状态</span><span className={cn("rounded-full px-2 py-0.5 text-xs", statusMap[activeConversation.status].className)}>{statusMap[activeConversation.status].label}</span></div><div className="flex justify-between"><span className="text-muted-foreground">负责人</span><span>{activeConversation.owner}</span></div></div>
                <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4"><div className="text-sm font-medium text-amber-900">风险提示</div><p className="mt-1 text-xs text-amber-700">客户最近提交过退款申请，注意回复口径。</p></div>
                <div className="mt-5"><h4 className="text-sm font-medium">转发去向</h4><div className="mt-2 flex flex-wrap gap-2">{["Telegram", "飞书", "业务系统"].map(item => <Badge key={item} variant="outline" className="rounded-full">{item}</Badge>)}</div></div>
              </div>
            </div>
          )}

          {activePage === "apps" && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[
                { name: "WhatsApp", id: "app_wa_102", status: "在线", heartbeat: "4 秒前", conversations: 312 },
                { name: "Telegram", id: "app_tg_104", status: "离线", heartbeat: "58 秒前", conversations: 208 },
                { name: "Messenger", id: "app_ms_106", status: "在线", heartbeat: "12 秒前", conversations: 96 },
              ].map((app) => (
                <Card key={app.id} className="border-slate-200/70 shadow-[0_12px_40px_-38px_rgba(15,23,42,0.4)]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex size-11 items-center justify-center rounded-2xl", app.status === "在线" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}><AppWindow className="size-5" /></div>
                        <div><CardTitle className="text-base">{app.name}</CardTitle><CardDescription>{app.id}</CardDescription></div>
                      </div>
                      <Badge variant="outline" className={cn("rounded-full", app.status === "在线" ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-slate-200 bg-slate-50 text-slate-500")}>{app.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-2xl bg-muted/50 p-4 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">最近心跳</span><span>{app.heartbeat}</span></div><div className="mt-2 flex justify-between"><span className="text-muted-foreground">今日会话</span><span>{app.conversations}</span></div></div>
                    <div className="flex gap-2"><Button variant="outline" size="sm" className="flex-1">查看凭据</Button><Button variant="destructive" size="sm" className="flex-1">{app.status === "在线" ? "禁用" : "上线"}</Button></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activePage === "channels" && (
            <Card><CardHeader className="pb-4"><CardTitle>转发渠道</CardTitle><CardDescription>客服核心向外投递消息的目标。</CardDescription></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>渠道</TableHead><TableHead>账户</TableHead><TableHead>状态</TableHead><TableHead>今日投递</TableHead><TableHead>失败率</TableHead></TableRow></TableHeader><TableBody>{[["Telegram", "@orange_support_bot", "可用", "4,201", "0.2%"], ["WhatsApp", "orange-support", "凭证失效", "2,140", "6.8%"], ["飞书", "客服转发群", "可用", "1,780", "0%"]].map((row) => (<TableRow key={row[0]}>{row.map((cell, index) => (<TableCell key={index}>{index === 2 ? <Badge className={cn("rounded-full border-transparent", cell === "可用" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>{cell}</Badge> : cell}</TableCell>))}<TableCell className="text-right"><Button variant="ghost" size="sm">配置</Button></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}

          {activePage === "ai" && (
            <div className="grid gap-5 lg:grid-cols-3">
              <Card className="lg:col-span-2"><CardHeader><CardTitle>AI 决策策略</CardTitle><CardDescription>一期只做 reply、ignore、escalate 三态。</CardDescription></CardHeader><CardContent className="space-y-3">{[["订单退款", "reply"], ["账号被盗", "escalate"], ["广告消息", "ignore"]].map(([name, decision]) => (<div key={name} className="rounded-xl border p-4"><div className="flex items-center justify-between"><span className="font-medium">{name}</span><Badge>{decision}</Badge></div></div>))}</CardContent></Card>
              <Card><CardHeader><CardTitle>知识库</CardTitle><CardDescription>更新于 2 天前</CardDescription></CardHeader><CardContent className="space-y-3"><div className="rounded-xl bg-muted p-4 text-sm">退款规则 v3</div><div className="rounded-xl bg-muted p-4 text-sm">会员权益</div></CardContent></Card>
            </div>
          )}

          {activePage === "webhook" && (
            <Card><CardHeader><CardTitle>Webhook</CardTitle><CardDescription>事件体不携带 tenantId。</CardDescription></CardHeader><CardContent className="space-y-4"><div className="rounded-xl border p-4"><div className="font-medium">订单系统事件接收</div><div className="text-sm text-muted-foreground">https://api.orange.com/cs/events</div><div className="mt-3 flex flex-wrap gap-2">{["message.created", "conversation.escalated", "delivery.failed"].map(event => <Badge key={event} variant="outline">{event}</Badge>)}</div></div></CardContent></Card>
          )}

          {activePage === "logs" && (
            <Card><CardHeader className="pb-4"><CardTitle>消息日志</CardTitle><CardDescription>查看每条消息的投递链路和失败原因。</CardDescription></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Message ID</TableHead><TableHead>会话</TableHead><TableHead>方向</TableHead><TableHead>状态</TableHead><TableHead>时间</TableHead></TableRow></TableHeader><TableBody>{[["msg_8f21ac", "conv_221904", "客服 → Telegram", "delivered", "12:31:08"], ["msg_7b0c3d", "conv_221901", "客服 → WhatsApp", "failed", "12:30:42"]].map((row) => (<TableRow key={row[0]}>{row.map((cell, index) => (<TableCell key={index} className={index === 0 ? "font-mono text-xs" : ""}>{index === 3 ? <Badge className={cn("rounded-full border-transparent", cell === "failed" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600")}>{cell}</Badge> : cell}</TableCell>))}<TableCell className="text-right"><Button variant="ghost" size="sm">详情</Button></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}

          {activePage === "settings" && (
            <div className="grid gap-5 lg:grid-cols-2">
              <Card><CardHeader><CardTitle>租户信息</CardTitle></CardHeader><CardContent className="space-y-4"><Input defaultValue="橙子科技" /><Input defaultValue="30 分钟" /></CardContent></Card>
              <Card><CardHeader><CardTitle>权限</CardTitle></CardHeader><CardContent className="space-y-3">{[["管理员", "3 人"], ["开发者", "5 人"], ["坐席", "22 人"]].map(([name, count]) => (<div key={name} className="flex items-center justify-between rounded-xl border p-4"><div><div className="text-sm font-medium">{name}</div></div><span className="text-xs text-muted-foreground">{count}</span></div>))}</CardContent></Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
