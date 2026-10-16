export type KnowledgeDoc = {
  id: string;
  baseId: string;
  title: string;
  type: "FAQ" | "政策" | "规则" | "模板";
  language: "中文" | "English" | "Español";
  status: "已发布" | "待审核" | "草稿";
  answer: string;
  hits: number;
};

export type KnowledgeBase = {
  id: string;
  groupId: string;
  name: string;
  product: string;
  description: string;
};

export type KnowledgeGroup = {
  id: string;
  name: string;
};

export const initialKnowledgeGroups: KnowledgeGroup[] = [
  { id: "g1", name: "电商产品线" },
  { id: "g2", name: "会员产品线" },
  { id: "g3", name: "海外产品线" },
];

export const initialKnowledgeBases: KnowledgeBase[] = [
  { id: "kb1", groupId: "g1", name: "商品与库存库", product: "电商主站", description: "商品参数、活动规则、库存和发货。" },
  { id: "kb2", groupId: "g1", name: "售后政策库", product: "电商主站", description: "退款、退货、换货和赔付边界。" },
  { id: "kb3", groupId: "g2", name: "会员权益库", product: "星辰会员", description: "等级规则、折扣、券包和续费。" },
  { id: "kb4", groupId: "g3", name: "海外售后库", product: "Global Store", description: "English / Español refund and logistics policies." },
];

export const initialKnowledgeDocs: KnowledgeDoc[] = [
  { id: "d1", baseId: "kb1", title: "春节发货时间", type: "FAQ", language: "中文", status: "已发布", answer: "春节期间只发货预付订单，2 月 8 日恢复全部发货。", hits: 186 },
  { id: "d2", baseId: "kb1", title: "商品优惠叠加规则", type: "规则", language: "中文", status: "已发布", answer: "限时折扣与优惠券可叠加，会员折不可叠加。", hits: 92 },
  { id: "d3", baseId: "kb2", title: "退款多久到账？", type: "FAQ", language: "中文", status: "已发布", answer: "原路退回，1-2 个工作日到账。", hits: 268 },
  { id: "d4", baseId: "kb2", title: "退货流程", type: "模板", language: "中文", status: "已发布", answer: "请提供订单号和商品照片，审核通过后生成退货码。", hits: 141 },
  { id: "d5", baseId: "kb3", title: "会员权益表", type: "规则", language: "中文", status: "待审核", answer: "普通会员 95 折，黑卡会员 88 折。", hits: 34 },
  { id: "d6", baseId: "kb3", title: "会员券包使用", type: "FAQ", language: "中文", status: "草稿", answer: "券包每月 1 日刷新，过期券不可补发。", hits: 0 },
  { id: "d7", baseId: "kb4", title: "Refund policy", type: "政策", language: "English", status: "已发布", answer: "Refunds return to the original payment method within 1-2 business days.", hits: 121 },
  { id: "d8", baseId: "kb4", title: "Política de reembolso", type: "政策", language: "Español", status: "已发布", answer: "El reembolso llega en 1-2 días hábiles.", hits: 78 },
];
