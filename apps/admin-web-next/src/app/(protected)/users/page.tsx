"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createUser,
  listUsers,
  resetUserPassword,
  updateUserStatus,
  type AdminUser,
} from "@/features/users/api";

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-400/80">
      {children}
    </p>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-[28px] border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.28)]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function InputLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "h-11 rounded-2xl border border-white/10 bg-black/30 px-4 text-[15px] text-white outline-none transition",
        "placeholder:text-white/25 focus:border-orange-400/60 focus:bg-black/40",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "h-11 rounded-2xl border border-white/10 bg-black/30 px-4 text-[15px] text-white outline-none transition",
        "focus:border-orange-400/60 focus:bg-black/40",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        active ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-white/55",
      ].join(" ")}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant = "secondary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "secondary" | "danger" | "primary";
}) {
  const styles =
    variant === "primary"
      ? "bg-orange-500 text-black hover:brightness-105"
      : variant === "danger"
        ? "border border-red-500/25 bg-red-500/10 text-red-200 hover:bg-red-500/15"
        : "border border-white/10 bg-white/[0.04] text-white/88 hover:bg-white/[0.08]";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex h-10 min-w-[140px] items-center justify-center rounded-2xl px-4 text-sm font-medium transition",
        "disabled:cursor-not-allowed disabled:opacity-60",
        styles,
      ].join(" ")}
    >
      <span className="truncate">{children}</span>
    </button>
  );
}

function UserRow({
  user,
  statusBusyId,
  passwordBusyId,
  onReset,
  onToggleStatus,
}: {
  user: AdminUser;
  statusBusyId: string | null;
  passwordBusyId: string | null;
  onReset: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
}) {
  const busyStatus = statusBusyId === user.id;
  const busyPassword = passwordBusyId === user.id;

  return (
    <div className="grid gap-4 border-t border-white/10 px-5 py-4 first:border-t-0 lg:grid-cols-[minmax(0,1.5fr)_120px_120px_300px] lg:items-center lg:gap-5">
      <div className="min-w-0">
        <div className="truncate text-[15px] font-semibold text-white">{user.fullName}</div>
        <div className="mt-1 truncate text-sm text-white/50">{user.email}</div>
      </div>

      <div className="text-sm text-white/75 lg:text-center">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35 lg:hidden">
          Role
        </div>
        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/75">
          {user.role}
        </span>
      </div>

      <div className="lg:text-center">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35 lg:hidden">
          Status
        </div>
        <StatusBadge active={user.isActive} />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:justify-self-end">
        <ActionButton
          disabled={busyStatus || busyPassword}
          onClick={() => onReset(user)}
          variant="secondary"
        >
          {busyPassword ? "Resetting..." : "Reset Password"}
        </ActionButton>

        <ActionButton
          disabled={busyStatus || busyPassword}
          onClick={() => onToggleStatus(user)}
          variant={user.isActive ? "danger" : "primary"}
        >
          {busyStatus ? "Updating..." : user.isActive ? "Deactivate" : "Reactivate"}
        </ActionButton>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusBusyId, setStatusBusyId] = useState<string | null>(null);
  const [passwordBusyId, setPasswordBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "tech">("tech");

  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState("");

  const activeCount = useMemo(() => users.filter((user) => user.isActive).length, [users]);
  const adminCount = useMemo(() => users.filter((user) => user.role === "admin").length, [users]);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      const rows = await listUsers();
      setUsers(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await createUser({
        fullName,
        email,
        password,
        role,
      });

      setFullName("");
      setEmail("");
      setPassword("");
      setRole("tech");
      setSuccess("User created successfully.");
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(user: AdminUser) {
    try {
      setStatusBusyId(user.id);
      setError("");
      setSuccess("");

      const updated = await updateUserStatus(user.id, !user.isActive);

      setUsers((current) =>
        current.map((row) => (row.id === updated.id ? updated : row))
      );

      setSuccess(
        updated.isActive
          ? updated.fullName + " reactivated."
          : updated.fullName + " deactivated."
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update user status."
      );
    } finally {
      setStatusBusyId(null);
    }
  }

  function openResetModal(user: AdminUser) {
    setResetTarget(user);
    setResetPasswordValue("");
    setError("");
    setSuccess("");
  }

  function closeResetModal() {
    if (passwordBusyId) return;
    setResetTarget(null);
    setResetPasswordValue("");
  }

  async function handleResetPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!resetTarget) return;

    const trimmed = resetPasswordValue.trim();

    if (trimmed.length < 8) {
      setError("Temporary password must be at least 8 characters.");
      setSuccess("");
      return;
    }

    try {
      setPasswordBusyId(resetTarget.id);
      setError("");
      setSuccess("");

      await resetUserPassword(resetTarget.id, trimmed);

      setSuccess(resetTarget.fullName + "'s password was reset.");
      setResetTarget(null);
      setResetPasswordValue("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reset password."
      );
    } finally {
      setPasswordBusyId(null);
    }
  }

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:h-full">
      <div className="mx-auto flex min-h-0 w-full flex-1 flex-col gap-4 lg:w-[90%]">
        <div className="shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(255,255,255,0.02))] px-7 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <SectionKicker>Access Management</SectionKicker>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-[2.2rem]">
                Users
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
                Create internal accounts, control access, and reset credentials without leaving the admin workspace.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:min-w-[360px]">
              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  Total Users
                </div>
                <div className="mt-2 text-[2rem] font-black leading-none text-white">{users.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  Active Users
                </div>
                <div className="mt-2 text-[2rem] font-black leading-none text-white">{activeCount}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  Admins
                </div>
                <div className="mt-2 text-[2rem] font-black leading-none text-orange-300">{adminCount}</div>
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="shrink-0 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="shrink-0 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200">
            {success}
          </div>
        ) : null}

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.6fr)]">
          <Card className="flex min-h-0 flex-col overflow-hidden">
            <div className="shrink-0 border-b border-white/10 px-6 py-5">
              <SectionKicker>Create User</SectionKicker>
              <h2 className="mt-2 text-2xl font-bold text-white">Create User</h2>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Add internal accounts, assign roles, and issue a temporary password for first sign-in.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-6 py-5">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <InputLabel>Full Name</InputLabel>
                  <TextInput
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Smith"
                  />
                </div>

                <div className="grid gap-2">
                  <InputLabel>Email</InputLabel>
                  <TextInput
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@company.com"
                    type="email"
                  />
                </div>

                <div className="grid gap-2">
                  <InputLabel>Temporary Password</InputLabel>
                  <TextInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    type="password"
                  />
                </div>

                <div className="grid gap-2">
                  <InputLabel>Role</InputLabel>
                  <SelectInput
                    value={role}
                    onChange={(e) => setRole(e.target.value as "admin" | "tech")}
                  >
                    <option value="tech">Tech</option>
                    <option value="admin">Admin</option>
                  </SelectInput>
                </div>
              </div>

              <div className="mt-auto pt-5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-bold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </Card>

          <Card className="flex min-h-0 flex-col overflow-hidden">
            <div className="shrink-0 border-b border-white/10 px-6 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="lg:text-left">
                  <SectionKicker>Directory</SectionKicker>
                  <h2 className="mt-2 text-2xl font-bold text-white">Current Users</h2>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    Review roles, manage account status, and issue password resets.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void loadUsers()}
                  className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/90 transition hover:bg-white/[0.08]"
                >
                  Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div className="px-6 py-6">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
                  Loading users...
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="px-6 py-10 text-center text-white/50">No users found.</div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="hidden shrink-0 grid-cols-[minmax(0,1.5fr)_120px_120px_300px] gap-5 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35 lg:grid">
                  <div className="lg:text-center">User</div>
                  <div className="text-center">Role</div>
                  <div className="text-center">Status</div>
                  <div className="text-center">Actions</div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                  {users.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      statusBusyId={statusBusyId}
                      passwordBusyId={passwordBusyId}
                      onReset={openResetModal}
                      onToggleStatus={(nextUser) => void handleToggleStatus(nextUser)}
                    />
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {resetTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close reset password modal"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeResetModal}
          />
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#171717] shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
            <div className="border-b border-white/10 px-6 py-6">
              <SectionKicker>Password Reset</SectionKicker>
              <h3 className="mt-3 text-2xl font-bold text-white">Reset Password</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Set a new temporary password for <span className="font-semibold text-white">{resetTarget.fullName}</span>.
              </p>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="grid gap-5 px-6 py-6">
              <div className="grid gap-2">
                <InputLabel>Temporary Password</InputLabel>
                <TextInput
                  value={resetPasswordValue}
                  onChange={(e) => setResetPasswordValue(e.target.value)}
                  placeholder="Minimum 8 characters"
                  type="password"
                  autoFocus
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeResetModal}
                  disabled={!!passwordBusyId}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!!passwordBusyId}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-4 text-sm font-bold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {passwordBusyId ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

