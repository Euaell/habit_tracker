"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const { data, error } = await authClient.signIn.email({
				email,
				password,
				rememberMe: true,
			});

			if (error) {
				setError(error.message || "Failed to sign in");
				return;
			}

			if (data) {
				router.push("/"); // Redirect to dashboard or home
			}
		} catch (err: unknown) {
			const errorMsg = err instanceof Error ? err.message : "An error occurred during sign in";
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
			<div className="text-center">
				<h1 className="text-3xl font-bold text-white">Sign In</h1>
				<p className="mt-2 text-gray-400">Welcome back to Habit Tracker</p>
			</div>

			{error && (
				<div className="p-3 text-sm text-white bg-red-600 rounded-md">
					{error}
				</div>
			)}

			<form onSubmit={handleSignIn} className="mt-8 space-y-6">
				<div>
					<label htmlFor="email" className="block text-sm font-medium text-gray-300">
						Email Address
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="email@example.com"
					/>
				</div>

				<div>
					<label htmlFor="password" className="block text-sm font-medium text-gray-300">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="••••••••"
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="text-sm">
						<Link
							href="/auth/forgot-password"
							className="font-medium text-indigo-400 hover:text-indigo-300"
						>
							Forgot your password?
						</Link>
					</div>
				</div>

				<div>
					<button
						type="submit"
						disabled={loading}
						className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						{loading ? "Signing in..." : "Sign in"}
					</button>
				</div>
			</form>

			<div className="mt-6">
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-600"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 text-gray-400 bg-gray-800">Or</span>
					</div>
				</div>

				<div className="mt-6 text-center">
					<p className="text-sm text-gray-400">
						Don&apos;t have an account?{" "}
						<Link href="/auth/sign-up" className="font-medium text-indigo-400 hover:text-indigo-300">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
