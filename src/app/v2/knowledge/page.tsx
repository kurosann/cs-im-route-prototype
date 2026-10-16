"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FolderPlus, LibraryBig, Plus, Search } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { V2Shell } from "@/components/workspace/v2-shell";
import { cn } from "@/lib/utils";
import {
  initialKnowledgeBases,
  initialKnowledgeDocs,
  initialKnowledgeGroups,
  type KnowledgeBase,
  type KnowledgeDoc,
  type KnowledgeGroup,
} from "../mock-data";

const statusFilters = ["全部", "已发布", "待审核", "草稿"] as const;

type DocDraft = {
  id?: string;
  title: string;
  answer: string;
  type: KnowledgeDoc["type"];
  language: KnowledgeDoc["language"];
  status: KnowledgeDoc["status"];
};

const emptyDraft: DocDraft = {
  title: "",
  answer: "",
  type: "FAQ",
  language: "中文",
  status: "草稿",
};

export default function V2KnowledgePage() {
  const [groups, setGroups] = useState<KnowledgeGroup[]>(initialKnowledgeGroups);
  const [bases, setBases] = useState<KnowledgeBase[]>(initialKnowledgeBases);
  const [docs, setDocs] = useState<KnowledgeDoc[]>(initialKnowledgeDocs);
  const [activeGroupId, setActiveGroupId] = useState(initialKnowledgeGroups[0].id);
  const [activeBaseId, setActiveBaseId] = useState(initialKnowledgeBases[0].id);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(initialKnowledgeGroups.map((group) => group.id));
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>("全部");
  const [keyword, setKeyword] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newBaseName, setNewBaseName] = useState("");
  const [docDraft, setDocDraft] = useState<DocDraft | null>(null);

  const activeGroup = groups.find((group) => group.id === activeGroupId) ?? groups[0];
  const activeBase = bases.find((base) => base.id === activeBaseId);
  const activeGroupBases = bases.filter((base) => base.groupId === activeGroup.id);
  const activeDocs = activeBase
    ? docs.filter((doc) => doc.baseId === activeBase.id)
    : docs.filter((doc) => activeGroupBases.some((base) => base.id === doc.baseId));
  const visibleDocs = activeDocs.filter((doc) => {
    const matchStatus = statusFilter === "全部" || doc.status === statusFilter;
    const matchKeyword = `${doc.title}${doc.answer}`.toLowerCase().includes(keyword.toLowerCase());
    return matchStatus && matchKeyword;
  });

  function addGroup() {
    const name = newGroupName.trim();
    if (!name || groups.some((group) => group.name === name)) return;
    const group = { id: `g_${Date.now()}`, name };
    setGroups((current) => [...current, group]);
    setExpandedGroups((current) => [...current, group.id]);
    setActiveGroupId(group.id);
    setNewGroupName("");
  }

  function addBase() {
    const name = newBaseName.trim();
    if (!name || bases.some((base) => base.groupId === activeGroup.id && base.name === name)) return;
    const base = {
      id: `kb_${Date.now()}`,
      groupId: activeGroup.id,
      name,
      product: "自定义产品",
      description: "自由创建的知识库。",
    };
    setBases((current) => [...current, base]);
    setActiveBaseId(base.id);
    setNewBaseName("");
  }

  function openCreateDoc() {
    setDocDraft({ ...emptyDraft });
  }

  function openEditDoc(doc: KnowledgeDoc) {
    setDocDraft({ id: doc.id, title: doc.title, answer: doc.answer, type: doc.type, language: doc.language, status: doc.status });
  }

  function saveDoc() {
    if (!docDraft?.title.trim() || !docDraft.answer.trim()) return;
    if (docDraft.id) {
      setDocs((current) => current.map((doc) => doc.id === docDraft.id ? { ...doc, ...docDraft, id: doc.id } : doc));
    } else {
      setDocs((current) => [{ id: `d_${Date.now()}`, baseId: activeBase?.id ?? activeBaseId, hits: 0, ...docDraft }, ...current]);
    }
    setDocDraft(null);
  }

  function toggleGroup(groupId: string) {
    setExpandedGroups((current) => current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId]);
  }

  return (
    <V2Shell activeHref="/v2/knowledge" title="知识库">
      <div className="grid min-h-[calc(100dvh-176px)] gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2"><LibraryBig className="size-4" />知识库树</CardTitle>
            <CardDescription>第一级是分组，第二级是知识库。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={newGroupName} onChange={(event) => setNewGroupName(event.target.value)} placeholder="新分组" />
              <Button onClick={addGroup}><FolderPlus className="size-4" /></Button>
            </div>

            <div className="space-y-1">
              {groups.map((group) => {
                const expanded = expandedGroups.includes(group.id);
                const groupBases = bases.filter((base) => base.groupId === group.id);
                return (
                  <div key={group.id} className="rounded-xl">
                    <div className={cn("flex items-center rounded-lg px-2 py-2 text-sm", activeBaseId === "" && group.id === activeGroup.id ? "bg-slate-100 font-medium text-slate-950" : "text-slate-600")}>
                      <button
                        aria-label={expanded ? "收起分组" : "展开分组"}
                        className="flex size-7 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100"
                        onClick={() => toggleGroup(group.id)}
                      >
                        {expanded ? <ChevronDown className="size-4 shrink-0" /> : <ChevronRight className="size-4 shrink-0" />}
                      </button>
                      <button
                        className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg px-1 py-1 text-left"
                        onClick={() => {
                          setActiveGroupId(group.id);
                          setActiveBaseId("");
                          if (!expanded) toggleGroup(group.id);
                        }}
                      >
                        <span className="truncate">{group.name}</span>
                        <span className="ml-auto text-xs text-slate-400">{groupBases.length}</span>
                      </button>
                    </div>

                    {expanded && (
                      <div className="ml-4 border-l border-slate-200 pl-2">
                        {groupBases.map((base) => (
                          <button
                            key={base.id}
                            onClick={() => { setActiveGroupId(group.id); setActiveBaseId(base.id); }}
                            className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors", base.id === activeBase?.id ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100")}
                          >
                            <LibraryBig className="size-3.5 shrink-0" />
                            <span className="truncate">{base.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-4">
              <div className="text-xs text-slate-500">在「{activeGroup.name}」下新建知识库</div>
              <div className="flex gap-2">
                <Input value={newBaseName} onChange={(event) => setNewBaseName(event.target.value)} placeholder="知识库名称" />
                <Button onClick={addBase}><Plus className="size-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>{activeBase ? activeBase.name : activeGroup.name}</CardTitle>
                <CardDescription className="mt-2">
                  {activeBase ? `${activeBase.product} · ${activeBase.description}` : `${activeGroup.name} · 包含 ${activeGroupBases.length} 个知识库`}
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-full">{activeDocs.length} 条</Badge>
                <Button size="sm" onClick={openCreateDoc} disabled={!activeBase}><Plus className="size-4" />新增文档</Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex items-center gap-2 rounded-xl border px-3 md:w-80">
                <Search className="size-4 text-slate-400" />
                <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="h-9 border-0 px-0 shadow-none focus-visible:ring-0" placeholder="搜索文档或答案" />
              </div>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((item) => (
                  <button key={item} onClick={() => setStatusFilter(item)} className={cn("rounded-full border px-3 py-1.5 text-xs", statusFilter === item ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-600")}>{item}</button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="pl-4">标题 / 答案</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>语言</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">命中</TableHead>
                    <TableHead className="pr-4 text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="max-w-96 pl-4">
                        <div className="truncate font-medium">{doc.title}</div>
                        <div className="mt-1 truncate text-xs text-slate-500">{doc.answer}</div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="rounded-full">{doc.type}</Badge></TableCell>
                      <TableCell className="text-slate-600">{doc.language}</TableCell>
                      <TableCell><Badge variant={doc.status === "已发布" ? "default" : "outline"} className="rounded-full">{doc.status}</Badge></TableCell>
                      <TableCell className="text-right tabular-nums">{doc.hits}</TableCell>
                      <TableCell className="pr-4 text-right">
                        <div className="inline-flex gap-2">
                          <Button size="xs" variant="outline" onClick={() => openEditDoc(doc)}>编辑</Button>
                          <Button size="xs" variant={doc.status === "已发布" ? "outline" : "secondary"} onClick={() => setDocs((current) => current.map((entry) => entry.id === doc.id ? { ...entry, status: entry.status === "已发布" ? "草稿" : "已发布" } : entry))}>
                            {doc.status === "已发布" ? "下架" : "发布"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {!visibleDocs.length && <div className="border-t border-dashed p-8 text-center text-sm text-slate-500">这个知识库里没有匹配文档。</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Sheet open={Boolean(docDraft)} onOpenChange={(open) => !open && setDocDraft(null)}>
        <SheetContent side="right" className="w-full max-w-xl gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b p-5">
            <SheetTitle>{docDraft?.id ? "编辑文档" : "新增文档"}</SheetTitle>
            <SheetDescription>当前知识库：{activeBase ? activeBase.name : activeGroup.name}</SheetDescription>
          </SheetHeader>

          {docDraft && (
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
              <label className="block space-y-2 text-sm">
                <span className="text-slate-500">标题</span>
                <Input value={docDraft.title} onChange={(event) => setDocDraft({ ...docDraft, title: event.target.value })} />
              </label>

              <label className="block space-y-2 text-sm">
                <span className="text-slate-500">答案 / 内容</span>
                <Textarea value={docDraft.answer} onChange={(event) => setDocDraft({ ...docDraft, answer: event.target.value })} className="min-h-48 resize-none" />
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block space-y-2 text-sm">
                  <span className="text-slate-500">类型</span>
                  <select value={docDraft.type} onChange={(event) => setDocDraft({ ...docDraft, type: event.target.value as DocDraft["type"] })} className="h-9 w-full rounded-lg border bg-background px-2 text-sm outline-none">
                    {["FAQ", "政策", "规则", "模板"].map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <label className="block space-y-2 text-sm">
                  <span className="text-slate-500">语言</span>
                  <select value={docDraft.language} onChange={(event) => setDocDraft({ ...docDraft, language: event.target.value as DocDraft["language"] })} className="h-9 w-full rounded-lg border bg-background px-2 text-sm outline-none">
                    {["中文", "English", "Español"].map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <label className="block space-y-2 text-sm">
                  <span className="text-slate-500">状态</span>
                  <select value={docDraft.status} onChange={(event) => setDocDraft({ ...docDraft, status: event.target.value as DocDraft["status"] })} className="h-9 w-full rounded-lg border bg-background px-2 text-sm outline-none">
                    {["已发布", "待审核", "草稿"].map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
              </div>
            </div>
          )}

          <SheetFooter className="flex-row justify-end gap-2 border-t p-5">
            <Button variant="outline" onClick={() => setDocDraft(null)}>取消</Button>
            <Button onClick={saveDoc}>保存</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </V2Shell>
  );
}
