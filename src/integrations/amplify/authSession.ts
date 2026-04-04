import { fetchAuthSession, getCurrentUser, signIn, signOut, signUp } from "aws-amplify/auth";
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
