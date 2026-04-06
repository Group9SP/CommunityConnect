/**
 * Amplify Gen 1 REST client (`aws_cloud_logic_custom`). Expected routes (adjust Lambda to match):
 * - GET  /business_profiles/public
 * - GET  /business_profiles/me
 * - GET  /business_profiles/:id (optional auth)
 * - POST /business_profiles
 * - PATCH /business_profiles/:id
 * - GET  /business_profiles/admin/pending
 * - GET  /business_profiles/:id/history
 * - GET  /business_profiles/:id/history/count → { count }
 * - POST /profiles  { id, full_name }
 * - POST /user_roles { user_id, role }
 * - GET  /user_roles/me → [{ role }] or { roles: string[] }
 */
import { get, patch, post } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";

export class RestApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "RestApiError";
  }
}

function restApiName(): string {
  const name = import.meta.env.VITE_AMPLIFY_REST_API_NAME;
  if (!name) {
    throw new Error(
      "Set VITE_AMPLIFY_REST_API_NAME to the REST API friendly name from aws-exports (aws_cloud_logic_custom[].name)."
    );
  }
  return name;
}

async function bearerHeaders(): Promise<Record<string, string>> {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseJsonBody<T>(response: {
  statusCode: number;
  body: { json: () => Promise<unknown> };
}): Promise<T | null> {
  try {
    const data = await response.body.json();
    return data as T;
  } catch {
    return null;
  }
}

function messageFromBody(body: unknown, statusCode: number): string {
  if (body && typeof body === "object" && "message" in body) {
    return String((body as { message: unknown }).message);
  }
  return `Request failed (${statusCode})`;
}

export async function restGetJson<T>(path: string, options?: { public?: boolean }): Promise<T | null> {
  const headers: Record<string, string> = {};
  if (!options?.public) {
    Object.assign(headers, await bearerHeaders());
  }

  const operation = get({
    apiName: restApiName(),
    path,
    options: { headers },
  });

  const response = await operation.response;

  if (response.statusCode === 404) {
    return null;
  }

  const body = await parseJsonBody<unknown>(response);

  if (response.statusCode >= 400) {
    throw new RestApiError(messageFromBody(body, response.statusCode), response.statusCode, body);
  }

  return body as T | null;
}

export async function restPostJson<T>(path: string, payload: unknown): Promise<T | null> {
  const headers: Record<string, string> = {
    ...(await bearerHeaders()),
    "Content-Type": "application/json",
  };

  const operation = post({
    apiName: restApiName(),
    path,
    options: { headers, body: payload },
  });

  const response = await operation.response;
  const body = await parseJsonBody<unknown>(response);

  if (response.statusCode >= 400) {
    throw new RestApiError(messageFromBody(body, response.statusCode), response.statusCode, body);
  }

  return body as T | null;
}

export async function restPatchJson<T>(path: string, payload: unknown): Promise<T | null> {
  const headers: Record<string, string> = {
    ...(await bearerHeaders()),
    "Content-Type": "application/json",
  };

  const operation = patch({
    apiName: restApiName(),
    path,
    options: { headers, body: payload },
  });

  const response = await operation.response;
  const body = await parseJsonBody<unknown>(response);

  if (response.statusCode >= 400) {
    throw new RestApiError(messageFromBody(body, response.statusCode), response.statusCode, body);
  }

  return body as T | null;
}
