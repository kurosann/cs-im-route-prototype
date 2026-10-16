"use client";

import Link from "next/link";
import { ArrowDownUp, ArrowLeft, Bell, BookOpen, Check, ChevronRight, Languages, MessageSquare, MoreVertical, RefreshCw, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { quickTranslate } from "@/lib/quick-translate";
import { initialConversations } from "./mock-data";

const tabs = ["会话", "知识", "提醒"] as const;
type Tab = (typeof tabs)[number];

const tabIcons: Record<Tab, typeof MessageSquare> = {
  会话: MessageSquare,
  知识: BookOpen,
  提醒: Bell,
};

const aiSuggestions = [
  {
    english: "Your refund has been registered and should arrive in 1-2 business days.",
    chinese: "已经帮您登记退款，预计 1-2 个工作日到账。",
  },
  {
    english: "Your order is under financial review. I will notify you when it arrives.",
    chinese: "您的订单已进入财务复核，到账后我会提醒您。",
  },
];

const knowledge = [
  { group: "退款政策", name: "退款流程 v3", status: "已发布" },
  { group: "会员权益", name: "会员开通说明", status: "已发布" },
  { group: "海外服务", name: "英文 FAQ 草稿", status: "草稿" },
];

const reminders = [
  { title: "李然 · 会话超时", detail: "已超过 3 分钟未响应", urgent: true },
  { title: "Maya · 消息失败", detail: "Telegram 投递失败，等待重试", urgent: false },
];

const quickReplies = [
  { english: "Got it, I will check it for you now.", chinese: "好的，我现在帮您确认。" },
  { english: "Please wait a moment, I am checking.", chinese: "请稍等，我正在查询。" },
  { english: "I have forwarded this to the specialist.", chinese: "我已经转给专员处理了。" },
];

const translations: Record<string, string> = {
  "你好，我昨天申请退款了。": "Hello, I applied for a refund yesterday.",
  "订单退款还有多久处理？": "How long will the refund take?",
  "请问发票可以重发吗？": "Could you resend the invoice, please?",
  "账号被锁了，需要解一下。": "My account is locked and needs to be unlocked.",
  "已经帮您登记，请在 15:20 前留意到账提醒。": "Your refund has been registered. Please watch for the payment notification by 15:20.",
  "当前订单已进入财务复核，预计 1-2 个工作日到账。需要我继续跟进吗？": "Your order is under financial review and should arrive in 1-2 business days. Would you like me to keep tracking it?",
  "可以，已发送到您的注册邮箱。": "Yes, it has been sent to your registered email.",
  "您好，我正在帮您检查账号状态。": "Hello, I am checking your account status now.",
};

export function MobileV2Shell() {
  const [activeTab, setActiveTab] = useState<Tab>("会话");
  const [view, setView] = useState<"list" | "chat">("list");
  const [activeConversationId, setActiveConversationId] = useState(initialConversations[0].id);
  const [conversations, setConversations] = useState(initialConversations);
  const [draft, setDraft] = useState("");
  const [translatedDraft, setTranslatedDraft] = useState<string | null>(null);
  const [aiSuggestionOffset, setAiSuggestionOffset] = useState(0);
  const [handledReminders, setHandledReminders] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [assistantPanel, setAssistantPanel] = useState<"ai" | "quick" | "translate" | null>(null);
  const [listFilter, setListFilter] = useState<"全部" | "未回复" | "AI" | "人工">("全部");

  const versionBadge = (
    <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-semibold text-white">V2</span>
  );

  const visibleConversations = conversations.filter((conversation) => {
    if (listFilter === "未回复") return conversation.unreplied;
    if (listFilter === "AI") return conversation.status === "ai";
    if (listFilter === "人工") return conversation.status === "agent";
    return true;
  });

  const activeConversation = conversations.find((item) => item.id === activeConversationId)!;
  const displayTranslation = translatedDraft ?? quickTranslate(draft);
  const visibleAiSuggestions = aiSuggestions.map((_, index) => aiSuggestions[(index + aiSuggestionOffset) % aiSuggestions.length]);

  function openConversation(id: string) {
    setActiveConversationId(id);
    setView("chat");
  }

  function fillDraft(text: string) {
    setDraft(text);
    setTranslatedDraft(null);
  }

  function sendMessage(content: string = draft) {
    if (!content.trim()) return;
    const time = new Date().toTimeString().slice(0, 5);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              status: "agent",
              owner: "张晓",
              lastMessage: content,
              time,
              unreplied: false,
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

  function handleReminder(title: string) {
    setHandledReminders((current) => [...current, title]);
  }

  return (
    <div className="min-h-dvh bg-[#f6f7fb] lg:min-h-screen lg:p-10">
      <div className="mx-auto mb-6 max-w-xl px-4 lg:px-0">
        <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">Flutter App UI</div>
        <div className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">仅为原型 · 非实际效果图 · v2</div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">V2 移动端</h1>
        <p className="mt-2 text-sm text-slate-500">与 PC 网页对应的 AI 会话、员工、知识库和提醒能力。</p>
      </div>

      <div className="relative mx-auto h-dvh w-full overflow-hidden sm:h-[820px] sm:w-[390px] sm:rounded-[44px] sm:border-8 sm:border-slate-900 sm:shadow-2xl">
        <div className="flex h-full min-h-0 flex-col">
          {activeTab === "会话" && view === "list" && (
            <>
              <header className="shrink-0 border-b border-slate-100 px-5 pb-4 pt-6">
                <div className="flex items-start justify-between">
                  <div>
                      <h2 className="text-[26px] font-semibold leading-tight">星辰电商</h2>
                  </div>
                  {versionBadge}
                </div>
              </header>
              <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/70">
                <div className="flex gap-2 overflow-x-auto border-b border-slate-100 bg-white px-5 py-3">
                  {(["全部", "未回复", "AI", "人工"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setListFilter(filter)}
                      className={cn(
                        "h-8 shrink-0 rounded-full px-3 text-xs font-medium transition-colors",
                        listFilter === filter
                          ? "bg-slate-950 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="divide-y divide-slate-100 pb-28">
                  {visibleConversations.map((conversation) => (
                    <button key={conversation.id} onClick={() => openConversation(conversation.id)} className="flex w-full items-start gap-3 bg-white px-5 py-4 text-left transition-colors hover:bg-slate-50">
                      <div className="mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-medium">{conversation.customer.slice(0, 1)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-[15px] font-semibold leading-6 text-slate-900">{conversation.customer}</span>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-slate-400">{conversation.time}</span>
                            {conversation.unreplied && (
                              <div className="flex items-center gap-1.5">
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">未回复</span>
                                {conversation.unread > 0 && (
                                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
                                    {conversation.unread}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="mt-0.5 truncate text-sm leading-6 text-slate-500">{conversation.lastMessage}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </main>
            </>
          )}

          {activeTab === "会话" && view === "chat" && (
            <>
              <header className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-5 pb-4 pt-6">
                <button onClick={() => setView("list")} className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600"><ArrowLeft className="size-5" /></button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">{activeConversation.customer}</span>
                    {versionBadge}
                  </div>
                  <div className="text-xs text-slate-500">{activeConversation.app}</div>
                </div>
                <button onClick={() => setShowProfile(true)} className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600"><MoreVertical className="size-5" /></button>
              </header>
              <main className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-slate-50/70 px-5 py-5">
                {activeConversation.messages.map((message) => (
                  <div key={message.id} className={cn(message.role === "customer" ? "max-w-[82%] rounded-3xl rounded-bl-lg bg-white p-4 text-sm shadow-sm" : "ml-auto max-w-[82%] rounded-3xl p-4 text-sm", message.role === "ai" && "rounded-br-lg bg-sky-100 text-sky-900", message.role === "agent" && "rounded-br-lg bg-slate-950 text-white")}>
                    {message.role !== "system" && <div className="mb-1 text-[11px] opacity-70">{message.role === "customer" ? `客户 · ${message.time}` : message.role === "agent" ? `坐席 · ${message.time}` : `AI · ${message.time}`}</div>}
                    {message.role !== "system" && translations[message.text] ? (
                      <>
                        <div>{translations[message.text]}</div>
                        <div className="my-3 border-t border-slate-100" />
                        <div className="text-xs text-slate-500">{message.text}</div>
                      </>
                    ) : (
                      message.text
                    )}
                  </div>
                ))}
              </main>
              <footer className="shrink-0 px-4 pb-4">
                <div className="rounded-3xl border border-slate-200/70 p-3">
                  {assistantPanel && (
                    assistantPanel === "translate" ? (
                      <div className="animate-[slide-up-panel_0.22s_ease-out] border-b border-slate-100 pb-3">
                        <div className="flex items-start gap-2">
                          <button
                            type="button"
                            onClick={() => { setDraft(displayTranslation); setTranslatedDraft(null); }}
                            disabled={!displayTranslation}
                            className="min-h-9 flex-1 bg-transparent px-0 py-0 text-left text-xs leading-5 text-slate-600 transition-colors disabled:opacity-50"
                          >
                            {displayTranslation || "输入内容后自动翻译"}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setDraft(displayTranslation); setTranslatedDraft(draft); }}
                            disabled={!displayTranslation}
                            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                            aria-label="上下切换"
                          >
                            <ArrowDownUp className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="animate-[slide-up-panel_0.22s_ease-out] border-b border-slate-100 pb-3">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 space-y-2">
                            {assistantPanel === "ai"
                              ? visibleAiSuggestions.map((item) => (
                                <button key={item.chinese} onClick={() => fillDraft(item.english)} className="w-full rounded-none border-none bg-transparent p-0 pb-3 text-left text-xs text-slate-600 transition-colors hover:text-slate-900">
                                    <div>{item.english}</div>
                                    <div className="mt-2 border-t border-slate-100" />
                                    <div className="text-slate-500">{item.chinese}</div>
                                  </button>
                                ))
                              : quickReplies.map((item) => (
                                  <button key={item.chinese} onClick={() => fillDraft(item.english)} className="w-full rounded-none border-none bg-transparent p-0 pb-3 text-left text-xs text-slate-600 transition-colors hover:text-slate-900">
                                    <div>{item.english}</div>
                                    <div className="mt-2 border-t border-slate-100" />
                                    <div className="text-slate-500">{item.chinese}</div>
                                  </button>
                                ))}
                          </div>
                          {assistantPanel === "ai" && (
                            <button
                              type="button"
                              onClick={() => setAiSuggestionOffset((current) => (current + 1) % aiSuggestions.length)}
                              className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                              aria-label="刷新建议"
                            >
                              <RefreshCw className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  )}
                  <div className="flex items-center gap-4 px-1">
                    <button onClick={() => setAssistantPanel(assistantPanel === "ai" ? null : "ai")} className={cn("flex items-center gap-1.5 rounded-full py-1 text-xs font-medium transition-colors", assistantPanel === "ai" ? "text-slate-950" : "text-slate-500")}>
                      <Sparkles className="size-3.5" />AI 辅助
                    </button>
                    <button onClick={() => setAssistantPanel(assistantPanel === "quick" ? null : "quick")} className={cn("flex items-center gap-1.5 rounded-full py-1 text-xs font-medium transition-colors", assistantPanel === "quick" ? "text-slate-950" : "text-slate-500")}>
                      <MessageSquare className="size-3.5" />快捷回复
                    </button>
                  <button onClick={() => setAssistantPanel(assistantPanel === "translate" ? null : "translate")} className={cn("flex items-center gap-1.5 rounded-full py-1 text-xs font-medium transition-colors", assistantPanel === "translate" ? "text-slate-950" : "text-slate-500")}>
                    <Languages className="size-3.5" />快捷翻译
                  </button>
                  </div>
                  <div className="mt-2 flex h-11 items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50 px-4">
                    <Input value={draft} onChange={(event) => { setDraft(event.target.value); setTranslatedDraft(null); }} placeholder="回复客户..." className="h-8 rounded-full border-none bg-transparent p-0 text-sm focus-visible:ring-0" />
<button onClick={() => sendMessage()} className="flex size-8 items-center justify-center rounded-full bg-slate-950 text-white"><Send className="size-4" /></button>
                  </div>
                </div>
              </footer>

              {showProfile && (
                <div className="absolute inset-0 z-20 flex flex-col justify-end bg-slate-950/30">
                  <div className="max-h-[76%] overflow-y-auto rounded-t-[32px] bg-white p-5 pb-8">
                    <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-200" />
                    <div className="mt-5 flex items-start justify-between">
                      <div>
                        <div className="text-lg font-semibold">{activeConversation.customer}</div>
                        <div className="mt-1 text-xs text-slate-500">{activeConversation.app} · {activeConversation.customerId}</div>
                      </div>
                      <button onClick={() => setShowProfile(false)} className="flex size-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"><X className="size-4" /></button>
                    </div>

                    <div className="mt-5 rounded-3xl border border-slate-200/70 p-4">
                      <div className="text-sm font-medium">当前 AI 员工</div>
                      <div className="mt-2 text-xs text-slate-500">售前助手 · 运行中</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">自动翻译已开启</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">AI 建议已生成</span>
                      </div>
                    </div>

                    <div className="mt-4 rounded-3xl border border-slate-200/70 p-4">
                      <div className="text-sm font-medium">会话摘要</div>
                      <p className="mt-2 text-xs leading-5 text-slate-600">客户咨询退款进度，AI 已解释到账时间。客户仍希望人工确认，建议尽快跟进。</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">情绪：普通</span>
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs text-red-600">风险：中等</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">主题：退款</span>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2">
                      {["转人工 / 认领", "标记提醒", "重新生成摘要", "切换 AI 建议"].map((action) => (
                        <button key={action} className="flex h-12 w-full items-center justify-between rounded-2xl border border-slate-200/70 px-4 text-sm text-slate-700">
                          {action}
                          <ChevronRight className="size-4 text-slate-300" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "知识" && (
            <>
              <header className="shrink-0 border-b border-slate-100 px-5 pb-4 pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[26px] font-semibold leading-tight">知识库</h2>
                    <p className="mt-1 text-sm text-slate-500">移动端查看和预发布。</p>
                  </div>
                  {versionBadge}
                </div>
              </header>
              <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/70">
                <div className="space-y-3 px-5 py-5 pb-28">
                  {knowledge.map((item) => (
                    <div key={item.name} className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm">
                      <div className="text-xs text-slate-400">{item.group}</div>
                      <div className="mt-1 text-sm font-medium">{item.name}</div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={cn("rounded-full px-2 py-1 text-[11px]", item.status === "已发布" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>{item.status}</span>
                        <button className="text-xs font-medium text-slate-600">预览</button>
                      </div>
                    </div>
                  ))}
                </div>
              </main>
            </>
          )}

          {activeTab === "提醒" && (
            <>
              <header className="shrink-0 border-b border-slate-100 px-5 pb-4 pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[26px] font-semibold leading-tight">提醒</h2>
                    <p className="mt-1 text-sm text-slate-500">紧急事项先处理。</p>
                  </div>
                  {versionBadge}
                </div>
              </header>
              <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/70">
                <div className="space-y-3 px-5 py-5 pb-28">
                  {reminders.map((reminder) => (
                    <div key={reminder.title} className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm">
                      <div className="text-sm font-medium">{reminder.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{reminder.detail}</div>
                      <button onClick={() => handleReminder(reminder.title)} disabled={handledReminders.includes(reminder.title)} className={cn("mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-medium", handledReminders.includes(reminder.title) ? "bg-emerald-50 text-emerald-600" : "bg-slate-950 text-white")}>
                        <Check className="size-3.5" />{handledReminders.includes(reminder.title) ? "已处理" : "标记处理"}
                      </button>
                    </div>
                  ))}
                </div>
              </main>
            </>
          )}

          {!(activeTab === "会话" && view === "chat") && (
            <nav className="pointer-events-none absolute inset-x-4 bottom-4 z-10">
            <div className="pointer-events-auto grid grid-cols-3 gap-1 rounded-full border border-slate-200/70 bg-white/90 p-1 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.55)] backdrop-blur">
              {tabs.map((tab) => {
                const Icon = tabIcons[tab];
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={cn("flex flex-row items-center justify-center gap-2 rounded-full py-2.5 text-xs transition-colors", activeTab === tab ? "bg-slate-950 text-white" : "text-slate-500")}>
                    <Icon className="size-4" />{tab}
                  </button>
                );
              })}
            </div>
            </nav>
          )}
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-xl px-4 text-center lg:block">
        <Link className="text-sm text-primary underline-offset-4 hover:underline" href="/">返回原型导航</Link>
      </div>
    </div>
  );
}
