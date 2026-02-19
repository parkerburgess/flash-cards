import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";

export default function HomePage() {
  return (
    <PageWrapper title="Welcome to Flash Cards">
      <p className="text-gray-600 mb-8">
        Use the navigation above to get started. Here&apos;s a quick overview of each section:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NavCard
          href="/manage"
          title="Manage"
          description="Create, edit, and delete flash cards and categories."
          color="bg-indigo-100 border-indigo-300"
        />
        <NavCard
          href="/study"
          title="Study"
          description="Review your cards or run a practice mock test."
          color="bg-green-100 border-green-300"
        />
        <NavCard
          href="/test"
          title="Test"
          description="Take a real test in Count or Survival mode. Results are saved."
          color="bg-yellow-100 border-yellow-300"
        />
        <NavCard
          href="/report"
          title="Report"
          description="View your test history, scores, and most-missed cards."
          color="bg-red-100 border-red-300"
        />
      </div>
    </PageWrapper>
  );
}

function NavCard({
  href,
  title,
  description,
  color,
}: {
  href: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className={`block border rounded-lg p-5 ${color} hover:shadow-md transition-shadow`}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
