import getServerSession from "@/lib/auth/auth-provider";
import SignOutButton from "@/components/SignOutButton";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
	const session = await getServerSession();
	const user = session?.user;

	return (
		<div className="w-full max-w-2xl p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold text-white">Your Profile</h1>
				<Link 
					href="/"
					className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
				>
					Back to Dashboard
				</Link>
			</div>

			{user ? (
				<div className="space-y-6">
					<div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
						{user.image ? (
							<div className="relative w-32 h-32 overflow-hidden rounded-full">
								<Image 
									src={user.image} 
									alt={user.name || "Profile"} 
									fill
									className="object-cover"
								/>
							</div>
						) : (
							<div className="flex items-center justify-center w-32 h-32 rounded-full bg-indigo-600">
								<span className="text-3xl font-bold text-white">
									{user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
								</span>
							</div>
						)}
						
						<div className="flex-1 space-y-4">
							<div>
								<h2 className="text-xl font-semibold text-white">{user.name || "User"}</h2>
								<p className="text-gray-400">{user.email}</p>
							</div>
							
							<div className="pt-4">
								<SignOutButton />
							</div>
						</div>
					</div>
					
					<div className="mt-8 pt-8 border-t border-gray-700">
						<h3 className="text-lg font-medium text-white mb-4">Account Information</h3>
						<div className="grid grid-cols-1 gap-4">
							{user.emailVerified ? (
								<div className="flex items-center gap-2 text-green-400">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
									</svg>
									<span>Email verified</span>
								</div>
							) : (
								<div className="flex items-center gap-2 text-yellow-400">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
									</svg>
									<span>Email not verified</span>
								</div>
							)}
							
							<div className="text-gray-400">
								<span className="font-medium text-gray-300">Account created:</span> {" "}
								{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="p-4 text-center text-gray-400">
					<p>You must be signed in to view this page.</p>
					<Link 
						href="/auth/sign-in" 
						className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
					>
						Sign In
					</Link>
				</div>
			)}
		</div>
	);
}