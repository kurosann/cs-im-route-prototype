"use client";

import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { V2Shell } from "@/components/workspace/v2-shell";
import { cn } from "@/lib/utils";

type CredentialStatus = "active" | "disabled";

type ChannelCredential = {
  id: string;
  name: string;
  appId: string;
  secretKey: string;
  resource: string;
  status: CredentialStatus;
  expiresAt: string;
  lastUsedAt: string;
};

type RelayChannel = {
  name: string;
  account: string;
  status: "可用" | "凭证失效";
  deliveries: string;
  failureRate: string;
};

const initialCredentials: ChannelCredential[] = [
  {
    id: "cred_001",
    name: "官网客服接入",
    appId: "app_9f2c1a8",
    secretKey: "sk_7d31bd7cc",
    resource: "官网客服",
    status: "active",
    expiresAt: "2026-12-31",
    lastUsedAt: "4 秒前",
  },
];

const relayChannels: RelayChannel[] = [
  { name: "Web / 手机", account: "客服聚合端 · iOS / Android", status: "可用", deliveries: "8,142", failureRate: "0.2%" },
  { name: "Telegram", account: "@orange_support_bot", status: "可用", deliveries: "4,201", failureRate: "0.2%" },
  { name: "WhatsApp", account: "orange-support", status: "凭证失效", deliveries: "2,140", failureRate: "6.8%" },
  { name: "飞书", account: "客服转发群", status: "可用", deliveries: "1,780", failureRate: "0%" },
];

const statusText = {
  active: { label: "启用", className: "bg-emerald-50 text-emerald-700" },
  disabled: { label: "禁用", className: "bg-slate-100 text-slate-600" },
} as const;

export default function ChannelAccessPage() {
  const [credentials, setCredentials] = useState(initialCredentials);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState({ name: "", resource: "", expiresAt: "2026-12-31" });

  function saveCredential() {
    if (!form.name.trim() || !form.resource.trim()) return;
    setCredentials((current) => [
      {
        id: `cred_${Date.now()}`,
        name: form.name,
        appId: `app_${Math.random().toString(16).slice(2, 9)}`,
        secretKey: `sk_${Math.random().toString(16).slice(2, 11)}`,
        resource: form.resource,
        status: "active",
        expiresAt: form.expiresAt,
        lastUsedAt: "从未使用",
      },
      ...current,
    ]);
    setForm({ name: "", resource: "", expiresAt: "2026-12-31" });
    setEditorOpen(false);
  }

  function toggleCredentialStatus(credential: ChannelCredential) {
    setCredentials((current) =>
      current.map((item) =>
        item.id === credential.id
          ? { ...item, status: item.status === "active" ? "disabled" : "active" }
          : item
      )
    );
  }

  return (
    <V2Shell activeHref="/channel-access" title="渠道接入">
      <div className="space-y-6">
        <Card className="rounded-3xl border-slate-200/70">
          <CardHeader className="flex flex-col gap-4 border-b border-slate-100 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>业务渠道</CardTitle>
              <CardDescription>创建业务 AppID 和密钥，只允许发送客户消息，不能读取或发送客服消息。</CardDescription>
            </div>
            <Button onClick={() => setEditorOpen(true)}>
              <Plus className="size-4" />
              创建 AppID
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用途</TableHead>
                  <TableHead>AppID</TableHead>
                  <TableHead>密钥</TableHead>
                  <TableHead>接入对象</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>到期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credentials.map((credential) => (
                  <TableRow key={credential.id}>
                    <TableCell>
                      <div className="font-medium">{credential.name}</div>
                      <div className="text-xs text-muted-foreground">最近使用 {credential.lastUsedAt}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{credential.appId}</TableCell>
                    <TableCell className="font-mono text-xs">{credential.secretKey}</TableCell>
                    <TableCell>{credential.resource}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("rounded-full border-transparent", statusText[credential.status].className)}
                      >
                        {statusText[credential.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{credential.expiresAt}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="size-4" />
                          轮换
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleCredentialStatus(credential)}
                        >
                          {credential.status === "active" ? "禁用" : "启用"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200/70">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>转发渠道</CardTitle>
            <CardDescription>Web / 手机、Telegram、WhatsApp 等都由平台统一接入和投递。</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>渠道</TableHead>
                  <TableHead>账户</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>今日投递</TableHead>
                  <TableHead>失败率</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relayChannels.map((channel) => (
                  <TableRow key={channel.name}>
                    <TableCell className="font-medium">{channel.name}</TableCell>
                    <TableCell>{channel.account}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full border-transparent",
                          channel.status === "可用" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                        )}
                      >
                        {channel.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{channel.deliveries}</TableCell>
                    <TableCell>{channel.failureRate}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">配置</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Sheet open={editorOpen} onOpenChange={setEditorOpen}>
          <SheetContent className="w-full overflow-y-auto p-6 sm:max-w-md">
            <SheetHeader className="p-0">
              <SheetTitle>创建业务 AppID</SheetTitle>
              <SheetDescription>密钥只在创建后显示一次。</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">用途</label>
                <Input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="例如：官网客服接入"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">接入对象</label>
                <Input
                  value={form.resource}
                  onChange={(event) => setForm({ ...form, resource: event.target.value })}
                  placeholder="例如：官网客服"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">到期日期</label>
                <Input
                  type="date"
                  value={form.expiresAt}
                  onChange={(event) => setForm({ ...form, expiresAt: event.target.value })}
                />
              </div>
            </div>
            <SheetFooter className="p-0 pt-6">
              <Button onClick={saveCredential}>签发</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </V2Shell>
  );
}
