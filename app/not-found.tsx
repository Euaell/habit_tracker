import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-6xl font-bold text-indigo-500">404</h1>
        <h2 className="text-3xl font-semibold text-white">Page Not Found</h2>
        <p className="text-gray-400 mt-2">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="px-5 py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 