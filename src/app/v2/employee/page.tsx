"use client";

import { useState } from "react";
import { Bot, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { V2Shell } from "@/components/workspace/v2-shell";
import { initialKnowledgeBases, initialKnowledgeDocs, initialKnowledgeGroups } from "../mock-data";
import { cn } from "@/lib/utils";

type Mode = "basic" | "professional";

type Employee = {
  id: string;
  name: string;
  persona: string;
  status: "运行中" | "已暂停";
  mode: Mode;
  prompt: string;
  history: number;
  autoReply: boolean;
  selectedDocIds: string[];
  tools: string[];
};

const initialEmployees: Employee[] = [
  { id: "1", name: "售前助手", persona: "热情简洁，擅长商品和活动介绍", status: "运行中", mode: "basic", prompt: "你是电商售前客服，用简洁中文回答商品、价格和优惠问题。", history: 10, autoReply: true, selectedDocIds: ["d1", "d2"], tools: ["查询商品"] },
  { id: "2", name: "售后专员", persona: "耐心安抚，严格遵守售后规则", status: "运行中", mode: "professional", prompt: "你是售后客服，只回答退款、退货和物流问题，不承诺赔付。", history: 15, autoReply: true, selectedDocIds: ["d3", "d4"], tools: ["查询订单", "查询物流"] },
  { id: "3", name: "海外客服", persona: "正式礼貌，支持英西双语", status: "已暂停", mode: "professional", prompt: "Answer in the customer's language. Keep replies short and professional.", history: 12, autoReply: false, selectedDocIds: ["d7", "d8"], tools: ["自动翻译", "查询订单"] },
];

const toolOptions = ["查询商品", "查询订单", "查询物流", "自动翻译"];

export default function V2EmployeePage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [activeId, setActiveId] = useState(initialEmployees[0].id);
  const active = employees.find((item) => item.id === activeId) ?? employees[0];

  function update(patch: Partial<Employee>) {
    setEmployees((current) => current.map((item) => (item.id === active.id ? { ...item, ...patch } : item)));
  }

  function toggleValue(field: "selectedDocIds" | "tools", value: string) {
    const selected = active[field];
    update({ [field]: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value] } as Partial<Employee>);
  }

  function toggleKnowledgeBase(baseId: string) {
    const docIds = initialKnowledgeDocs.filter((doc) => doc.baseId === baseId).map((doc) => doc.id);
    const allSelected = docIds.every((id) => active.selectedDocIds.includes(id));
    update({
      selectedDocIds: allSelected
        ? active.selectedDocIds.filter((id) => !docIds.includes(id))
        : Array.from(new Set([...active.selectedDocIds, ...docIds])),
    });
  }

  return (
    <V2Shell activeHref="/v2/employee" title="AI 客服员工">
      <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
        <div className="space-y-3">
          <Card className="border-dashed shadow-none">
            <CardContent className="p-4">
              <Button
                className="w-full"
                onClick={() => {
                  const id = String(Date.now());
                  setEmployees((current) => [...current, { ...initialEmployees[0], id, name: "新 AI 员工", status: "已暂停" }]);
                  setActiveId(id);
                }}
              >
                创建 AI 员工
              </Button>
            </CardContent>
          </Card>
          {employees.map((employee) => (
            <button
              key={employee.id}
              onClick={() => setActiveId(employee.id)}
              className={cn(
                "w-full rounded-3xl border bg-white p-4 text-left transition-all",
                employee.id === active.id ? "border-slate-950 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.55)]" : "border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-100"><Bot className="size-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{employee.name}</div>
                  <p className="mt-1 truncate text-xs text-slate-500">{employee.persona}</p>
                </div>
                <Badge variant={employee.status === "运行中" ? "default" : "secondary"} className="rounded-full">{employee.status}</Badge>
              </div>
            </button>
          ))}
        </div>

        <Card className="shadow-[0_24px_70px_-50px_rgba(15,23,42,0.5)]">
          <CardHeader className="pb-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl">{active.name}</CardTitle>
                <CardDescription className="mt-2 max-w-3xl">AI 员工是独立配置对象。基础模式用来快速上线，专业模式用来接知识库、工具和更严格的边界。</CardDescription>
              </div>
              <div className="flex rounded-xl bg-slate-100 p-1">
                {(["basic", "professional"] as Mode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => update({ mode })}
                    className={cn("rounded-lg px-4 py-2 text-xs font-medium transition-all", active.mode === mode ? "bg-white text-slate-950 shadow-sm" : "text-slate-500")}
                  >
                    {mode === "basic" ? "基础模式" : "专业模式"}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm"><span className="text-slate-500">名称</span><Input value={active.name} onChange={(event) => update({ name: event.target.value })} /></label>
              <label className="space-y-2 text-sm"><span className="text-slate-500">人设</span><Input value={active.persona} onChange={(event) => update({ persona: event.target.value })} /></label>
            </div>
            <label className="block space-y-2 text-sm"><span className="text-slate-500">提示词</span><Textarea rows={5} value={active.prompt} onChange={(event) => update({ prompt: event.target.value })} /></label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2 text-sm"><span className="text-slate-500">携带历史消息</span><Input type="number" min={0} max={50} value={active.history} onChange={(event) => update({ history: Number(event.target.value) })} /></label>
              <div className="space-y-2 text-sm"><span className="text-slate-500">自动回复</span><Button variant={active.autoReply ? "default" : "outline"} className="w-full" onClick={() => update({ autoReply: !active.autoReply })}>{active.autoReply ? "开启" : "关闭"}</Button></div>
              <div className="space-y-2 text-sm"><span className="text-slate-500">运行状态</span><Button variant={active.status === "运行中" ? "default" : "outline"} className="w-full" onClick={() => update({ status: active.status === "运行中" ? "已暂停" : "运行中" })}>{active.status}</Button></div>
            </div>

            {active.mode === "professional" ? (
              <div className="grid gap-5 rounded-3xl border border-slate-200 bg-slate-50/70 p-5 xl:grid-cols-[1.4fr_1fr]">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">知识库文档</div>
                    <p className="mt-1 text-xs text-slate-500">可按产品分组整库选择，也可以只勾选具体文档。</p>
                  </div>
                  <div className="space-y-4">
                    {initialKnowledgeGroups.map((group) => {
                      const bases = initialKnowledgeBases.filter((base) => base.groupId === group.id);
                      if (!bases.length) return null;
                      return (
                        <div key={group.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{group.name}</div>
                          <div className="mt-3 space-y-3">
                            {bases.map((base) => {
                              const docs = initialKnowledgeDocs.filter((doc) => doc.baseId === base.id);
                              const selectedCount = docs.filter((doc) => active.selectedDocIds.includes(doc.id)).length;
                              const allSelected = docs.length > 0 && selectedCount === docs.length;
                              return (
                                <div key={base.id} className="rounded-xl bg-slate-50/80 p-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                      <div className="text-sm font-medium">{base.name}</div>
                                      <div className="mt-0.5 text-xs text-slate-500">{base.product} · 已选 {selectedCount}/{docs.length}</div>
                                    </div>
                                    <button onClick={() => toggleKnowledgeBase(base.id)} className={cn("rounded-full border px-3 py-1.5 text-xs", allSelected ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-600")}>
                                      {allSelected ? "取消整库" : "选择整库"}
                                    </button>
                                  </div>
                                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {docs.map((doc) => {
                                      const selected = active.selectedDocIds.includes(doc.id);
                                      return (
                                        <button key={doc.id} onClick={() => toggleValue("selectedDocIds", doc.id)} className={cn("rounded-xl border p-2 text-left text-xs transition-colors", selected ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-600")}>
                                          <span className="block truncate font-medium">{doc.title}</span>
                                          <span className={cn("mt-0.5 block", selected ? "text-white/70" : "text-slate-400")}>{doc.language} · {doc.status}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">工具调用</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {toolOptions.map((item) => (
                      <button key={item} onClick={() => toggleValue("tools", item)} className={cn("rounded-full border px-3 py-1.5 text-xs", active.tools.includes(item) ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-600")}>{item}</button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-5 text-sm text-blue-800">
                基础模式只保留最容易上手的配置。切到专业模式后，可以挂知识库、工具、测试用例和发布流程。
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
              <Button variant="outline">保存草稿</Button>
              <Button><Save className="size-4" />保存并发布</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </V2Shell>
  );
}
