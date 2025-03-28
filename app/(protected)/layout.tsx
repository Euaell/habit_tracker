import getServerUser from "@/lib/auth/user-provider"

export default async function ProtectedLayout({ children }: Readonly<{ children?: React.ReactNode }>) {
    const user = await getServerUser();
    return (
        <>
            <h1>Protected Layout - {user.name}</h1>
            {children}
        </>
    )
}