"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const router = useRouter();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccessMessage("");

		try {
			const { data, error } = await authClient.signUp.email({
				email,
				password,
				name,
			});

			if (error) {
				setError(error.message || "Failed to sign up");
				return;
			}

			if (data) {
				setSuccessMessage("Account created successfully! Please check your email for verification.");
				// Wait for 3 seconds before redirecting
				setTimeout(() => {
					router.push("/auth/sign-in");
				}, 3000);
			}
		} catch (err: unknown) {
			const errorMsg = err instanceof Error ? err.message : "An error occurred during sign up";
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
			<div className="text-center">
				<h1 className="text-3xl font-bold text-white">Create Account</h1>
				<p className="mt-2 text-gray-400">Start tracking your habits today</p>
			</div>

			{error && (
				<div className="p-3 text-sm text-white bg-red-600 rounded-md">
					{error}
				</div>
			)}

			{successMessage && (
				<div className="p-3 text-sm text-white bg-green-600 rounded-md">
					{successMessage}
				</div>
			)}

			<form onSubmit={handleSignUp} className="mt-8 space-y-6">
				<div>
					<label htmlFor="name" className="block text-sm font-medium text-gray-300">
						Full Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						autoComplete="name"
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="John Doe"
					/>
				</div>

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
						autoComplete="new-password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="••••••••"
					/>
					<p className="mt-1 text-xs text-gray-400">
						Password must be at least 8 characters
					</p>
				</div>

				<div>
					<button
						type="submit"
						disabled={loading}
						className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						{loading ? "Creating account..." : "Create account"}
					</button>
				</div>
			</form>

			<div className="mt-6 text-center">
				<p className="text-sm text-gray-400">
					Already have an account?{" "}
					<Link href="/auth/sign-in" className="font-medium text-indigo-400 hover:text-indigo-300">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
