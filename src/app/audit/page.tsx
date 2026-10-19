"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

type AuditEvent = {
  id: string;
  time: string;
  event: string;
  actor: string;
  target: string;
  result: "success" | "denied";
  ip: string;
};

const auditEvents: AuditEvent[] = [
  { id: "audit_001", time: "10:22:18", event: "重置渠道密钥", actor: "Kuro", target: "官网客服接入", result: "success", ip: "203.0.113.10" },
  { id: "audit_002", time: "10:18:02", event: "查看客户会话", actor: "许可欣", target: "官网客服 · 客户张三", result: "success", ip: "198.51.100.24" },
  { id: "audit_003", time: "10:04:51", event: "发送客服消息", actor: "运营聚合服务", target: "亚马逊 · 客户王五", result: "denied", ip: "10.20.4.8" },
  { id: "audit_004", time: "09:47:37", event: "修改员工信息", actor: "Kuro", target: "李向东", result: "success", ip: "203.0.113.10" },
];

const resultText = {
  success: { label: "成功", className: "bg-emerald-50 text-emerald-700" },
  denied: { label: "拒绝", className: "bg-red-50 text-red-700" },
} as const;

export default function AuditPage() {
  return (
    <V2Shell activeHref="/audit" title="审计日志">
      <Card className="rounded-3xl border-slate-200/70">
        <CardHeader>
          <CardTitle>安全日志</CardTitle>
          <CardDescription>记录登录、密钥变更、权限调整和拒绝的异常访问。</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>操作</TableHead>
                <TableHead>操作人</TableHead>
                <TableHead>对象</TableHead>
                <TableHead>结果</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="text-muted-foreground">{event.time}</TableCell>
                  <TableCell>{event.event}</TableCell>
                  <TableCell>{event.actor}</TableCell>
                  <TableCell>{event.target}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("rounded-full border-transparent", resultText[event.result].className)}
                    >
                      {resultText[event.result].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{event.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </V2Shell>
  );
}
