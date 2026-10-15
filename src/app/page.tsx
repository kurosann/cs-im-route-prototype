import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const routes = [
  { href: "/agent", title: "坐席工作台", description: "会话、聊天室和客户处理。", group: "角色场景" },
  { href: "/developer", title: "开发者工作台", description: "业务渠道、转发渠道和 Webhook。", group: "角色场景" },
  { href: "/admin", title: "管理员工作台", description: "总览、配置、告警和设置。", group: "角色场景" },
  { href: "/overview", title: "总览", description: "核心指标和待处理会话。", group: "PC 场景" },
  { href: "/conversations", title: "会话", description: "会话列表和状态筛选。", group: "PC 场景" },
  { href: "/chat", title: "聊天室", description: "消息处理、AI 建议和人工接管。", group: "PC 场景" },
  { href: "/apps", title: "业务渠道", description: "WhatsApp、Telegram、Messenger 等来源。", group: "PC 场景" },
  { href: "/channels", title: "转发渠道", description: "消息转发目标和投递状态。", group: "PC 场景" },
  { href: "/ai", title: "AI 客服", description: "回复、忽略、转人工三态策略。", group: "PC 场景" },
  { href: "/webhook", title: "Webhook", description: "事件订阅和回调配置。", group: "PC 场景" },
  { href: "/logs", title: "消息日志", description: "消息投递和失败记录。", group: "PC 场景" },
  { href: "/settings", title: "设置", description: "租户信息和权限配置。", group: "PC 场景" },
  { href: "/mobile", title: "移动端原型", description: "Flutter App 的值守、状态和我的。", group: "其他" },
];

export default function HomePage() {
  const groups = ["角色场景", "PC 场景", "其他"];

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">仅为原型 · 非实际效果图 · v1</div>
          <h1 className="text-2xl font-semibold">聚合客服原型导航</h1>
          <p className="mt-2 text-sm text-muted-foreground">这里可以快速跳转到所有 PC 场景和移动端原型。</p>
        </header>

        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group}>
              <h2 className="mb-3 text-sm font-medium text-muted-foreground">{group}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {routes.filter((route) => route.group === group).map((route) => (
                  <Link key={route.href} href={route.href} className="rounded-xl transition-transform hover:-translate-y-0.5">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-base">{route.title}</CardTitle>
                        <CardDescription>{route.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-xs text-muted-foreground">{route.href}</CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
