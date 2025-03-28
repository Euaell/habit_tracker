"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";

export default function ResetPassword() {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [token, setToken] = useState<string | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const tokenParam = searchParams.get("token");
		if (!tokenParam) {
			setError("Invalid or missing reset token");
		} else {
			setToken(tokenParam);
		}
	}, [searchParams]);

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccessMessage("");

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		if (!token) {
			setError("Invalid or missing reset token");
			setLoading(false);
			return;
		}

		try {
			const { error } = await authClient.resetPassword({
				newPassword,
				token,
			});

			if (error) {
				setError(error.message || "Failed to reset password");
				return;
			}

			setSuccessMessage("Password reset successfully!");
			// Wait for 3 seconds before redirecting
			setTimeout(() => {
				router.push("/auth/sign-in");
			}, 3000);
		} catch (err: unknown) {
			const errorMsg = err instanceof Error ? err.message : "An error occurred";
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
			<div className="text-center">
				<h1 className="text-3xl font-bold text-white">Reset Password</h1>
				<p className="mt-2 text-gray-400">Enter your new password</p>
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

			<form onSubmit={handleResetPassword} className="mt-8 space-y-6">
				<div>
					<label
						htmlFor="newPassword"
						className="block text-sm font-medium text-gray-300"
					>
						New Password
					</label>
					<input
						id="newPassword"
						name="newPassword"
						type="password"
						autoComplete="new-password"
						required
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						className="block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="••••••••"
						minLength={8}
					/>
					<p className="mt-1 text-xs text-gray-400">
						Password must be at least 8 characters
					</p>
				</div>

				<div>
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-medium text-gray-300"
					>
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						autoComplete="new-password"
						required
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className="block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="••••••••"
						minLength={8}
					/>
				</div>

				<div>
					<button
						type="submit"
						disabled={loading || !token}
						className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
					>
						{loading ? "Resetting..." : "Reset Password"}
					</button>
				</div>
			</form>

			<div className="mt-6 text-center">
				<p className="text-sm text-gray-400">
					Remember your password?{" "}
					<Link
						href="/auth/sign-in"
						className="font-medium text-indigo-400 hover:text-indigo-300"
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
