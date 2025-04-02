import { redirect } from "next/navigation";
import getServerSession from "./auth-provider";

export default async function getServerUser() {
	const session = await getServerSession();
	if (!session) return redirect("/auth/sign-in");
	return session.user;
}
