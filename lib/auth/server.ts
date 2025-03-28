import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { sendEmail } from "@/lib/mailer"
 
const DB_URI = process.env.MONGODB_URI;
if(!DB_URI) {
	throw new Error("MONGODB_URI is not set");
}

const client = new MongoClient(DB_URI);
const db = client.db();

export const auth = betterAuth({
	advanced: {
		cookiePrefix: "habit_tracker_",
	},
	database: mongodbAdapter(db),
	emailVerification: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        sendVerificationEmail: async ({ user, url, token }, request) => {
            await sendEmail({
                to: user.email,
                subject: 'Verify your email address',
                content: `Click the link to verify your email: ${url}`
            })
        },
		sendOnSignUp: true,
		autoSignInAfterVerification: true
    },
	emailAndPassword: {
		enabled: true,
        // requireEmailVerification: true,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		sendResetPassword: async ({ user, url, token }, request) => {
            await sendEmail({
                to: user.email,
                subject: 'Reset your password',
                content: `Click the link to reset your password: ${url}`
            })
        }
    },
	account: {
        accountLinking: {
            enabled: true, 
        }
    },
})
