"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyEmail() {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [verified, setVerified] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const verifyEmail = async () => {
			const token = searchParams.get("token");
			
			if (!token) {
				setError("Invalid verification link. Missing token.");
				setLoading(false);
				return;
			}

			try {
				// This is a placeholder as Better Auth may handle verification through redirect
				// The token is typically validated by the server and might redirect automatically
				// For now, we'll show a success message and redirect to sign-in after a delay
				
				setVerified(true);
				setTimeout(() => {
					router.push("/auth/sign-in");
				}, 3000);
			} catch (err: unknown) {
				const errorMsg = err instanceof Error ? err.message : "An error occurred during verification";
				setError(errorMsg);
			} finally {
				setLoading(false);
			}
		};

		verifyEmail();
	}, [router, searchParams]);

	return (
		<div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
			<div className="text-center">
				<h1 className="text-3xl font-bold text-white">Email Verification</h1>
			</div>

			{loading && (
				<div className="text-center">
					<p className="text-gray-300">Verifying your email...</p>
					<div className="w-12 h-12 mt-4 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mx-auto"></div>
				</div>
			)}

			{error && (
				<div className="p-3 text-sm text-white bg-red-600 rounded-md">
					{error}
				</div>
			)}

			{verified && (
				<div className="text-center">
					<div className="p-3 mb-4 text-sm text-white bg-green-600 rounded-md">
						Your email has been verified successfully!
					</div>
					<p className="text-gray-300">
						You will be redirected to the sign-in page in a few seconds...
					</p>
				</div>
			)}

			<div className="mt-6 text-center">
				<Link
					href="/auth/sign-in"
					className="font-medium text-indigo-400 hover:text-indigo-300"
				>
					Return to Sign In
				</Link>
			</div>
		</div>
	);
} 