export default function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="h-16 rounded-2xl bg-[#fbbf24] px-5 text-lg font-black text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? "Submitting..." : "Submit Spray Foam Job Log"}
    </button>
  );
}
