# 聚合客服系统设计规范

## 一、核心原则

1. **克制**：界面优先服务消息处理，不做花哨装饰。
2. **一致**：PC 端用 shadcn/ui，Flutter 端使用同一套颜色、状态和语义。
3. **可读**：文字层级清楚，重点状态一眼能看出来。
4. **状态优先**：在线、离线、失败、待处理、AI 已处理必须清晰。

---

## 二、颜色

PC 端和 Flutter 端使用同一组语义色。

### 基础色

| 语义 | 颜色 | 用途 |
| --- | --- | --- |
| Background | `#F8FAFC` | 页面背景 |
| Surface | `#FFFFFF` | 卡片、列表、聊天室底色 |
| Foreground | `#0F172A` | 主要文字 |
| Muted Foreground | `#64748B` | 次要文字 |
| Border | `#E2E8F0` | 边框和分割线 |
| Primary | `#2563EB` | 主按钮、当前项、链接 |
| Primary Foreground | `#FFFFFF` | 主按钮文字 |

### 状态色

| 语义 | 颜色 | 用途 |
| --- | --- | --- |
| Success | `#16A34A` | 在线、成功、已送达 |
| Warning | `#F59E0B` | 待处理、租约即将过期 |
| Destructive | `#DC2626` | 失败、错误、需紧急处理 |
| Info | `#0EA5E9` | AI 处理、提示信息 |

### 深色模式

后续统一支持，但 MVP 先不做。

Flutter 深色模式预留：

```text
background: #0B1120
surface: #111827
foreground: #F8FAFC
mutedForeground: #94A3B8
border: #1F2937
primary: #3B82F6
```

---

## 三、文字

PC 端字体：

```text
Inter / -apple-system / PingFang SC / Noto Sans SC
```

Flutter 端建议：

```text
Inter + PingFang SC + Noto Sans SC
```

### 字号

| 层级 | PC | Flutter |
| --- | ---: | ---: |
| 页面标题 | 24px | 22px |
| 卡片标题 | 16px | 16px |
| 正文 | 14px | 15px |
| 辅助文字 | 12px | 13px |
| 消息正文 | 14px | 16px |

---

## 四、组件对应关系

### 按钮

PC 端使用 shadcn/ui：

```text
Button
├── default：主操作，例如发送消息、保存配置
├── secondary：普通操作，例如打开筛选
├── outline：列表内轻操作
├── ghost：侧边栏、工具栏
└── destructive：禁用 App、删除配置、重置凭据
```

Flutter 端对应：

```text
PrimaryButton   -> shadcn default
SecondaryButton -> shadcn secondary
OutlineButton   -> shadcn outline
GhostButton     -> shadcn ghost
DangerButton    -> shadcn destructive
```

### 卡片

PC 端：

```text
Card + CardHeader + CardTitle + CardDescription + CardContent + CardFooter
```

Flutter 端：

```text
AppCard
├── padding: 16
├── radius: 16
├── background: surface
└── border: 1px solid border
```

### 输入框

PC 端使用：

```text
Input
Textarea
Select
Switch
Checkbox
Form
```

Flutter 端对应：

```text
AppTextField
AppTextArea
AppSelect
AppSwitch
AppCheckbox
AppFormSection
```

### 标签

PC 端使用 `Badge`。

Flutter 端使用 `AppBadge`。

常用状态：

```text
在线
离线
租约中
已过期
失败
重试中
AI 已处理
待人工
人工处理中
```

---

## 五、布局规则

### PC Web

```text
左侧导航：240px
右侧内容：自适应
内容最大宽度：1600px
页面间距：24px
卡片间距：16px
```

聊天室特殊布局：

```text
会话列表：320px
聊天区域：自适应
客户详情：360px
```

### Flutter

| 设备 | 布局 |
| --- | --- |
| 手机竖屏 | 单列，底部导航 3 个入口 |
| 平板 / 横屏 | 左侧列表 + 右侧详情 |
| Flutter Web | 参考 PC，但保持 Flutter 组件风格 |

底部导航：

```text
值守
状态
我的
```

---

## 六、消息样式

### 客户消息

PC 端靠左，使用 `Muted` 背景。

Flutter 端靠左，使用浅灰背景。

### 客服消息

PC 端靠右，使用 `Primary` 背景。

Flutter 端靠右，使用主题蓝背景。

### AI 消息

AI 消息要能看出来，但不能打断阅读。

统一使用：

```text
icon: Sparkles
color: Info
label: AI
```

### 系统事件

事件消息居中，例如：

```text
会话已转人工
AI 已停止接管
消息已转发到 Telegram
```

---

## 七、空状态

所有列表必须有空状态。

标准结构：

```text
图标
标题
一句话说明
主操作按钮（可选）
```

示例：

```text
还没有会话
当你接入业务渠道后，客户消息会出现在这里。
```
