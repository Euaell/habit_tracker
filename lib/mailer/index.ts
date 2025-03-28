
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"


interface EmailProps {
	to: string,
	subject: string,
	content: string
}


export async function sendEmail({ to, subject, content }: EmailProps) {
	try {
		const transport = nodemailer.createTransport({
			host: process.env.NODE_MAILER_HOST!,
			port: Number(process.env.NODE_MAILER_PORT),
			auth: {
				user: process.env.NODE_MAILER_USER,
				pass: process.env.NODE_MAILER_PASS
			}
		} as SMTPTransport.Options);

		// Compose email options
		const mailOptions = {
			from: 'Habit Tracker <euaelesh@gmail.com>',
			to: to,
			subject: subject,
			html: content
		}

		// Send the email
		const mailresponse = await transport.sendMail(mailOptions);
		return mailresponse
	   
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		throw new Error(error.message);
	}
}
