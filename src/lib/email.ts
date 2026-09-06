// Email helper — Resend via REST, fallback console log si aucune clé API.
// Config par variables d'environnement (dans .env.local) :
//   RESEND_API_KEY  : clé API Resend (si absente, les emails sont seulement loggés)
//   EMAIL_FROM      : expéditeur, ex "FuturCraft Institut <no-reply@futurcraft.bj>"
//   INTERNAL_EMAIL  : boîte de réception de l'équipe (alertes internes)

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const DEFAULT_FROM =
  process.env.EMAIL_FROM || "FuturCraft Institut <no-reply@futurcraft.bj>";
export const INTERNAL_EMAIL = process.env.INTERNAL_EMAIL || "contact@futurcraft.bj";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!RESEND_API_KEY) {
    console.log("[email:mode-demo] →", opts.to, "|", opts.subject);
    return { skipped: true, subject: opts.subject };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: DEFAULT_FROM,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:24px auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:20px 28px;">
        <div style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:0.5px;">FuturCraft Institut</div>
      </div>
      <div style="padding:28px;">
        <h1 style="margin:0 0 12px;font-size:20px;color:#0f172a;">${title}</h1>
        <div style="color:#334155;font-size:14px;line-height:1.7;">${body}</div>
        <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;">
          FuturCraft Institut — Cotonou, Bénin · formations numériques et d'avenir.
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function field(name: string, value: string): string {
  return `<tr><td style="padding:6px 10px;width:40%;font-weight:700;color:#0f172a;vertical-align:top;">${name}</td><td style="padding:6px 10px;color:#475569;">${value}</td></tr>`;
}

export async function sendInscriptionEmails(params: {
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  formationTitle: string;
  totalAmount: number;
  phone: string;
}) {
  const money = `${params.totalAmount.toLocaleString("fr-FR")} FCFA`;

  // Confirmation adressée à l'étudiant
  const studentHtml = layout(
    "Votre préinscription est enregistrée ✅",
    `<p>Bonjour <strong>${params.firstName} ${params.lastName}</strong>,</p>
     <p>Votre préinscription à la formation <strong>${params.formationTitle}</strong> est bien reçue.</p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0;border:1px solid #e2e8f0;border-radius:12px;">${field("N° matricule", params.studentNumber)}${field("Formation", params.formationTitle)}${field("Frais totaux", money)}${field("Contact", params.phone)}</table>
     <p>Connectez-vous à votre <a href="https://futurcraft.bj/espace-etudiant" style="color:#4f46e5;font-weight:700;">espace étudiant</a> avec votre matricule et votre téléphone pour régler vos frais en ligne (MTN MoMo / Moov Money) ou au guichet.</p>`
  );

  // Alerte interne à l'équipe
  const teamHtml = layout(
    "Nouvelle préinscription reçue",
    `<p>Une nouvelle préinscription vient d'être enregistrée :</p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0;border:1px solid #e2e8f0;border-radius:12px;">${field("Matricule", params.studentNumber)}${field("Étudiant", `${params.firstName} ${params.lastName}`)}${field("Formation", params.formationTitle)}${field("Total à percevoir", money)}${field("Téléphone", params.phone)}${field("Email", params.email)}</table>
     <p>Pensez à contacter rapidement le candidat pour finaliser les frais d'inscription.</p>`
  );

  if (params.email) {
    void sendEmail({ to: params.email, subject: "Préinscription confirmée — FuturCraft Institut", html: studentHtml }).catch((e) =>
      console.error("[email] échec confirmation étudiant:", e)
    );
  }
  void sendEmail({ to: INTERNAL_EMAIL, subject: "[FuturCraft] Nouvelle préinscription — " + params.studentNumber, html: teamHtml }).catch((e) =>
    console.error("[email] échec alerte interne:", e)
  );
}

export async function sendPartnershipEmail(params: {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  partnershipType: string;
  message?: string;
}) {
  const html = layout(
    "Nouvelle demande de partenariat",
    `<p>Une entreprise souhaite collaborer avec FuturCraft :</p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0;border:1px solid #e2e8f0;border-radius:12px;">${field("Entreprise", params.companyName)}${field("Contact", params.contactName)}${field("Email", params.email)}${field("Téléphone", params.phone)}${field("Type", params.partnershipType)}</table>
     ${params.message ? `<p><em>Message : ${params.message.replace(/\n/g, "<br/>")}</em></p>` : ""}`
  );
  void sendEmail({ to: INTERNAL_EMAIL, subject: `[FuturCraft] Partenariat — ${params.companyName}`, html }).catch((e) =>
    console.error("[email] échec alerte partenariat:", e)
  );
}