"use client";

import Link from "next/link";
import { Activity, ArrowLeft, MessageSquare, MoreVertical, Search, Send } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { initialConversations } from "./mock-data";

const tabs = ["值守", "状态"] as const;
type Tab = (typeof tabs)[number];
type Filter = "全部" | "待人工" | "AI" | "人工";

const tabIcons: Record<Tab, typeof MessageSquare> = {
  值守: MessageSquare,
  状态: Activity,
};

const statusMap = {
  waiting: { label: "待人工", className: "bg-red-50 text-red-600" },
  ai: { label: "AI 已处理", className: "bg-emerald-50 text-emerald-600" },
  agent: { label: "人工处理中", className: "bg-blue-50 text-blue-600" },
};

export function MobileShell() {
  const [activeTab, setActiveTab] = useState<Tab>("值守");
  const [view, setView] = useState<"list" | "chat">("list");
  const [activeConversationId, setActiveConversationId] = useState(initialConversations[0].id);
  const [conversations, setConversations] = useState(initialConversations);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<Filter>("全部");

  const activeConversation = conversations.find((item) => item.id === activeConversationId)!;
  const visibleConversations = conversations.filter((conversation) => {
    if (filter === "待人工") return conversation.status === "waiting";
    if (filter === "AI") return conversation.status === "ai";
    if (filter === "人工") return conversation.status === "agent";
    return true;
  });

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
              unreplied: false,
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
    <div className="min-h-dvh bg-[#f6f7fb] lg:p-10">
      <div className="mx-auto mb-6 max-w-xl px-4">
        <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">Flutter App UI</div>
        <div className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">仅为原型 · 非实际效果图 · v1</div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">移动端 V1</h1>
        <p className="mt-2 text-sm text-slate-500">只保留基础值守、会话沟通和状态查看能力。</p>
      </div>

      <div className="relative mx-auto h-dvh w-full overflow-hidden sm:h-[820px] sm:w-[390px] sm:rounded-[44px] sm:border-8 sm:border-slate-900 sm:shadow-2xl">
        <div className="flex h-full min-h-0 flex-col bg-white">
          {activeTab === "值守" && view === "list" && (
            <>
              <header className="shrink-0 border-b border-slate-100 px-5 pb-4 pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[26px] font-semibold leading-tight">橙子科技</h2>
                    <p className="mt-1 text-sm text-slate-500">移动值守</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600"><Search className="size-5" /></button>
                    <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-semibold text-white">V1</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2 overflow-x-auto">
                  {(["全部", "待人工", "AI", "人工"] as Filter[]).map((item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      className={cn(
                        "h-9 shrink-0 rounded-full px-4 text-xs font-medium transition-colors",
                        filter === item ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </header>

              <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/70">
                <div className="divide-y divide-slate-100 bg-white px-5">
                  {visibleConversations.map((conversation) => (
                    <button key={conversation.id} onClick={() => openConversation(conversation.id)} className="flex w-full items-center gap-3 py-4 text-left">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-base font-semibold text-slate-700">
                        {conversation.customer.slice(0, 1)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate text-sm font-semibold">{conversation.customer}</span>
                          <span className="text-[11px] text-slate-400">{conversation.time}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="truncate text-xs text-slate-500">{conversation.lastMessage}</span>
                          {conversation.unreplied && <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">未回复</span>}
                        </div>
                      </div>
                      {conversation.unread > 0 && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{conversation.unread}</span>
                      )}
                    </button>
                  ))}
                </div>
              </main>
            </>
          )}

          {activeTab === "值守" && view === "chat" && (
            <>
              <header className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-5 pb-4 pt-6">
                <button onClick={() => setView("list")} className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600"><ArrowLeft className="size-5" /></button>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{activeConversation.customer}</div>
                  <div className="text-xs text-slate-500">{activeConversation.app}</div>
                </div>
                <button className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600"><MoreVertical className="size-5" /></button>
              </header>
              <main className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-slate-50/70 px-5 py-5">
                {activeConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[82%] rounded-3xl p-4 text-sm shadow-sm",
                      message.role === "customer" ? "rounded-bl-lg bg-white" : "ml-auto rounded-br-lg bg-slate-950 text-white"
                    )}
                  >
                    <div className="mb-1 text-[11px] opacity-70">
                      {message.role === "customer" ? `客户 · ${message.time}` : `坐席 · ${message.time}`}
                    </div>
                    {message.text}
                  </div>
                ))}
              </main>
              <footer className="shrink-0 px-4 pb-4">
                <div className="flex h-12 items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50 px-4">
                  <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="回复客户..." className="h-8 rounded-full border-none bg-transparent p-0 text-sm focus-visible:ring-0" />
                  <button onClick={sendMessage} className="flex size-8 items-center justify-center rounded-full bg-slate-950 text-white"><Send className="size-4" /></button>
                </div>
              </footer>
            </>
          )}

          {activeTab === "状态" && (
            <>
              <header className="shrink-0 border-b border-slate-100 px-5 pb-4 pt-6">
                <div>
                  <h2 className="text-[26px] font-semibold leading-tight">状态</h2>
                  <p className="mt-1 text-sm text-slate-500">值守概况和渠道可用性。</p>
                </div>
              </header>
              <main className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-slate-50/70 px-5 py-5">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: conversations.filter((item) => item.status === "waiting").length, label: "待人工", tone: "text-red-600" },
                    { value: conversations.filter((item) => item.status === "agent").length, label: "处理中", tone: "text-blue-600" },
                    { value: conversations.filter((item) => item.status === "ai").length, label: "AI 已处理", tone: "text-emerald-600" },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-3xl border border-slate-200/70 bg-white p-4 text-center shadow-sm">
                      <div className={cn("text-2xl font-semibold", metric.tone)}>{metric.value}</div>
                      <div className="mt-1 text-xs text-slate-500">{metric.label}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm">
                  <div className="text-sm font-medium">渠道状态</div>
                  <div className="mt-3 space-y-2">
                    {["WhatsApp", "Telegram", "Messenger"].map((item) => (
                      <div key={item} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3 text-sm">
                        <span className="font-medium text-slate-700">{item}</span>
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-600">在线</span>
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            </>
          )}

          {!(activeTab === "值守" && view === "chat") && (
            <nav className="absolute inset-x-4 bottom-4 z-10">
              <div className="grid grid-cols-2 gap-1 rounded-full border border-slate-200/70 bg-white/90 p-1 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.55)] backdrop-blur">
                {tabs.map((tab) => {
                  const Icon = tabIcons[tab];
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-full py-2.5 text-xs transition-colors",
                        activeTab === tab ? "bg-slate-950 text-white" : "text-slate-500"
                      )}
                    >
                      <Icon className="size-4" />
                      {tab}
                    </button>
                  );
                })}
              </div>
            </nav>
          )}
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-xl px-4 text-center">
        <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">返回原型导航</Link>
      </div>
    </div>
  );
}
