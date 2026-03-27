export const ADMIN_CAPABILITIES = {
  usersRead: "users:read",
  usersWrite: "users:write",
  divisionsRead: "divisions:read",
  divisionsWrite: "divisions:write",
  logsRead: "logs:read",
  logsWrite: "logs:write",
  settingsRead: "settings:read",
  settingsWrite: "settings:write",
} as const;

export type AdminCapability =
  (typeof ADMIN_CAPABILITIES)[keyof typeof ADMIN_CAPABILITIES];
