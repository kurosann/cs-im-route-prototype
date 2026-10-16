const translations: Record<string, string> = {
  "你好，我昨天申请退款了。": "Hello, I applied for a refund yesterday.",
  "Hello, I applied for a refund yesterday.": "你好，我昨天申请了退款。",
  "订单退款还有多久处理？": "How long will the refund take?",
  "How long will the refund take?": "订单退款还有多久处理？",
  "请问发票可以重发吗？": "Could you resend the invoice, please?",
  "Could you resend the invoice, please?": "请问发票可以重发吗？",
  "账号被锁了，需要解一下。": "My account is locked and needs to be unlocked.",
  "My account is locked and needs to be unlocked.": "账号被锁了，需要解一下。",
  "好的，我现在帮您确认。": "Okay, I'll check it for you now.",
  "Okay, I'll check it for you now.": "好的，我现在帮您确认。",
  "请稍等，我正在查询。": "Please wait a moment, I'm checking.",
  "Please wait a moment, I'm checking.": "请稍等，我正在查询。",
  "我已转给专员处理。": "I've forwarded this to the specialist.",
  "I've forwarded this to the specialist.": "我已转给专员处理。",
  "问题已解决，请确认。": "The issue is resolved, please confirm.",
  "The issue is resolved, please confirm.": "问题已解决，请确认。",
};

const wordRules: Array<[RegExp, string]> = [
  [/你好/g, "Hello"],
  [/昨天/g, "yesterday"],
  [/申请/g, "applied for"],
  [/退款/g, "refund"],
  [/订单/g, "order"],
  [/多久/g, "how long"],
  [/处理/g, "handle"],
  [/请问/g, "Could you"],
  [/发票/g, "invoice"],
  [/重发/g, "resend"],
  [/账号/g, "account"],
  [/锁/g, "locked"],
  [/需要/g, "needs to"],
  [/解一下/g, "unlock"],
  [/好的/g, "Okay"],
  [/现在/g, "now"],
  [/帮您/g, "help you"],
  [/确认/g, "confirm"],
  [/请/g, "please"],
  [/稍等/g, "wait a moment"],
  [/正在/g, "am"],
  [/查询/g, "checking"],
  [/已/g, "have"],
  [/转给/g, "forwarded to"],
  [/专员/g, "specialist"],
  [/问题/g, "issue"],
  [/解决/g, "resolved"],
  [/我/g, "I"],
];

const reverseWordRules: Array<[RegExp, string]> = [
  [/Hello/gi, "你好"],
  [/yesterday/gi, "昨天"],
  [/applied for/gi, "申请"],
  [/refund/gi, "退款"],
  [/order/gi, "订单"],
  [/how long/gi, "多久"],
  [/handle/gi, "处理"],
  [/Could you/gi, "请问"],
  [/invoice/gi, "发票"],
  [/resend/gi, "重发"],
  [/account/gi, "账号"],
  [/locked/gi, "锁"],
  [/needs to/gi, "需要"],
  [/unlock/gi, "解一下"],
  [/Okay/gi, "好的"],
  [/now/gi, "现在"],
  [/help you/gi, "帮您"],
  [/confirm/gi, "确认"],
  [/please/gi, "请"],
  [/wait a moment/gi, "稍等"],
  [/checking/gi, "查询"],
  [/have/gi, "已"],
  [/forwarded to/gi, "转给"],
  [/specialist/gi, "专员"],
  [/issue/gi, "问题"],
  [/resolved/gi, "解决"],
  [/I/gi, "我"],
];

export function quickTranslate(text: string): string {
  const value = text.trim();
  if (!value) return "";
  if (translations[value]) return translations[value];

  const isChinese = /[\u4e00-\u9fff]/.test(value);
  const rules = isChinese ? wordRules : reverseWordRules;
  let translated = value;
  for (const [pattern, replacement] of rules) {
    translated = translated.replace(pattern, replacement);
  }
  return translated.replace(/[，。]/g, (match) => (match === "，" ? ", " : "."));
}
