import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .max(50, "Prénom trop long."),
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(50, "Nom trop long."),
  email: z
    .string()
    .email("Adresse e-mail invalide.")
    .max(254, "Adresse e-mail trop longue."),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères.")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères."),
  rating: z
    .number()
    .min(1, "Une note est requise.")
    .max(5, "Note invalide."),
});

export async function POST(req: NextRequest) {
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

  const { firstName, lastName, email, message, rating } = parsed.data;

  const recipientEmail = process.env.CONTACT_EMAIL_TO;
  if (!recipientEmail) {
    console.error("[contact] CONTACT_EMAIL_TO manquant.");
    return NextResponse.json(
      { error: "Erreur de configuration serveur." },
      { status: 500 }
    );
  }

  // Génération visuelle des étoiles
  const stars = "⭐".repeat(rating) + "☆".repeat(5 - rating);

  try {
    await resend.emails.send({
      from: "VIE+ Contact <onboarding@resend.dev>",
      to: recipientEmail,
      replyTo: email,
      subject: `[VIE+] ${stars} Message de ${firstName} ${lastName}`,
      text: [
        `Nom      : ${lastName} ${firstName}`,
        `Email    : ${email}`,
        `Note     : ${stars} (${rating}/5)`,
        ``,
        `Message :`,
        message,
      ].join("\n"),
    });
  } catch (err) {
    console.error("[contact] Erreur Resend :", err);
    return NextResponse.json(
      { error: "L'envoi a échoué. Réessaie dans quelques instants." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}