"use client";

import Link from "next/link";
import { Activity, ArrowLeft, ChevronRight, MessageSquare, Paperclip, Search, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { initialConversations } from "./mock-data";

const tabs = ["值守", "状态"] as const;
type Tab = (typeof tabs)[number];
type Filter = "全部" | "待人工" | "AI";

const statusMap = {
  waiting: { label: "待人工", className: "bg-red-50 text-red-600" },
  ai: { label: "AI 已处理", className: "bg-emerald-50 text-emerald-600" },
  agent: { label: "人工处理中", className: "bg-blue-50 text-blue-600" },
};

const navIcons: Record<Tab, typeof MessageSquare> = {
  值守: MessageSquare,
  状态: Activity,
};

export function MobileShell() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeTab, setActiveTab] = useState<Tab>("值守");
  const [activeFilter, setActiveFilter] = useState<Filter>("全部");
  const [view, setView] = useState<"list" | "chat">("list");
  const [draft, setDraft] = useState("");
  const [activeConversationId, setActiveConversationId] = useState(initialConversations[0].id);

  const activeConversation = conversations.find((item) => item.id === activeConversationId)!;

  const visibleConversations = useMemo(() => {
    if (activeFilter === "待人工") return conversations.filter((item) => item.status === "waiting");
    if (activeFilter === "AI") return conversations.filter((item) => item.status === "ai");
    return conversations;
  }, [activeFilter, conversations]);

  function openConversation(id: string) {
    setActiveConversationId(id);
    setView("chat");
  }

  function sendMessage() {
    if (!draft.trim()) return;
    const time = new Date().toTimeString().slice(0, 5);
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
    <div className="min-h-screen bg-muted/40 p-4 lg:p-10">
      <div className="mx-auto mb-6 max-w-xl">
        <div className="inline-flex rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">Flutter App UI</div>
        <div className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">仅为原型 · 非实际效果图 · v1</div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">移动端值守界面</h1>
        <p className="mt-2 text-sm text-muted-foreground">只保留客服相关能力，界面支持切换、滚动和回复。</p>
      </div>

      <div className="relative mx-auto h-[820px] w-[390px] overflow-hidden rounded-[44px] border-8 border-slate-900 bg-background shadow-2xl">
        <div className="flex h-full min-h-0 flex-col">
          {activeTab === "值守" && view === "list" && (
            <>
              <header className="shrink-0 border-b bg-background px-5 pb-3 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">橙子科技</div>
                    <h2 className="mt-1 text-[26px] font-semibold leading-tight">值守</h2>
                  </div>
                  <button className="flex size-10 items-center justify-center rounded-2xl bg-muted text-slate-600"><Search className="size-5" /></button>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1">
                  {(["全部", "待人工", "AI"] as Filter[]).map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveFilter(item)}
                      className={cn(
                        "rounded-xl py-2 text-xs font-medium transition-all",
                        activeFilter === item ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </header>

              <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/30">
                <div className="px-5 pb-28 pt-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "18", label: "待人工", tone: "text-red-600 bg-red-50/70" },
                      { value: "3", label: "处理中", tone: "text-blue-600 bg-blue-50/70" },
                      { value: "7", label: "失败", tone: "text-amber-600 bg-amber-50/70" },
                    ].map((metric) => (
                      <div key={metric.label} className="rounded-3xl border bg-background p-4 text-center shadow-sm">
                        <div className={cn("text-2xl font-semibold", metric.tone)}>{metric.value}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-medium">当前处理</span>
                    <span className="text-xs text-muted-foreground">{activeConversation.app}</span>
                  </div>
                  <button
                    onClick={() => openConversation(activeConversation.id)}
                    className="mt-3 flex w-full items-center gap-3 rounded-3xl border bg-background p-4 text-left shadow-sm"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-medium">{activeConversation.customer.slice(0, 1)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-sm font-medium">{activeConversation.customer}</span>
                        <span className="ml-2 text-[11px] text-muted-foreground">{activeConversation.time}</span>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{activeConversation.lastMessage}</p>
                    </div>
                    <ChevronRight className="size-5 shrink-0 text-slate-300" />
                  </button>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-medium">{activeFilter === "全部" ? "全部会话" : `${activeFilter}会话`}</span>
                    <span className="text-xs text-muted-foreground">{visibleConversations.length} 条</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    {visibleConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => openConversation(conversation.id)}
                        className="flex w-full items-center gap-3 rounded-3xl border bg-background p-4 text-left transition-colors hover:border-primary/30"
                      >
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-medium">{conversation.customer.slice(0, 1)}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="truncate text-sm font-medium">{conversation.customer}</span>
                            <span className="ml-2 text-[11px] text-muted-foreground">{conversation.time}</span>
                          </div>
                          <p className="mt-1 truncate text-xs text-muted-foreground">{conversation.lastMessage}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground">{conversation.app}</span>
                            <span className={cn("rounded-full px-2 py-0.5 text-[11px]", statusMap[conversation.status].className)}>{statusMap[conversation.status].label}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </main>
            </>
          )}

          {activeTab === "值守" && view === "chat" && (
            <>
              <header className="flex shrink-0 items-center gap-3 border-b bg-background px-4 py-4">
                <button onClick={() => setView("list")} className="flex size-10 items-center justify-center rounded-2xl bg-muted"><ArrowLeft className="size-5" /></button>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{activeConversation.customer}</div>
                  <div className="truncate text-xs text-muted-foreground">{activeConversation.app}</div>
                </div>
              </header>

              <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/30 px-4 py-5">
                <div className="space-y-4">
                  {activeConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        message.role === "system"
                          ? "mx-auto max-w-fit rounded-full bg-white px-3 py-1 text-center text-[11px] text-muted-foreground"
                          : message.role === "customer"
                            ? "max-w-[82%] rounded-3xl rounded-bl-lg bg-background p-4 text-sm shadow-sm"
                            : "ml-auto max-w-[82%] rounded-3xl p-4 text-sm text-primary-foreground",
                        message.role === "ai" && "rounded-br-lg bg-sky-100 text-sky-900",
                        message.role === "agent" && "rounded-br-lg bg-primary"
                      )}
                    >
                      {message.role !== "system" && <div className="mb-1 text-[11px] opacity-70">{message.role === "customer" ? `客户 · ${message.time}` : message.role === "agent" ? `坐席 · ${message.time}` : `AI · ${message.time}`}</div>}
                      {message.text}
                    </div>
                  ))}
                </div>
              </main>

              <footer className="shrink-0 border-t bg-background p-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-muted text-slate-500"><Paperclip className="size-5" /></div>
                  <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="回复客户..." className="h-11 rounded-2xl" />
                  <button onClick={sendMessage} className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Send className="size-5" /></button>
                </div>
              </footer>
            </>
          )}

          {activeTab === "状态" && (
            <>
              <header className="shrink-0 border-b bg-background px-5 pb-4 pt-6">
                <h2 className="text-[26px] font-semibold leading-tight">服务状态</h2>
                <p className="mt-1 text-sm text-muted-foreground">只保留紧急处理信息。</p>
              </header>
              <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/30 px-5 py-5">
                <div className="space-y-4">
                  {[
                    { title: "业务渠道", value: "6 / 8 在线", detail: "Telegram 离线", tone: "text-emerald-600" },
                    { title: "转发渠道", value: "1 个异常", detail: "WhatsApp 凭证失效", tone: "text-red-600" },
                    { title: "失败消息", value: "7 条", detail: "3 条等待重试", tone: "text-amber-600" },
                  ].map((item) => (
                    <div key={item.title} className="rounded-3xl border bg-background p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.title}</span>
                        <span className={cn("text-sm font-semibold", item.tone)}>{item.value}</span>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </main>
            </>
          )}

          <nav className="pointer-events-none absolute inset-x-5 bottom-4 z-10">
            <div className="pointer-events-auto grid grid-cols-2 gap-1 rounded-full border bg-background/90 p-1 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.55)] backdrop-blur">
              {tabs.map((tab) => {
                const Icon = navIcons[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn("flex flex-row items-center justify-center gap-2 rounded-full py-2.5 text-xs transition-colors", activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
                  >
                    <Icon className="size-4" />
                    {tab}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-xl text-center"><Link className="text-sm text-primary underline-offset-4 hover:underline" href="/">返回原型导航</Link></div>
    </div>
  );
}
