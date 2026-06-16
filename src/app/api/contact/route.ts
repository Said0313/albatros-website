import { NextResponse } from "next/server";

interface Lead {
  name?: string;
  phone?: string;
  company?: string;
  comment?: string;
  product?: string;
}

function formatMessage(d: Lead): string {
  const lines = [
    "<b>Новая заявка с сайта</b>",
    d.product ? `Продукт: ${d.product}` : null,
    d.name ? `Имя: ${d.name}` : null,
    d.phone ? `Телефон: ${d.phone}` : null,
    d.company ? `Компания: ${d.company}` : null,
    d.comment ? `Комментарий: ${d.comment}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

export async function POST(request: Request) {
  const data: Lead = await request.json();

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // eslint-disable-next-line no-console
    console.log("Новая заявка (Telegram не настроен):", data);
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatMessage(data),
        parse_mode: "HTML",
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
