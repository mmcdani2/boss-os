export default function StatusMessage({
  tone,
  message,
}: {
  tone: "success" | "error";
  message: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={[
        "rounded-2xl px-4 py-3 text-sm font-medium",
        tone === "success"
          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
          : "border border-red-500/20 bg-red-500/10 text-red-200",
      ].join(" ")}
    >
      {message}
    </div>
  );
}
