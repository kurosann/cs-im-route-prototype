"use client";

import {
  Ban,
  Plus,
  Search,
} from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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

type UserStatus = "active" | "disabled";

type IamUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  teams: string[];
  lastActiveAt: string;
};

type IamRole = {
  id: string;
  name: string;
  description: string;
  builtin: boolean;
  permissions: string[];
  memberCount: number;
};

const permissionGroups = [
  {
    title: "团队与凭证",
    scopes: [
      { key: "iam:user:manage", label: "管理员工与角色" },
      { key: "iam:token:manage", label: "管理渠道接入" },
    ],
  },
  {
    title: "会话",
    scopes: [
      { key: "conversation:read", label: "查看会话" },
      { key: "conversation:manage", label: "接管与分配会话" },
      { key: "message:send:agent", label: "发送客服消息" },
    ],
  },
  {
    title: "渠道",
    scopes: [
      { key: "channel:access", label: "发送客户消息" },
      { key: "webhook:manage", label: "管理 Webhook" },
    ],
  },
  {
    title: "安全",
    scopes: [
      { key: "audit:read", label: "查看审计事件" },
      { key: "admin:access", label: "访问平台管理" },
    ],
  },
] as const;

const permissionLabels = new Map<string, string>(permissionGroups.flatMap((group) => group.scopes.map((scope) => [scope.key, scope.label])));

const initialUsers: IamUser[] = [
  { id: "usr_kuro", name: "Kuro", email: "kuro@example.com", role: "管理员", status: "active", teams: ["平台管理"], lastActiveAt: "3 分钟前" },
  { id: "usr_moyun", name: "莫云", email: "moyun@example.com", role: "主管", status: "active", teams: ["售前组", "售后组"], lastActiveAt: "32 分钟前" },
  { id: "usr_xkx", name: "许可欣", email: "xkx@example.com", role: "客服", status: "active", teams: ["售前组"], lastActiveAt: "1 小时前" },
  { id: "usr_lxd", name: "李向东", email: "lxd@example.com", role: "审计员", status: "disabled", teams: ["合规"], lastActiveAt: "3 天前" },
];

const initialRoles: IamRole[] = [
  {
    id: "role_admin",
    name: "管理员",
    description: "负责租户配置、员工账号和平台安全。",
    builtin: true,
    permissions: ["iam:user:manage", "iam:token:manage", "conversation:read", "conversation:manage", "message:send:agent", "webhook:manage", "audit:read", "admin:access"],
    memberCount: 3,
  },
  {
    id: "role_supervisor",
    name: "主管",
    description: "查看全租户会话、分配与接管会话。",
    builtin: true,
    permissions: ["conversation:read", "conversation:manage", "message:send:agent", "audit:read"],
    memberCount: 6,
  },
  {
    id: "role_agent",
    name: "客服",
    description: "只处理分配给自己的客户会话。",
    builtin: true,
    permissions: ["conversation:read", "message:send:agent"],
    memberCount: 21,
  },
  {
    id: "role_auditor",
    name: "审计员",
    description: "只读查看日志与审计事件。",
    builtin: false,
    permissions: ["conversation:read", "audit:read"],
    memberCount: 1,
  },
];

const statusText = {
  active: { label: "启用", className: "bg-emerald-50 text-emerald-700" },
  disabled: { label: "禁用", className: "bg-slate-100 text-slate-600" },
} as const;

const userFormDefaults: Omit<IamUser, "id"> = {
  name: "",
  email: "",
  role: "客服",
  status: "active",
  teams: [],
  lastActiveAt: "刚刚",
};

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border bg-muted/40 p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
            value === option.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: keyof typeof statusText }) {
  return <Badge variant="outline" className={cn("rounded-full border-transparent", statusText[status].className)}>{statusText[status].label}</Badge>;
}

function IamPageInner() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "users";
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [userQuery, setUserQuery] = useState("");
  const [roleQuery, setRoleQuery] = useState("");
  const [userEditorOpen, setUserEditorOpen] = useState(false);
  const [roleEditorOpen, setRoleEditorOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState(userFormDefaults);
  const [roleForm, setRoleForm] = useState({ name: "", description: "", permissions: [] as string[] });

  const filteredUsers = useMemo(() => {
    const query = userQuery.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => [user.name, user.email, user.role, ...user.teams].join(" ").toLowerCase().includes(query));
  }, [users, userQuery]);

  const filteredRoles = useMemo(() => {
    const query = roleQuery.trim().toLowerCase();
    if (!query) return roles;
    return roles.filter((role) => [role.name, role.description, ...role.permissions].join(" ").toLowerCase().includes(query));
  }, [roles, roleQuery]);

  function openEditUser(user: IamUser) {
    setEditingUserId(user.id);
    setUserForm({ ...user, teams: [...user.teams] });
    setUserEditorOpen(true);
  }

  function saveUser() {
    if (!userForm.name.trim() || !userForm.email.trim()) return;
    if (editingUserId) {
      setUsers((current) => current.map((user) => (user.id === editingUserId ? { ...user, ...userForm } : user)));
    } else {
      setUsers((current) => [{ ...userForm, id: `usr_${Date.now()}` }, ...current]);
    }
    setUserEditorOpen(false);
  }

  function toggleUserStatus(user: IamUser) {
    setUsers((current) => current.map((item) => (item.id === user.id ? { ...item, status: item.status === "active" ? "disabled" : "active" } : item)));
  }

  function openCreateRole() {
    setEditingRoleId(null);
    setRoleForm({ name: "", description: "", permissions: ["conversation:read"] });
    setRoleEditorOpen(true);
  }

  function openEditRole(role: IamRole) {
    setEditingRoleId(role.id);
    setRoleForm({ name: role.name, description: role.description, permissions: [...role.permissions] });
    setRoleEditorOpen(true);
  }

  function saveRole() {
    if (!roleForm.name.trim()) return;
    if (editingRoleId) {
      setRoles((current) => current.map((role) => (role.id === editingRoleId ? { ...role, ...roleForm } : role)));
    } else {
      setRoles((current) => [{ id: `role_${Date.now()}`, ...roleForm, builtin: false, memberCount: 0 }, ...current]);
    }
    setRoleEditorOpen(false);
  }

  function toggleRolePermission(permission: string) {
    setRoleForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission],
    }));
  }

  return (
  <V2Shell activeHref={`/iam?tab=${activeTab}`} title="团队管理">
      <div className="space-y-6">
          {activeTab === "users" && (
          <div className="mt-4">
            <Card className="rounded-3xl border-slate-200/70">
              <CardHeader className="flex flex-col gap-4 border-b border-slate-100 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>员工账号</CardTitle>
                  <CardDescription>员工使用角色访问工作台，角色决定可执行操作。</CardDescription>
                </div>
                <div className="relative w-full md:max-w-xs">
                  <Search className="pointer-events-none absolute top-2 left-2.5 size-4 text-muted-foreground" />
                  <Input value={userQuery} onChange={(event) => setUserQuery(event.target.value)} placeholder="搜索姓名、邮箱、角色或团队" className="pl-8" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>员工</TableHead>
                      <TableHead>角色</TableHead>
                      <TableHead>团队</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>最近活跃</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9"><AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback></Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell><div className="flex flex-wrap gap-1">{user.teams.length ? user.teams.map((team) => <Badge key={team} variant="secondary" className="rounded-full">{team}</Badge>) : "—"}</div></TableCell>
                        <TableCell><StatusBadge status={user.status} /></TableCell>
                        <TableCell className="text-muted-foreground">{user.lastActiveAt}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEditUser(user)}>编辑</Button>
                            <Button variant={user.status === "active" ? "ghost" : "outline"} size="sm" onClick={() => toggleUserStatus(user)}>
                              {user.status === "active" ? <><Ban className="size-4" />禁用</> : "启用"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          )}

          {activeTab === "roles" && (
          <div className="mt-4">
            <Card className="rounded-3xl border-slate-200/70">
              <CardHeader className="flex flex-col gap-4 border-b border-slate-100 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>角色模板</CardTitle>
                  <CardDescription>角色是一组预设权限，编辑后会同步到使用该角色的员工。</CardDescription>
                </div>
                <div className="flex w-full gap-2 md:max-w-sm">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute top-2 left-2.5 size-4 text-muted-foreground" />
                    <Input value={roleQuery} onChange={(event) => setRoleQuery(event.target.value)} placeholder="搜索角色或权限" className="pl-8" />
                  </div>
                  <Button onClick={openCreateRole}><Plus className="size-4" />角色</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>角色</TableHead>
                      <TableHead>成员</TableHead>
                      <TableHead>权限</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{role.name}</div>
                            {role.builtin ? <Badge variant="outline" className="rounded-full text-xs">内置</Badge> : null}
                          </div>
                          <div className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">{role.description}</div>
                        </TableCell>
                        <TableCell>{role.memberCount}</TableCell>
                        <TableCell>
                          <div className="flex max-w-xl flex-wrap gap-1">
                            {role.permissions.slice(0, 5).map((permission) => (
                              <Badge key={permission} variant="outline" className="max-w-64 rounded-full font-mono text-[11px]">{permissionLabels.get(permission) ?? permission}</Badge>
                            ))}
                            {role.permissions.length > 5 && (
                              <Badge variant="outline" className="rounded-full text-[11px] text-muted-foreground">+{role.permissions.length - 5}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => openEditRole(role)}>编辑权限</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

          </div>
          )}

      </div>

      <Sheet open={userEditorOpen} onOpenChange={setUserEditorOpen}>
        <SheetContent className="w-full overflow-y-auto p-6 sm:max-w-md">
          <SheetHeader className="p-0">
            <SheetTitle>{editingUserId ? "编辑员工" : "新建员工"}</SheetTitle>
            <SheetDescription>设置员工基础信息和角色。</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-5">
            <div className="space-y-2"><label className="text-sm font-medium">姓名</label><Input value={userForm.name} onChange={(event) => setUserForm({ ...userForm, name: event.target.value })} placeholder="输入姓名" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">邮箱</label><Input type="email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} placeholder="name@company.com" /></div>
            <div className="space-y-2">
              <label className="text-sm font-medium">角色</label>
              <Select value={userForm.role} onValueChange={(role) => setUserForm((current) => ({ ...current, role: String(role) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["管理员", "主管", "客服", "审计员"].map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-2">
              <label className="text-sm font-medium">状态</label>
              <Segmented value={userForm.status} options={[{ value: "active", label: "启用" }, { value: "disabled", label: "禁用" }]} onChange={(status) => setUserForm({ ...userForm, status })} />
            </div>
          </div>
          <SheetFooter className="p-0 pt-6"><Button onClick={saveUser}>保存</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={roleEditorOpen} onOpenChange={setRoleEditorOpen}>
        <SheetContent className="w-full overflow-y-auto p-6 sm:max-w-lg">
          <SheetHeader className="p-0">
            <SheetTitle>{editingRoleId ? "编辑角色权限" : "新建角色"}</SheetTitle>
            <SheetDescription>先用角色降低用户心智，最终授权仍会在资源边界校验。</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-5">
            <div className="space-y-2"><label className="text-sm font-medium">角色名称</label><Input value={roleForm.name} onChange={(event) => setRoleForm({ ...roleForm, name: event.target.value })} placeholder="例如：售后主管" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">描述</label><Input value={roleForm.description} onChange={(event) => setRoleForm({ ...roleForm, description: event.target.value })} placeholder="这个角色主要负责什么" /></div>
            <Separator />
            <div className="space-y-4">
              {permissionGroups.map((group) => (
                <div key={group.title} className="rounded-2xl border p-4">
                  <div className="text-sm font-medium">{group.title}</div>
                  <div className="mt-3 space-y-2">
                    {group.scopes.map((scope) => (
                      <label key={scope.key} className="flex items-center justify-between rounded-xl px-2 py-2 transition-colors hover:bg-muted/50">
                        <span>
                          <span className="block text-sm">{scope.label}</span>
                          <span className="block font-mono text-[11px] text-muted-foreground">{scope.key}</span>
                        </span>
                        <input type="checkbox" checked={roleForm.permissions.includes(scope.key)} onChange={() => toggleRolePermission(scope.key)} className="size-4 accent-slate-950" />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <SheetFooter className="p-0 pt-6"><Button onClick={saveRole}>保存权限</Button></SheetFooter>
        </SheetContent>
      </Sheet>

    </V2Shell>
  );
}

export default function IamPage() {
  return (
    <Suspense fallback={null}>
      <IamPageInner />
    </Suspense>
  );
}
