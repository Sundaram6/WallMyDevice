import { useSession } from "next-auth/react";

export function useSafeSession() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const session = useSession();
    return session;
  } catch {
    return { data: null, status: "unauthenticated" as const };
  }
}
