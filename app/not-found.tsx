import Link from "next/link";
import FullPageMessageLayout from "@/components/FullPageMessageLayout";

// app/not-found.tsx
export default function NotFound() {
  return (
    <FullPageMessageLayout
      icon={
        <svg
          className="w-16 h-16 text-primary"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.376.202 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.339 4.687-4.565 4.927.359.309.678.92.678 1.853 0 1.338-.012 2.419-.012 2.747 0 .267.18.577.688.48C17.138 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z"
            clipRule="evenodd"
          />
        </svg>
      }
      title="404 - Page Not Found"
      subtitle="Oops! The page you're looking for doesn't exist or has been moved."
    >
      {/* Back to Home Button */}
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary/80 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Go Back Home
      </Link>
    </FullPageMessageLayout>
  );
}
