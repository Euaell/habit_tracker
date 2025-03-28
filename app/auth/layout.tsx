import getServerSession from "@/lib/auth/auth-provider";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await getServerSession();
    if (session?.user) {
        redirect("/dashboard")
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {children}
        </div>
    );
}
