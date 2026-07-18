// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .max(50, "Prénom trop long."),
  lastName: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(50, "Nom trop long."),
  email: z
    .string()
    .trim()
    .email("Adresse e-mail invalide.")
    .max(254, "Adresse e-mail trop longue."),
  message: z
    .string()
    .trim()
    .min(10, "Le message doit contenir au moins 10 caractères.")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères."),
  rating: z
    .number()
    .min(1, "Une note est requise.")
    .max(5, "Note invalide."),
  // Honeypot : champ invisible côté UI, doit rester vide.
  // Les bots qui remplissent tous les inputs du formulaire le rempliront aussi.
  website: z.string().optional().default(""),
});

// Empêche l'injection de headers SMTP via des retours à la ligne / caractères
// de contrôle dans firstName ou lastName (utilisés dans le subject de l'email).
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n\t\x00-\x1F\x7F]/g, "").trim();
}

export async function POST(req: NextRequest) {
  try {
    // ── 1. Rate limiting (best-effort) ──
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessaie dans quelques minutes." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 60) },
        }
      );
    }

    // ── 2. Config serveur ──
    const recipientEmail = process.env.CONTACT_EMAIL_TO;
    if (!recipientEmail) {
      console.error("[contact] CONTACT_EMAIL_TO manquant.");
      return NextResponse.json(
        { error: "Erreur de configuration serveur." },
        { status: 500 }
      );
    }
    if (!process.env.RESEND_API_KEY) {
      console.error("[contact] RESEND_API_KEY manquant.");
      return NextResponse.json(
        { error: "Erreur de configuration serveur." },
        { status: 500 }
      );
    }

    // ── 3. Parsing + validation ──
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Corps de requête invalide." },
        { status: 400 }
      );
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const { firstName, lastName, email, message, rating, website } = parsed.data;

    // ── 4. Honeypot ──
    if (website.length > 0) {
      console.warn(`[contact] Honeypot déclenché depuis ${ip}.`);
      // Réponse "succès" pour ne pas révéler au bot qu'il a été détecté.
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // ── 5. Sanitisation anti header-injection ──
    const safeFirstName = sanitizeHeaderValue(firstName);
    const safeLastName = sanitizeHeaderValue(lastName);

    if (safeFirstName.length < 2 || safeLastName.length < 2) {
      return NextResponse.json(
        { error: "Le prénom ou le nom contient des caractères invalides." },
        { status: 422 }
      );
    }

    // ── 6. Envoi ──
    const stars = "⭐".repeat(rating) + "☆".repeat(5 - rating);

    await resend.emails.send({
      from: "VIE+ Contact <onboarding@resend.dev>",
      to: recipientEmail,
      replyTo: email,
      subject: `[VIE+] ${stars} Message de ${safeFirstName} ${safeLastName}`,
      text: [
        `Nom      : ${safeLastName} ${safeFirstName}`,
        `Email    : ${email}`,
        `Note     : ${stars} (${rating}/5)`,
        ``,
        `Message :`,
        message,
      ].join("\n"),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[contact] Erreur :", err);
    return NextResponse.json(
      { error: "L'envoi a échoué. Réessaie dans quelques instants." },
      { status: 502 }
    );
  }
}