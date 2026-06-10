// api/contact/route.ts
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
      subject: `[VIE+] ${"⭐".repeat(rating)}${"☆".repeat(5 - rating)} Message de ${firstName} ${lastName}`,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

                  <tr>
                    <td align="center" style="padding:32px 40px;">
                      <img src="https://vie-plus.vercel.app/icon.svg" width="48" height="48" alt="VIE+" style="display:block;margin:0 auto 12px auto;"/>
                      <span style="font-size:20px;font-weight:700;color:#e2e8f0;letter-spacing:-0.5px;">VIE+</span>
                    </td>
                  </tr>

                  <tr>
                    <td style="background-color:#1e293b;border-radius:16px;border:1px solid #334155;">
                      <table width="100%" cellpadding="0" cellspacing="0">

                        <tr>
                          <td style="height:3px;background:linear-gradient(90deg,#0891b2,#6366f1);border-radius:16px 16px 0 0;"></td>
                        </tr>

                        <tr>
                          <td style="padding:32px 40px;">

                            <p style="margin:0 0 24px 0;font-size:18px;font-weight:600;color:#e2e8f0;">
                              Nouveau message reçu
                            </p>

                            <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                              <tr>
                                <td style="background-color:#0f172a;border:1px solid #334155;border-radius:8px;padding:10px 16px;">
                                  <span style="font-size:20px;">${"⭐".repeat(rating)}${"☆".repeat(5 - rating)}</span>
                                  <span style="font-size:13px;color:#94a3b8;margin-left:8px;">${rating}/5</span>
                                </td>
                              </tr>
                            </table>

                            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;border-radius:8px;border:1px solid #334155;">
                              <tr style="background-color:#0f172a;">
                                <td style="padding:10px 16px;width:80px;">
                                  <span style="font-size:12px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Nom</span>
                                </td>
                                <td style="padding:10px 16px;border-left:1px solid #334155;">
                                  <span style="font-size:14px;color:#e2e8f0;">${lastName} ${firstName}</span>
                                </td>
                              </tr>
                              <tr style="background-color:#1e293b;">
                                <td style="padding:10px 16px;">
                                  <span style="font-size:12px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Email</span>
                                </td>
                                <td style="padding:10px 16px;border-left:1px solid #334155;">
                                  <a href="mailto:${email}" style="font-size:14px;color:#22d3ee;text-decoration:none;">${email}</a>
                                </td>
                              </tr>
                            </table>

                            <p style="margin:0 0 8px 0;font-size:12px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">
                              Message
                            </p>
                            <div style="background-color:#0f172a;border:1px solid #334155;border-radius:8px;padding:16px;">
                              <p style="margin:0;font-size:16px;color:#f1f5f9;line-height:1.8;font-weight:400;">
                                ${message.replace(/\n/g, "<br/>")}
                              </p>
                            </div>

                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding:24px 40px;">
                      <p style="margin:0;font-size:11px;color:#475569;">
                        VIE+ · Message reçu via le formulaire de contact
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
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