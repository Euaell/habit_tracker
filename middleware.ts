import { NextRequest, NextResponse } from "next/server";
import getServerSession from "@/lib/auth/auth-provider";

const PUBLIC_ROUTES = ["/auth"];
export async function middleware(request: NextRequest) {
	const { url } = request;
	for(const route of PUBLIC_ROUTES) {
		if(url.toLowerCase().startsWith(route.toLowerCase())) {
			return NextResponse.next();
		}
	}

	const session = await getServerSession();
 
	if(!session) {
		return NextResponse.redirect(new URL("/auth/sign-in", request.url));
	}
 
	return NextResponse.next();
}
 
export const config = {
	runtime: "nodejs",
	matcher: [],
};
