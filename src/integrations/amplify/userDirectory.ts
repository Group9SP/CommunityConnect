import { restPostJson } from "./restClient";

export async function insertProfile(userId: string, fullName: string): Promise<void> {
  await restPostJson("/profiles", { id: userId, full_name: fullName });
}

export async function insertUserRole(
  userId: string,
  role: "customer" | "business_owner"
): Promise<void> {
  await restPostJson("/user_roles", { user_id: userId, role });
}
