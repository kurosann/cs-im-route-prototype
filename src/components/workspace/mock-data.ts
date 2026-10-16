export type PageId =
  | "conversations"
  | "chat"
  | "apps"
  | "channels"
  | "ai"
  | "webhook"
  | "logs"
  | "settings";

export type Role = "agent" | "developer" | "admin";

export type Conversation = {
  id: string;
  customer: string;
  customerId: string;
  app: string;
  lastMessage: string;
  status: "waiting" | "ai" | "agent";
  owner: string;
  time: string;
  unread: number;
  unreplied: boolean;
  messages: {
    id: string;
    role: "customer" | "agent" | "ai" | "system";
    text: string;
    time: string;
  }[];
};

export const initialConversations: Conversation[] = [
  {
    id: "conv_221904",
    customer: "李然",
    customerId: "cus_38291",
    app: "WhatsApp",
    lastMessage: "订单退款还有多久处理？",
    status: "waiting",
    owner: "未认领",
    time: "12:32",
    unread: 3,
    unreplied: true,
    messages: [
      { id: "m2", role: "customer", text: "你好，我昨天申请退款了。", time: "12:29" },
      { id: "m3", role: "ai", text: "已经帮您登记，请在 15:20 前留意到账提醒。", time: "12:30" },
      { id: "m4", role: "customer", text: "订单退款还有多久处理？", time: "12:32" },
      { id: "m5", role: "ai", text: "当前订单已进入财务复核，预计 1-2 个工作日到账。需要我继续跟进吗？", time: "12:32" },
    ],
  },
  {
    id: "conv_221901",
    customer: "Maya",
    customerId: "cus_77210",
    app: "Telegram",
    lastMessage: "请问发票可以重发吗？",
    status: "ai",
    owner: "AI",
    time: "12:28",
    unread: 0,
    unreplied: false,
    messages: [
      { id: "m1", role: "customer", text: "请问发票可以重发吗？", time: "12:28" },
      { id: "m2", role: "ai", text: "可以，已发送到您的注册邮箱。", time: "12:28" },
    ],
  },
  {
    id: "conv_221900",
    customer: "老王",
    customerId: "cus_12008",
    app: "Messenger",
    lastMessage: "账号被锁了，需要解一下。",
    status: "agent",
    owner: "张晓",
    time: "12:19",
    unread: 1,
    unreplied: true,
    messages: [
      { id: "m1", role: "customer", text: "账号被锁了，需要解一下。", time: "12:19" },
      { id: "m2", role: "agent", text: "您好，我正在帮您检查账号状态。", time: "12:20" },
    ],
  },
];

export const rolePages: Record<Role, PageId[]> = {
  agent: ["conversations", "chat"],
  developer: ["apps", "channels", "webhook", "logs"],
  admin: ["conversations", "chat", "apps", "channels", "ai", "webhook", "logs", "settings"],
};

export const pageTitles: Record<PageId, string> = {
  conversations: "会话",
  chat: "聊天室",
  apps: "业务渠道",
  channels: "转发渠道",
  ai: "AI 客服",
  webhook: "Webhook",
  logs: "消息日志",
  settings: "设置",
};
