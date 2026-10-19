import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

const roleGroups = [
  {
    role: "坐席",
    audience: "客服专员、值守人员",
    description: "聚焦接待、响应、接管和客户沟通。",
    items: [
      { href: "/conversations", title: "会话", description: "筛选会话、查看负责人和最近消息。", version: "v1" },
      { href: "/chat", title: "聊天室", description: "回复客户、人工接管和基础转发。", version: "v1" },
      { href: "/v2/chat", title: "V2 聊天室", description: "AI 辅助、双语对照、快捷回复和人工确认。", version: "v2" },
      { href: "/mobile", title: "移动端", description: "移动值守、状态和基础个人设置。", version: "v1" },
      { href: "/mobile/v2", title: "移动端 V2", description: "AI 会话辅助、AI 员工、知识库和提醒。", version: "v2" },
      { href: "/v2/reminders", title: "基础提醒", description: "处理超时、失败和转人工提醒。", version: "v2" },
    ],
  },
  {
    role: "开发者",
    audience: "技术接入、集成实施",
    description: "负责业务来源注册、消息转发和事件排查。",
    items: [
      { href: "/apps", title: "业务渠道", description: "注册 WhatsApp、Telegram、Messenger 等来源。", version: "v1" },
      { href: "/channels", title: "转发渠道", description: "配置转发目标，检查投递可用性。", version: "v1" },
      { href: "/webhook", title: "Webhook", description: "维护事件订阅和接收端地址。", version: "v1" },
      { href: "/logs", title: "消息日志", description: "追踪投递链路、失败原因和重试状态。", version: "v1" },
      { href: "/v2/employee", title: "AI 员工配置", description: "联调账号绑定、提示词、知识库和自动回复。", version: "v2" },
    ],
  },
  {
    role: "管理员",
    audience: "租户管理员、运营负责人",
    description: "管理 AI 策略、权限、租户设置和跨角色能力。",
    items: [
      { href: "/ai", title: "AI 客服", description: "配置自动回复、忽略和转人工策略。", version: "v1" },
      { href: "/iam", title: "IAM 管理", description: "管理员工、角色、服务凭证和终端会话授权。", version: "v1" },
      { href: "/settings", title: "设置", description: "维护租户信息、权限角色和基础参数。", version: "v1" },
      { href: "/v2", title: "V2 总览", description: "查看 V2 智能工作台和核心入口。", version: "v2" },
      { href: "/v2/employee", title: "AI 客服员工", description: "配置人设、账号、自动回复和知识库。", version: "v2" },
      { href: "/v2/knowledge", title: "知识库", description: "维护分组、文档、多语言答案和发布状态。", version: "v2" },
      { href: "/v2/assign", title: "智能分配", description: "配置规则优先级、负载均衡和转人工保护。", version: "v2" },
    ],
  },
];

const cardClass =
  "group h-full rounded-3xl border border-slate-200/70 bg-white p-5 text-left shadow-[0_18px_50px_-38px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)]";

function RouteCard({
  href,
  title,
  description,
  version = "v2",
  highlight,
}: {
  href: string;
  title: string;
  description: string;
  version?: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href} className={cardClass}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold tracking-tight">{title}</h3>
            {version ? (
              <Badge variant="outline" className="h-5 rounded-full border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-500">
                {version}
              </Badge>
            ) : null}
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <div className={highlight ? "flex size-9 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white" : "flex size-9 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-slate-950 group-hover:text-white"}>
          <ArrowUpRight className="size-4" />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
        <span className="font-mono">{href}</span>
        <span>{highlight ? "智能增强" : "进入原型"}</span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 lg:px-8 lg:py-12">
        <header className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-white p-7 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)] lg:p-9">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <Badge className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white">聚合客服原型</Badge>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">产品原型导航</h1>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                统一浏览 V1 基础能力和 V2 智能增强，V1 是 V2 的基础子集。所有界面用于产品验证。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/conversations" className={buttonVariants({ variant: "outline" })}>V1 会话</Link>
                <Link href="/v2" className={buttonVariants()}>V2 工作台</Link>
                <Link href="/mobile/v2" className={buttonVariants({ variant: "outline" })}>移动端</Link>
              </div>
            </div>
            <div className="w-full max-w-sm rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-sm text-white/70">原型覆盖</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { label: "角色", value: `${roleGroups.length} 类` },
                  { label: "版本", value: "V1 / V2" },
                  { label: "移动端", value: "已包含" },
                  { label: "权限", value: "角色化" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/10 p-4">
                    <div className="text-xs text-white/70">{item.label}</div>
                    <div className="mt-1 text-lg font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
              <p className="mt-5 rounded-2xl bg-white/5 p-3 text-xs leading-5 text-white/70">仅为原型 · 非实际效果图</p>
            </div>
          </div>
        </header>

        <div className="mt-8 space-y-8">
          {roleGroups.map((group) => (
            <section key={group.role} className="rounded-[28px] border border-slate-200/70 bg-white/70 p-5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.4)] lg:p-7">
              <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight">{group.role}</h2>
                    <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 text-[11px] text-slate-500">{group.audience}</Badge>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{group.description}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((route) => (
                  <RouteCard key={route.href} {...route} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
