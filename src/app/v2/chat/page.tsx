"use client";

import { useState } from "react";
import { ArrowDownUp, ChevronRight, Languages, MessageSquare, RefreshCw, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { V2Shell } from "@/components/workspace/v2-shell";
import { cn } from "@/lib/utils";
import { initialKnowledgeBases, initialKnowledgeDocs } from "../mock-data";

type Message = {
  id: string;
  role: "customer" | "agent";
  text: string;
  translated?: string;
  time: string;
};

const initialMessages: Message[] = [
  {
    id: "m1",
    role: "customer",
    text: "Hello, I need a refund for my order.",
    translated: "你好，我想申请订单退款。",
    time: "12:31",
  },
  {
    id: "m2",
    role: "agent",
    text: "I have confirmed the refund status for you.",
    translated: "我已经帮你确认退款状态。",
    time: "12:32",
  },
  {
    id: "m3",
    role: "customer",
    text: "How long will it take?",
    translated: "还需要等多久？",
    time: "12:34",
  },
];

const conversations = [
  { id: "c1", name: "Maya", app: "WhatsApp", preview: "How long will it take?", time: "12:34" },
  { id: "c2", name: "Lucía", app: "Telegram", preview: "Gracias por la ayuda.", time: "12:20" },
  { id: "c3", name: "Daniel", app: "Messenger", preview: "My account is locked.", time: "11:52" },
];

const suggestions = [
  { english: "The refund is under review and will arrive in 1-2 business days.", chinese: "退款正在复核中，预计 1-2 个工作日到账。" },
  { english: "I have expedited your case and will notify you once it is processed.", chinese: "我已为您的订单加急处理，完成后会通知您。" },
  { english: "Would you like me to send the refund progress screenshot?", chinese: "需要我把退款进度截图发给您吗？" },
];

const toneOptions = ["正式", "友好", "简洁", "安抚"] as const;
type Tone = (typeof toneOptions)[number];

const toneSuggestions: Record<Tone, typeof suggestions> = {
  正式: suggestions,
  友好: [
    { english: "Good news—I've checked on this and it should be resolved in 1-2 business days.", chinese: "好消息，我已经帮您确认，预计 1-2 个工作日解决。" },
    { english: "I'll keep an eye on it and let you know as soon as there's an update.", chinese: "我会持续关注，一有进展就通知您。" },
    { english: "Would you like me to send over the latest progress screenshot?", chinese: "需要我把最新进度截图发给您吗？" },
  ],
  简洁: [
    { english: "Refund review: 1-2 business days.", chinese: "退款复核：1-2 个工作日。" },
    { english: "I've prioritized your case.", chinese: "已加急处理。" },
    { english: "Send progress screenshot?", chinese: "需要发进度截图吗？" },
  ],
  安抚: [
    { english: "I completely understand your concern and have prioritized this case.", chinese: "非常理解您的担忧，已经优先处理您的问题。" },
    { english: "The refund is under final review and should arrive in 1-2 business days.", chinese: "退款正在最后复核，预计 1-2 个工作日到账。" },
    { english: "I'll personally follow up until this is confirmed.", chinese: "我会持续跟进，直到确认到账。" },
  ],
};

const quickReplies = [
  { english: "Got it, I will check it for you now.", chinese: "好的，我现在帮您确认。" },
  { english: "Please wait a moment, I am checking.", chinese: "请稍等，我正在查询。" },
  { english: "I have forwarded this to the specialist.", chinese: "我已经转给专员处理了。" },
];

const quickTranslations: Record<string, { zh: string; en: string }> = {
  "退款已受理": { zh: "Refund accepted.", en: "退款已受理。" },
  "预计 1-2 个工作日到账": { zh: "It is expected to arrive in 1-2 business days.", en: "预计 1-2 个工作日到账。" },
  "正在帮您核实订单状态": { zh: "I am checking your order status.", en: "正在帮您核实订单状态。" },
  "好的，我现在帮您确认。": { zh: "Got it, I will check it for you now.", en: "好的，我现在帮您确认。" },
  "请稍等，我正在查询。": { zh: "Please wait a moment, I am checking.", en: "请稍等，我正在查询。" },
  "我已经转给专员处理了。": { zh: "I have forwarded this to the specialist.", en: "我已经转给专员处理了。" },
};

function quickTranslate(text: string, direction: "zh-en" | "en-zh") {
  const item = quickTranslations[text];
  if (!item) return text.trim() ? `${text}（模拟译文）` : "";
  return direction === "zh-en" ? item.en : item.zh;
}

export default function V2ChatPage() {
  const [activeConversation, setActiveConversation] = useState("c1");
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [showTranslation, setShowTranslation] = useState(true);
  const [showAI, setShowAI] = useState(false);
  const [tone, setTone] = useState<Tone>("正式");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showQuickTranslate, setShowQuickTranslate] = useState(false);
  const [translationDirection, setTranslationDirection] = useState<"zh-en" | "en-zh">("zh-en");
  const [languageMapping, setLanguageMapping] = useState<"auto" | "zh" | "en">("auto");
  const [knowledgeBaseId, setKnowledgeBaseId] = useState<string | null>(null);

  function send() {
    if (!draft.trim()) return;
    setMessages((current) => [...current, { id: `m${Date.now()}`, role: "agent", text: draft, time: "12:35" }]);
    setDraft("");
  }

  const translationDirectionForDraft =
    languageMapping === "zh" ? "en-zh" : languageMapping === "en" ? "zh-en" : translationDirection;
  const displayTranslation = quickTranslate(draft, translationDirectionForDraft);
  const activeKnowledgeBase = initialKnowledgeBases.find((base) => base.id === knowledgeBaseId);
  const knowledgeDocs = initialKnowledgeDocs.filter((doc) => doc.baseId === knowledgeBaseId);

  return (
    <V2Shell
      activeHref="/v2/chat"
      title="V2 聊天室"
    >
      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <Card className="shadow-[0_24px_70px_-50px_rgba(15,23,42,0.5)]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base"><MessageSquare className="size-4" />会话</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {conversations.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveConversation(item.id)}
                  className={cn(
                    "w-full px-5 py-4 text-left transition-colors hover:bg-slate-50",
                    activeConversation === item.id && "bg-slate-50"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{item.name}</div>
                      <div className="mt-0.5 text-xs text-slate-400">{item.app}</div>
                    </div>
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                  <p className="mt-2 truncate text-xs text-slate-500">{item.preview}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="flex min-h-[700px] flex-col shadow-[0_24px_70px_-50px_rgba(15,23,42,0.5)]">
          <CardHeader className="border-b border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Maya · WhatsApp</CardTitle>
                <CardDescription className="mt-1">客户语言：英语 · AI 员工：海外客服</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={showTranslation ? "default" : "outline"}
                  size="sm"
                  className="size-8 rounded-full p-0"
                  title={showTranslation ? "隐藏译文" : "显示译文"}
                  onClick={() => setShowTranslation(!showTranslation)}
                >
                  <Languages className="size-4" />
                </Button>
                <select
                  value={languageMapping}
                  onChange={(event) => setLanguageMapping(event.target.value as "auto" | "zh" | "en")}
                  aria-label="目标语言"
                  className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="auto">自动</option>
                  <option value="zh">中文</option>
                  <option value="en">英语</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#f8fafc] p-5">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.role === "customer" ? "justify-start" : "justify-end")}>
                <div className={cn("max-w-[78%] rounded-3xl px-4 py-3 text-sm shadow-sm", message.role === "customer" ? "rounded-bl-lg bg-white" : "rounded-br-lg bg-slate-950 text-white")}>
                  <p>{message.text}</p>
                  {showTranslation && message.translated && (
                    <p className={cn("mt-2 border-t border-dashed pt-2 text-xs", message.role === "customer" ? "border-slate-200 text-slate-500" : "border-white/20 text-white/70")}>
                      {message.translated}
                    </p>
                  )}
                  <div className={cn("mt-1 text-[11px]", message.role === "customer" ? "text-slate-400" : "text-white/60")}>{message.time}</div>
                </div>
              </div>
            ))}
          </CardContent>

          <CardContent className="border-t border-slate-100 p-4">
            {showAI && (
              <div className="mb-3 space-y-2" style={{ animation: "slide-down 180ms ease-out", transformOrigin: "top" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">AI 辅助建议</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowAI(true)}>
                    <RefreshCw className="size-3.5" />刷新
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {toneOptions.map((item) => (
                    <button
                      key={item}
                      onClick={() => setTone(item)}
                      className={cn("rounded-full border px-2.5 py-1 text-[11px] transition-colors", tone === item ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700")}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {toneSuggestions[tone].map((item, index) => (
                  <button
                    key={item.english}
                    onClick={() => setDraft(item.english)}
                    className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm transition-colors hover:border-slate-950"
                  >
                    <span className="text-xs text-slate-500">建议 {index + 1}</span>
                    <p className="mt-1 leading-6">{item.english}</p>
                    <div className="my-2 border-t border-dashed border-slate-200" />
                    <p className="text-xs leading-5 text-slate-500">{item.chinese}</p>
                  </button>
                ))}
              </div>
            )}

            {showQuickReplies && (
              <div className="mb-3 space-y-2" style={{ animation: "slide-down 180ms ease-out", transformOrigin: "top" }}>
                {quickReplies.map((item) => (
                  <button
                    key={item.english}
                    onClick={() => setDraft(item.english)}
                    className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm transition-colors hover:border-slate-950"
                  >
                    <p className="leading-6">{item.english}</p>
                    <div className="my-2 border-t border-dashed border-slate-200" />
                    <p className="text-xs leading-5 text-slate-500">{item.chinese}</p>
                  </button>
                ))}
              </div>
            )}

            {showQuickTranslate && (
              <div className="mb-3 flex items-start gap-2" style={{ animation: "slide-down 180ms ease-out", transformOrigin: "top" }}>
                <button
                  type="button"
                  onClick={() => setDraft(displayTranslation)}
                  disabled={!displayTranslation}
                  className="min-h-9 flex-1 bg-transparent px-0 py-0 text-left text-xs leading-5 text-slate-600 transition-colors disabled:opacity-50"
                >
                  {displayTranslation || "输入内容后自动翻译"}
                </button>
                <button
                  type="button"
                  onClick={() => setTranslationDirection((current) => (current === "zh-en" ? "en-zh" : "zh-en"))}
                  className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  aria-label="切换翻译方向"
                >
                  <ArrowDownUp className="size-3.5" />
                </button>
              </div>
            )}

            <div className="mb-3 flex flex-wrap gap-2">
              <Button variant={showAI ? "default" : "outline"} size="sm" onClick={() => { setShowAI(!showAI); setShowQuickReplies(false); setShowQuickTranslate(false); }}>
                <Sparkles className="size-4" />AI 辅助
              </Button>
              <Button variant={showQuickReplies ? "default" : "outline"} size="sm" onClick={() => { setShowQuickReplies(!showQuickReplies); setShowAI(false); setShowQuickTranslate(false); }}>
                <MessageSquare className="size-4" />快捷回复
              </Button>
              <Button variant={showQuickTranslate ? "default" : "outline"} size="sm" onClick={() => { setShowQuickTranslate(!showQuickTranslate); setShowAI(false); setShowQuickReplies(false); }}>
                <Languages className="size-4" />快捷翻译
              </Button>
            </div>

            <Textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="输入回复..." className="min-h-24 resize-none" />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">AI 建议和快捷回复均需人工确认后发送。</span>
              <Button onClick={send}><Send className="size-4" />发送</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">Maya · WhatsApp</CardTitle><CardDescription className="mt-1 text-xs">客户档案</CardDescription></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-2xl border border-slate-200/70 p-4">
                <div className="text-sm font-medium">当前 AI 员工</div>
                <div className="mt-1 text-xs text-slate-500">海外客服 · 运行中</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="xs"
                    variant="outline"
                    className="rounded-full px-3 text-xs"
                    onClick={() => setKnowledgeBaseId("kb2")}
                  >
                    售后政策库
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    className="rounded-full px-3 text-xs"
                    onClick={() => setKnowledgeBaseId("kb3")}
                  >
                    会员权益库
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">会话摘要</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs leading-6 text-slate-600">客户咨询退款进度，AI 已解释到账时间。客户仍希望人工确认，建议尽快跟进。</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full bg-amber-50 text-amber-700">情绪：普通</Badge>
                <Badge className="rounded-full bg-red-50 text-red-600">风险：中等</Badge>
                <Badge variant="outline" className="rounded-full bg-slate-100 text-slate-600">主题：退款</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">操作</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {["转人工 / 认领", "标记提醒", "重新生成摘要", "切换 AI 建议"].map((action) => (
                <button key={action} className="flex h-11 w-full items-center justify-between rounded-2xl border border-slate-200/70 px-4 text-sm text-slate-700 transition-colors hover:bg-slate-50">
                  {action}
                  <ChevronRight className="size-4 text-slate-300" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Sheet open={Boolean(knowledgeBaseId)} onOpenChange={(open) => !open && setKnowledgeBaseId(null)}>
        <SheetContent side="right" className="w-full max-w-xl gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b p-5">
            <SheetTitle>{activeKnowledgeBase?.name}</SheetTitle>
            <SheetDescription>{activeKnowledgeBase?.description}</SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-5">
            {knowledgeDocs.map((doc) => (
              <div key={doc.id} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-950">{doc.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{doc.type} · {doc.language}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full",
                      doc.status === "已发布" ? "bg-emerald-50 text-emerald-600" : doc.status === "待审核" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {doc.status}
                  </Badge>
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-600">{doc.answer}</p>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </V2Shell>
  );
}
