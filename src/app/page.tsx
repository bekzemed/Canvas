import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center">
      <Link href="/poster">
        <button
          type="button"
          className="py-6 px-8 bg-blue-600 text-3xl m-auto text-white rounded-full"
        >
          Go To Canvas Editor Test
        </button>
      </Link>
    </main>
  );
}
