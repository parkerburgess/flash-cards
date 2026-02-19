import Link from "next/link";

interface Props {
  categoryId: string;
  label?: string;
}

export default function StudyLinkButton({ categoryId, label = "Study This Category" }: Props) {
  return (
    <Link
      href={`/study?categoryId=${categoryId}`}
      className="inline-block bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-indigo-700"
    >
      {label}
    </Link>
  );
}
