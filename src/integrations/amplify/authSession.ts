import {
  confirmSignUp,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  resendSignUpCode,
  signIn,
  signOut,
  signUp,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

export type AppUser = {
  id: string;
  email?: string;
  user_metadata?: { full_name?: string };
};

export type AppSession = {
  user: AppUser;
};

export async function getAppSession(): Promise<AppSession | null> {
  try {
    const user = await getCurrentUser();
    const session = await fetchAuthSession();
    const payload = session.tokens?.idToken?.payload;
    const email = (payload?.email as string | undefined) ?? user.signInDetails?.loginId;
    const name = (payload?.name as string | undefined) ?? (payload?.given_name as string | undefined);
    return {
      user: {
        id: user.userId,
        email,
        user_metadata: name ? { full_name: name } : undefined,
      },
    };
  } catch {
    return null;
  }
}

export function subscribeAuth(onChange: () => void): () => void {
  const remove = Hub.listen("auth", ({ payload }) => {
    if (
      payload.event === "signedIn" ||
      payload.event === "signedOut" ||
      payload.event === "tokenRefresh"
    ) {
      onChange();
    }
  });
  return remove;
}

export async function signInWithEmailPassword(email: string, password: string) {
  return signIn({ username: email, password });
}

export async function signOutUser() {
  return signOut();
}

export type SignUpWithProfileParams = {
  email: string;
  password: string;
  fullName: string;
  role: "customer" | "business_owner";
};

export type SignUpWithProfileResult =
  | { ok: true; userId: string }
  | { ok: false; needsEmailConfirmation: true }
  | { ok: false; error: Error };

/**
 * Cognito sign-up, then (when the user pool does not require email confirmation) sign-in and
 * create profile + role rows via the REST API.
 */
export async function signUpThenEnsureProfileAndRole(
  params: SignUpWithProfileParams,
  createProfileAndRole: (userId: string) => Promise<void>
): Promise<SignUpWithProfileResult> {
  const { email, password, fullName, role } = params;

  const result = await signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
        name: fullName,
      },
    },
  });

  if (result.nextStep.signUpStep === "CONFIRM_SIGN_UP") {
    return { ok: false, needsEmailConfirmation: true };
  }

  let session = await getAppSession();
  if (!session) {
    try {
      await signIn({ username: email, password });
    } catch {
      // User may already be signed in (e.g. COMPLETE_AUTO_SIGN_IN).
    }
    session = await getAppSession();
  }

  if (!session?.user.id) {
    return {
      ok: false,
      error: new Error(
        "Could not establish a session after sign up. Confirm your email if required, then sign in."
      ),
    };
  }

  try {
    await createProfileAndRole(session.user.id);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e : new Error(String(e)),
    };
  }

  return { ok: true, userId: session.user.id };
}

/**
 * After the user enters the email verification code from Cognito, confirm the account and sign in.
 */
export async function confirmEmailCodeAndSignIn(
  username: string,
  password: string,
  confirmationCode: string
): Promise<{ ok: true } | { ok: false; error: Error }> {
  const code = confirmationCode.trim();
  if (!code) {
    return { ok: false, error: new Error("Enter the verification code from your email.") };
  }

  try {
    await confirmSignUp({ username, confirmationCode: code });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
  }

  try {
    const out = await signIn({ username, password });
    if (!out.isSignedIn) {
      return {
        ok: false,
        error: new Error("Account verified, but sign-in needs an extra step. Try logging in again."),
      };
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
  }

  return { ok: true };
}

export async function resendVerificationEmail(username: string): Promise<void> {
  await resendSignUpCode({ username });
}

/** Best-effort display name after confirmation when sessionStorage metadata is missing. */
export async function resolveDisplayNameForNewProfile(fallbackEmail: string): Promise<string> {
  try {
    const attrs = await fetchUserAttributes();
    const n = attrs.name ?? attrs.given_name ?? attrs.email;
    if (n) return n;
  } catch {
    // ignore
  }
  const local = fallbackEmail.split("@")[0];
  return local || "User";
}
