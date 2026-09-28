interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL?: string;
  ALLOWED_ORIGINS?: string;
}

const DEFAULT_ALLOWED_ORIGINS = [
  "https://ax-center.github.io",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const FIELD_LIMITS = {
  name: 100,
  organization: 150,
  email: 254,
  phone: 40,
  subject: 200,
  message: 5000,
} as const;

type ContactField = keyof typeof FIELD_LIMITS;
type ContactFields = Record<ContactField, string>;

function allowedOrigins(env: Env) {
  return (env.ALLOWED_ORIGINS ?? DEFAULT_ALLOWED_ORIGINS.join(","))
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string) {
  return Response.json(body, {
    status,
    headers: corsHeaders(origin),
  });
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ ok: true });
    }

    const origin = (request.headers.get("Origin") ?? "").replace(/\/$/, "");
    if (!origin || !allowedOrigins(env).includes(origin)) {
      return Response.json({ error: "origin_not_allowed" }, { status: 403 });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST" || url.pathname !== "/contact") {
      return json({ error: "not_found" }, 404, origin);
    }

    const contentLength = Number(request.headers.get("Content-Length") ?? 0);
    if (contentLength > 32_768) {
      return json({ error: "payload_too_large" }, 413, origin);
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return json({ error: "invalid_form" }, 400, origin);
    }

    // Hidden field: bots commonly fill it, humans never should.
    if (String(form.get("website") ?? "").trim()) {
      return json({ ok: true }, 200, origin);
    }

    const fields = Object.fromEntries(
      (Object.keys(FIELD_LIMITS) as ContactField[]).map((key) => [
        key,
        String(form.get(key) ?? "").trim(),
      ]),
    ) as ContactFields;

    if (Object.values(fields).some((value) => !value)) {
      return json({ error: "missing_fields" }, 400, origin);
    }

    const tooLong = (Object.keys(FIELD_LIMITS) as ContactField[]).some(
      (key) => fields[key].length > FIELD_LIMITS[key],
    );
    if (tooLong || !isValidEmail(fields.email)) {
      return json({ error: "invalid_fields" }, 400, origin);
    }

    if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
      console.error("Contact Worker is missing required email configuration.");
      return json({ error: "mail_not_configured" }, 503, origin);
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL || "AI Accelerator <onboarding@resend.dev>",
        to: [env.CONTACT_TO_EMAIL],
        reply_to: fields.email,
        subject: `[AI 가속기 문의] ${fields.subject}`,
        text: [
          `이름/직위: ${fields.name}`,
          `기관/부서: ${fields.organization}`,
          `이메일: ${fields.email}`,
          `전화번호: ${fields.phone}`,
          "",
          fields.message,
        ].join("\n"),
      }),
    });

    if (!response.ok) {
      console.error("Resend rejected a contact email.", response.status);
      return json({ error: "mail_failed" }, 502, origin);
    }

    return json({ ok: true }, 200, origin);
  },
} satisfies ExportedHandler<Env>;
