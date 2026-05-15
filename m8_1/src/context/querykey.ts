export const QUERY_KEYS = {
  lps: {
    all: ["lps"] as const,
    list: (params: object) => ["lps", "list", params] as const,
    detail: (id: string) => ["lps", "detail", id] as const,
  },
  comments: {
    all: ["comments"] as const,
    list: (lpid: string) => ["comments", "list", lpid] as const,
  },
  user: {
    me: ["user", "me"] as const,
    profile: (id: number) => ["user", "profile", id] as const,
  },
} as const;