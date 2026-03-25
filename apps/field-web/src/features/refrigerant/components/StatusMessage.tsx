type Props = {
  tone: "success" | "error";
  message: string;
};

export default function StatusMessage({ tone, message }: Props) {
  if (!message) return null;

  const classes =
    tone === "success"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
      : "border-red-500/20 bg-red-500/10 text-red-200";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${classes}`}>
      {message}
    </div>
  );
}
