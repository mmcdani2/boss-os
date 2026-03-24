import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  createUser,
  listUsers,
  resetUserPassword,
  updateUserStatus,
  type AdminUser,
} from "../lib/users";

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
      setSuccess("User created.");
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
          ? `${updated.fullName} reactivated.`
          : `${updated.fullName} deactivated.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update user status."
      );
    } finally {
      setStatusBusyId(null);
    }
  }

  async function handleResetPassword(user: AdminUser) {
    const nextPassword = window.prompt(
      `Enter a new temporary password for ${user.fullName}:`
    );

    if (nextPassword == null) {
      return;
    }

    const trimmed = nextPassword.trim();

    if (trimmed.length < 8) {
      setError("Temporary password must be at least 8 characters.");
      setSuccess("");
      return;
    }

    try {
      setPasswordBusyId(user.id);
      setError("");
      setSuccess("");

      await resetUserPassword(user.id, trimmed);

      setSuccess(`${user.fullName}'s password was reset.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reset password."
      );
    } finally {
      setPasswordBusyId(null);
    }
  }

  return (
    <Layout
      kicker="BossOS"
      title="Users"
      subtitle="Create and manage internal users for admin and field access."
    >
      <div className="space-y-6">
        <section className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 sm:p-6">
          <h2 className="text-xl font-bold text-white">Add User</h2>

          <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-white outline-none transition focus:border-orange-400/60"
                placeholder="John Smith"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-white outline-none transition focus:border-orange-400/60"
                placeholder="john@company.com"
                type="email"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
                Temporary Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-white outline-none transition focus:border-orange-400/60"
                placeholder="Minimum 8 characters"
                type="password"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "tech")}
                className="h-12 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-white outline-none transition focus:border-orange-400/60"
              >
                <option value="tech">Tech</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200">
                {success}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-bold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Creating..." : "Create User"}
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white">Current Users</h2>
            <button
              type="button"
              onClick={() => void loadUsers()}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
              Loading users...
            </div>
          ) : (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-sm">
                  <thead className="bg-black/30 text-left text-white/60">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">Role</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-[#141414]">
                    {users.map((user) => {
                      const busyStatus = statusBusyId === user.id;
                      const busyPassword = passwordBusyId === user.id;

                      return (
                        <tr key={user.id}>
                          <td className="px-4 py-3 text-white">{user.fullName}</td>
                          <td className="px-4 py-3 text-white/75">{user.email}</td>
                          <td className="px-4 py-3 text-white/75">{user.role}</td>
                          <td className="px-4 py-3">
                            <span
                              className={[
                                "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                                user.isActive
                                  ? "bg-emerald-500/15 text-emerald-300"
                                  : "bg-white/10 text-white/60",
                              ].join(" ")}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                disabled={busyStatus || busyPassword}
                                onClick={() => void handleToggleStatus(user)}
                                className={[
                                  "inline-flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
                                  user.isActive
                                    ? "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                                    : "bg-orange-500 text-black hover:brightness-105",
                                ].join(" ")}
                              >
                                {busyStatus
                                  ? "Updating..."
                                  : user.isActive
                                    ? "Deactivate"
                                    : "Reactivate"}
                              </button>

                              <button
                                type="button"
                                disabled={busyStatus || busyPassword}
                                onClick={() => void handleResetPassword(user)}
                                className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {busyPassword ? "Resetting..." : "Reset Password"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-white/55">
                          No users found.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
