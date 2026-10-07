import Link from "next/link";

export default function ResultPage({
  searchParams
}: {
  searchParams: { success?: string; message?: string };
}) {
  const success = searchParams.success === "true";
  return (
    <section className="mx-auto max-w-md text-center">
      <h1 className="text-3xl font-bold">{success ? "Pass redeemed" : "Redemption failed"}</h1>
      <p className={`mt-4 rounded p-4 ${success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
        {searchParams.message ?? "No redemption result was provided."}
      </p>
      <Link className="mt-8 inline-block rounded border px-4 py-3 font-semibold" href="/redeem">Redeem another pass</Link>
    </section>
  );
}
