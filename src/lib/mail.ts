import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  // Fallback to localhost if not set
  const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const confirmLink = `${domain}/verify-email?token=${token}`;

  await resend.emails.send({
    from: "Psicolab <no-reply@psicolab.org>",
    to: email,
    subject: "Confirmá tu email en Psicolab",
    text: `
Hola,

Gracias por registrarte en Psicolab.

Para confirmar tu email, abrí este enlace:
${confirmLink}

Si no fuiste vos, podés ignorar este mensaje.

— Psicolab
https://psicolab.org
`,
    html: `
<p>Hola,</p>
<p>Gracias por registrarte en <strong>Psicolab</strong>.</p>
<p>Para confirmar tu email, hacé click acá:</p>
<p><a href="${confirmLink}">Confirmar email</a></p>
<p>Si no fuiste vos, podés ignorar este mensaje.</p>
<p>— Psicolab<br/>https://psicolab.org</p>
`
  });
};
