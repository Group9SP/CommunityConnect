import { gqlClient } from "./graphqlClient";
import { createProfile, createUserRole } from "@/graphql/mutations";

export async function insertProfile(userId: string, fullName: string): Promise<void> {
  await gqlClient.graphql({
    query: createProfile,
    variables: { input: { id: userId, full_name: fullName } },
  });
}

export async function insertUserRole(
  userId: string,
  role: "customer" | "business_owner"
): Promise<void> {
  await gqlClient.graphql({
    query: createUserRole,
    variables: { input: { profileID: userId, role } },
  });
}
