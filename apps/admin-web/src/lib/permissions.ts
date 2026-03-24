export function hasCapability(
  capabilities: string[] | null | undefined,
  capability: string
): boolean {
  if (!capabilities?.length) return false;
  return capabilities.includes(capability);
}

export function hasAnyCapability(
  capabilities: string[] | null | undefined,
  required: string[]
): boolean {
  if (!capabilities?.length || required.length === 0) return false;
  return required.some((capability) => capabilities.includes(capability));
}

export function hasAllCapabilities(
  capabilities: string[] | null | undefined,
  required: string[]
): boolean {
  if (required.length === 0) return true;
  if (!capabilities?.length) return false;
  return required.every((capability) => capabilities.includes(capability));
}
