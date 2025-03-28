import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
export async function middleware(request: NextRequest) {
	const { url } = request;
	if(PUBLIC_ROUTES.includes(url)) {
		return NextResponse.next();
	}

	const session = await auth.api.getSession({
		headers: await headers()
	})
 
	if(!session) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}
 
	return NextResponse.next();
}
 
export const config = {
	runtime: "nodejs",
	matcher: ["/dashboard", "/"], // Apply middleware to specific routes
};
