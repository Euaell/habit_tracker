import getServerUser from "@/lib/auth/user-provider"

export default async function ProtectedLayout({ children }: Readonly<{ children?: React.ReactNode }>) {
    await getServerUser();
    return children;
}