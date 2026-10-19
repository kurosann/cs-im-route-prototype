import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRightLeft,
  BellRing,
  Bot,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Logs,
  MessageSquareMore,
  MessageSquare,
  NotebookPen,
  ShieldCheck,
  Webhook,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  version: "v1" | "v2";
  group: "工作台" | "平台管理" | "会话服务" | "AI 配置" | "流程控制" | "渠道与日志";
  sub?: boolean;
};

const navItems: NavItem[] = [
  { href: "/v2", label: "V2 总览", icon: LayoutDashboard, version: "v2", group: "工作台" },
  { href: "/iam", label: "团队管理", icon: ShieldCheck, version: "v1", group: "平台管理" },
  { href: "/iam?tab=users", label: "员工", icon: ShieldCheck, version: "v1", group: "平台管理", sub: true },
  { href: "/iam?tab=roles", label: "角色与权限", icon: ShieldCheck, version: "v1", group: "平台管理", sub: true },
  { href: "/channel-access", label: "渠道接入", icon: Webhook, version: "v1", group: "平台管理" },
  { href: "/audit", label: "审计日志", icon: Logs, version: "v1", group: "平台管理" },
  { href: "/conversations", label: "会话", icon: MessageSquareMore, version: "v1", group: "会话服务" },
  { href: "/chat", label: "聊天室", icon: MessageSquare, version: "v1", group: "会话服务" },
  { href: "/v2/chat", label: "V2 聊天室", icon: MessageSquare, version: "v2", group: "会话服务" },
  { href: "/v2/employee", label: "AI 客服员工", icon: Bot, version: "v2", group: "AI 配置" },
  { href: "/v2/knowledge", label: "知识库", icon: NotebookPen, version: "v2", group: "AI 配置" },
  { href: "/v2/assign", label: "智能分配", icon: ArrowRightLeft, version: "v2", group: "流程控制" },
  { href: "/v2/reminders", label: "基础提醒", icon: BellRing, version: "v2", group: "流程控制" },
  { href: "/apps", label: "业务渠道", icon: Bot, version: "v1", group: "渠道与日志" },
  { href: "/channels", label: "转发渠道", icon: Webhook, version: "v1", group: "渠道与日志" },
  { href: "/logs", label: "消息日志", icon: Logs, version: "v1", group: "渠道与日志" },
];

const groups: NavItem["group"][] = ["工作台", "平台管理", "会话服务", "AI 配置", "流程控制", "渠道与日志"];

export function V2Shell({
  activeHref,
  title,
  children,
}: {
  activeHref: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh overflow-hidden bg-[#f6f7fb] text-foreground">
      <aside className="hidden w-[288px] shrink-0 flex-col border-r border-slate-200/80 bg-white lg:flex">
        <div className="flex h-16 items-center justify-between gap-3 border-b border-slate-100 px-6">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-lg font-semibold text-white">◎</div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">聚合客服</div>
            <div className="text-xs text-slate-500">V1 基础能力 · V2 智能增强</div>
          </div>
        <button
          className="flex items-center gap-1.5 rounded-full border bg-muted/40 px-2.5 py-1 text-xs text-slate-500 transition-colors hover:bg-muted"
          title="切换租户"
        >
          <span className="max-w-20 truncate font-medium text-slate-600">星辰电商</span>
          <ChevronDown className="size-3" />
        </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {groups.map((group) => (
            <div key={group} className="mb-5">
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{group}</p>
              <div className="space-y-1">
                {navItems.filter((item) => item.group === group).map((item) => {
                  const Icon = item.icon;
                  const active = item.href === activeHref || activeHref.startsWith(`${item.href}/`) || activeHref.startsWith(`${item.href}?`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl text-sm transition-all",
                        item.sub ? "h-8 pl-10 pr-3 text-[13px]" : "h-10 px-3",
                        active
                          ? "bg-slate-950 font-medium text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                      )}
                    >
                      <Icon className="size-4" />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      <span className={cn("text-[10px] font-semibold", active ? "text-white/60" : "text-slate-400")}>{item.version}</span>
                    </Link>
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
            <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
            <Badge className="hidden rounded-full border-amber-200 bg-amber-50 text-amber-700 sm:inline-flex">
              仅为原型 · 非实际效果图 · v2
            </Badge>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1500px] p-5 lg:p-8">{children}</div>
        </div>

        <nav className="flex h-16 items-center justify-around border-t border-slate-200 bg-white/90 px-2 backdrop-blur-xl lg:hidden">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[11px]",
                  active ? "bg-slate-950 text-white" : "text-slate-500"
                )}
              >
                <Icon className="size-4" />
                <span className="max-w-[68px] truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
