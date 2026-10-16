"use client";

import Link from "next/link";
import { AppWindow, ArrowRightLeft, ChevronDown, FileText, Inbox, LayoutDashboard, MessageSquare, Paperclip, Send, Settings, Sparkles, Webhook } from "lucide-react";
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

const navItems: { id: PageId; label: string; group: "work" | "config" | "system"; version: "v1" }[] = [
  { id: "conversations", label: "会话", group: "work", version: "v1" },
  { id: "chat", label: "聊天室", group: "work", version: "v1" },
  { id: "apps", label: "业务渠道", group: "config", version: "v1" },
  { id: "channels", label: "转发渠道", group: "config", version: "v1" },
  { id: "ai", label: "AI 客服", group: "config", version: "v1" },
  { id: "webhook", label: "Webhook", group: "config", version: "v1" },
  { id: "logs", label: "消息日志", group: "config", version: "v1" },
  { id: "settings", label: "设置", group: "system", version: "v1" },
];

const statusMap = {
  waiting: { label: "待人工", className: "bg-red-50 text-red-600" },
  ai: { label: "AI 已处理", className: "bg-emerald-50 text-emerald-600" },
  agent: { label: "人工处理中", className: "bg-blue-50 text-blue-600" },
};

const v1CardClass = "rounded-3xl border-slate-200/70 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.45)]";

const navIcons: Record<PageId, typeof LayoutDashboard> = {
  conversations: Inbox,
  chat: MessageSquare,
  apps: AppWindow,
  channels: ArrowRightLeft,
  ai: Sparkles,
  webhook: Webhook,
  logs: FileText,
  settings: Settings,
};

export function WorkspaceShell({ initialPage = "conversations", initialRole = "agent" }: { initialPage?: PageId; initialRole?: Role }) {
  const role = initialRole;
  const [activePage, setActivePage] = useState<PageId>(initialPage);
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState(initialConversations[0].id);
  const [draft, setDraft] = useState("");
  const [translatedDraft, setTranslatedDraft] = useState<string | null>(null);

  const allowedPages = rolePages[role];
  const visibleNav = navItems.filter((item) => allowedPages.includes(item.id));
  const activeConversation = conversations.find((item) => item.id === activeConversationId) ?? conversations[0];
  function selectConversation(id: string) {
    setActiveConversationId(id);
    setActivePage("chat");
  }

  function sendMessage(content: string = draft) {
    if (!content.trim()) return;
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              status: "agent",
              owner: "张晓",
              lastMessage: content,
              time,
              messages: [
                ...conversation.messages,
                { id: `m${conversation.messages.length + 1}`, role: "agent", text: content, time },
              ],
            }
          : conversation
      )
    );
    setDraft("");
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#f6f7fb] text-foreground">
      <aside className="hidden w-[288px] shrink-0 flex-col border-r border-slate-200/80 bg-white lg:flex">
        <div className="flex h-16 items-center justify-between gap-3 border-b border-slate-100 px-6">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-lg font-semibold text-white">◎</div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">聚合客服</div>
            <div className="text-xs text-slate-500">V1 基础能力</div>
          </div>
          <button className="flex items-center gap-1.5 rounded-full border bg-muted/40 px-2.5 py-1 text-xs text-slate-500 transition-colors hover:bg-muted" title="切换租户">
            <span className="max-w-20 truncate font-medium text-slate-600">橙子科技</span>
            <ChevronDown className="size-3" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {(["work", "config", "system"] as const).map((group) => (
            <div key={group} className="mb-5">
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {group === "work" ? "工作台" : group === "config" ? "会话服务" : "系统设置"}
              </p>
              <div className="space-y-1">
                {visibleNav.filter((item) => item.group === group).map((item) => {
                  const Icon = navIcons[item.id];
                  const active = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActivePage(item.id)}
                      className={cn(
                        "flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm transition-all",
                        active ? "bg-slate-950 font-medium text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                      )}
                    >
                      <Icon className="size-4" />
                      <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                      <span className={cn("text-[10px] font-semibold", active ? "text-white/60" : "text-slate-400")}>{item.version}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <Link href="/" className="flex h-10 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-600 transition-colors hover:bg-slate-200">
            返回原型导航
          </Link>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/85 px-5 backdrop-blur-xl lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white lg:hidden">◎</div>
            <h1 className="truncate text-lg font-semibold tracking-tight">{pageTitles[activePage]}</h1>
            <Badge variant="outline" className="hidden rounded-full border-amber-200 bg-amber-50 text-[11px] font-medium text-amber-700 sm:inline-flex">仅为原型 · 非实际效果图 · v1</Badge>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1500px] p-5 lg:p-8">
          {activePage === "conversations" && (
            <Card className={v1CardClass}>
              <CardContent className="p-0">
                <Table>
                <TableHeader><TableRow><TableHead>客户</TableHead><TableHead>业务渠道</TableHead><TableHead>最近消息</TableHead><TableHead>状态</TableHead><TableHead>负责人</TableHead><TableHead>未读</TableHead><TableHead>未回复</TableHead><TableHead /></TableRow></TableHeader>
                  <TableBody>
                    {conversations.map((conversation) => (
                      <TableRow key={conversation.id}>
                        <TableCell><div className="font-medium">{conversation.customer}</div></TableCell>
                        <TableCell>{conversation.app}</TableCell>
                        <TableCell className="max-w-64 truncate">{conversation.lastMessage}</TableCell>
                        <TableCell><Badge className={cn("border-transparent", statusMap[conversation.status].className)}>{statusMap[conversation.status].label}</Badge></TableCell>
                        <TableCell>{conversation.owner}</TableCell>
                        <TableCell>{conversation.unread > 0 ? <Badge className="border-transparent bg-red-50 text-red-600">{conversation.unread}</Badge> : "0"}</TableCell>
                        <TableCell>{conversation.unreplied ? <Badge className="border-transparent bg-amber-50 text-amber-700">未回复</Badge> : "已回复"}</TableCell>
                        <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => selectConversation(conversation.id)}>查看</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {(activePage === "chat" || activePage === "conversations") && activePage === "chat" && (
            <div className="grid h-[calc(100vh-11rem)] overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)] lg:grid-cols-[330px_1fr_360px]">
              <div className="hidden border-r lg:block">
                <div className="flex h-14 items-center border-b px-4"><span className="font-medium">会话</span></div>
                <ScrollArea className="h-[calc(100%-3.5rem)]">
                  <div className="divide-y">
                    {conversations.map((conversation) => (
                      <button key={conversation.id} onClick={() => setActiveConversationId(conversation.id)} className={cn("w-full border-b border-slate-200/70 px-4 py-4 text-left transition-colors", activeConversation.id === conversation.id ? "bg-slate-950/5" : "hover:bg-slate-50")}>
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-medium">{conversation.customer.slice(0, 1)}</div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between"><span className="truncate text-sm font-medium">{conversation.customer}</span><span className="ml-2 shrink-0 text-[11px] text-muted-foreground">{conversation.time}</span></div>
                            <p className="mt-1 truncate text-xs text-muted-foreground">{conversation.lastMessage}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px]", statusMap[conversation.status].className)}>{statusMap[conversation.status].label}</span>
                              {conversation.unreplied && <span className="inline-flex rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">未回复</span>}
                            </div>
                          </div>
                          {conversation.unread > 0 && (
                            <span className="ml-2 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex min-w-0 flex-col">
                <div className="flex h-16 shrink-0 items-center border-b px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-medium">{activeConversation.customer.slice(0, 1)}</div>
                    <div><div className="text-sm font-medium">{activeConversation.customer}</div><div className="text-xs text-muted-foreground">{activeConversation.app}</div></div>
                  </div>
                </div>
                <ScrollArea className="flex-1 bg-slate-50/70 p-5">
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
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3">
                    <Textarea rows={3} value={draft} onChange={(event) => { setDraft(event.target.value); setTranslatedDraft(null); }} placeholder="回复客户..." className="border-none bg-transparent p-0 focus-visible:ring-0" />
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <button className="rounded-lg p-2 hover:bg-background"><Paperclip className="size-4" /></button>
                        <button className="rounded-lg p-2 hover:bg-background"><Paperclip className="size-4" /></button>
                      </div>
                      <div className="flex gap-2"><Button variant="outline" size="sm">转发</Button><Button size="sm" onClick={() => sendMessage()}><Send className="size-3.5" />发送</Button></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden border-l bg-background p-5 lg:block">
                <h3 className="font-semibold">客户信息</h3>
                <div className="mt-4 flex items-center gap-3"><Avatar className="size-11"><AvatarFallback>{activeConversation.customer.slice(0, 1)}</AvatarFallback></Avatar><div><div className="text-sm font-medium">{activeConversation.customer}</div><div className="text-xs text-muted-foreground">{activeConversation.app}</div></div></div>
                <Separator className="my-5" />
                <div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">业务渠道</span><span>{activeConversation.app}</span></div><div className="flex justify-between"><span className="text-muted-foreground">当前状态</span><span className={cn("rounded-full px-2 py-0.5 text-xs", statusMap[activeConversation.status].className)}>{statusMap[activeConversation.status].label}</span></div><div className="flex justify-between"><span className="text-muted-foreground">负责人</span><span>{activeConversation.owner}</span></div></div>
                <div className="mt-5"><h4 className="text-sm font-medium">转发去向</h4><div className="mt-2 flex flex-wrap gap-2">{["Telegram", "飞书", "业务系统"].map(item => <Badge key={item} variant="outline" className="rounded-full">{item}</Badge>)}</div></div>
              </div>
            </div>
          )}

          {activePage === "apps" && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[
                { name: "WhatsApp", status: "在线", heartbeat: "4 秒前", conversations: 312 },
                { name: "Telegram", status: "离线", heartbeat: "58 秒前", conversations: 208 },
                { name: "Messenger", status: "在线", heartbeat: "12 秒前", conversations: 96 },
              ].map((app) => (
                <Card key={app.name} className="rounded-3xl border-slate-200/70 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.45)]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex size-11 items-center justify-center rounded-2xl", app.status === "在线" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}><AppWindow className="size-5" /></div>
                        <div><CardTitle className="text-base">{app.name}</CardTitle><CardDescription>客服来源</CardDescription></div>
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
            <Card className={v1CardClass}><CardHeader className="pb-4"><CardTitle>转发渠道</CardTitle><CardDescription>客服核心向外投递消息的目标。</CardDescription></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>渠道</TableHead><TableHead>账户</TableHead><TableHead>状态</TableHead><TableHead>今日投递</TableHead><TableHead>失败率</TableHead></TableRow></TableHeader><TableBody>{[["Telegram", "@orange_support_bot", "可用", "4,201", "0.2%"], ["WhatsApp", "orange-support", "凭证失效", "2,140", "6.8%"], ["飞书", "客服转发群", "可用", "1,780", "0%"]].map((row) => (<TableRow key={row[0]}>{row.map((cell, index) => (<TableCell key={index}>{index === 2 ? <Badge className={cn("rounded-full border-transparent", cell === "可用" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>{cell}</Badge> : cell}</TableCell>))}<TableCell className="text-right"><Button variant="ghost" size="sm">配置</Button></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}

          {activePage === "ai" && (
            <div className="grid gap-5 lg:grid-cols-3">
              <Card className={cn(v1CardClass, "lg:col-span-2")}><CardHeader><CardTitle>AI 决策策略</CardTitle><CardDescription>一期只做 reply、ignore、escalate 三态。</CardDescription></CardHeader><CardContent className="space-y-3">{[["订单退款", "reply"], ["账号被盗", "escalate"], ["广告消息", "ignore"]].map(([name, decision]) => (<div key={name} className="rounded-2xl border border-slate-200/70 p-4"><div className="flex items-center justify-between"><span className="font-medium">{name}</span><Badge className="rounded-full">{decision}</Badge></div></div>))}</CardContent></Card>
              <Card className={v1CardClass}><CardHeader><CardTitle>知识库</CardTitle><CardDescription>更新于 2 天前</CardDescription></CardHeader><CardContent className="space-y-3"><div className="rounded-2xl bg-slate-50 p-4 text-sm">退款规则 v3</div><div className="rounded-2xl bg-slate-50 p-4 text-sm">会员权益</div></CardContent></Card>
            </div>
          )}

          {activePage === "webhook" && (
            <Card className={v1CardClass}><CardHeader><CardTitle>Webhook</CardTitle><CardDescription>事件体不携带 tenantId。</CardDescription></CardHeader><CardContent className="space-y-4"><div className="rounded-2xl border border-slate-200/70 p-4"><div className="font-medium">订单系统事件接收</div><div className="text-sm text-muted-foreground">https://api.orange.com/cs/events</div><div className="mt-3 flex flex-wrap gap-2">{["message.created", "conversation.escalated", "delivery.failed"].map(event => <Badge key={event} variant="outline" className="rounded-full">{event}</Badge>)}</div></div></CardContent></Card>
          )}

          {activePage === "logs" && (
            <Card className={v1CardClass}><CardHeader className="pb-4"><CardTitle>消息日志</CardTitle><CardDescription>查看每条消息的投递链路和失败原因。</CardDescription></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Message ID</TableHead><TableHead>会话</TableHead><TableHead>方向</TableHead><TableHead>状态</TableHead><TableHead>时间</TableHead></TableRow></TableHeader><TableBody>{[["msg_8f21ac", "conv_221904", "客服 → Telegram", "delivered", "12:31:08"], ["msg_7b0c3d", "conv_221901", "客服 → WhatsApp", "failed", "12:30:42"]].map((row) => (<TableRow key={row[0]}>{row.map((cell, index) => (<TableCell key={index} className={index === 0 ? "font-mono text-xs" : ""}>{index === 3 ? <Badge className={cn("rounded-full border-transparent", cell === "failed" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600")}>{cell}</Badge> : cell}</TableCell>))}<TableCell className="text-right"><Button variant="ghost" size="sm">详情</Button></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}

          {activePage === "settings" && (
            <div className="grid gap-5 lg:grid-cols-2">
              <Card className={v1CardClass}><CardHeader><CardTitle>租户信息</CardTitle></CardHeader><CardContent className="space-y-4"><Input defaultValue="橙子科技" /><Input defaultValue="30 分钟" /></CardContent></Card>
              <Card className={v1CardClass}><CardHeader><CardTitle>权限</CardTitle></CardHeader><CardContent className="space-y-3">{[["管理员", "3 人"], ["开发者", "5 人"], ["坐席", "22 人"]].map(([name, count]) => (<div key={name} className="flex items-center justify-between rounded-2xl border border-slate-200/70 p-4"><div><div className="text-sm font-medium">{name}</div></div><span className="text-xs text-muted-foreground">{count}</span></div>))}</CardContent></Card>
            </div>
          )}
        </div>
        </div>
      </main>
    </div>
  );
}
