type ResetEntry = {
  code: string;
  expiresAt: Date;
};

const EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

const store = new Map<string, ResetEntry>();

const normalizeKey = (email: string): string => email.trim().toLowerCase();

export const passwordResetStore = {
  set(email: string, code: string): void {
    const key = normalizeKey(email);
    store.set(key, {
      code,
      expiresAt: new Date(Date.now() + EXPIRY_MS),
    });
  },

  verify(email: string, code: string): boolean {
    const key = normalizeKey(email);
    const entry = store.get(key);
    if (!entry) {
      return false;
    }

    if (entry.expiresAt.getTime() < Date.now()) {
      store.delete(key);
      return false;
    }

    const matches = entry.code === code;
    if (matches) {
      store.delete(key);
    }
    return matches;
  },

  clear(email: string): void {
    store.delete(normalizeKey(email));
  },
};
