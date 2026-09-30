// Real, public proof of the crew at work: GitHub public events for the founder's
// account, fetched client-side from the public API (no token, 60 requests an hour
// per viewer). Nothing here is synthetic.

export type Pulse = {
  id: string;
  kind: "push" | "pr" | "merge" | "issue" | "release" | "other";
  repo: string;
  text: string;
  at: string;
};

type Event = {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: Record<string, unknown>;
};

export function toPulse(e: Event): Pulse | null {
  const repo = e.repo.name.split("/")[1] ?? e.repo.name;
  const p = e.payload as {
    commits?: { message: string }[];
    action?: string;
    pull_request?: { title: string; merged?: boolean };
    issue?: { title: string };
    release?: { name?: string; tag_name?: string };
  };
  switch (e.type) {
    case "PushEvent": {
      const n = p.commits?.length ?? 0;
      if (n === 0) return null;
      const head = p.commits?.[0]?.message.split("\n")[0] ?? "";
      return { id: e.id, kind: "push", repo, text: n > 1 ? `${n} commits · ${head}` : head, at: e.created_at };
    }
    case "PullRequestEvent": {
      const merged = p.action === "closed" && p.pull_request?.merged;
      if (p.action !== "opened" && !merged) return null;
      return {
        id: e.id,
        kind: merged ? "merge" : "pr",
        repo,
        text: `${merged ? "merged" : p.action} · ${p.pull_request?.title ?? ""}`,
        at: e.created_at,
      };
    }
    case "IssuesEvent":
      if (p.action !== "opened") return null;
      return { id: e.id, kind: "issue", repo, text: `${p.action} · ${p.issue?.title ?? ""}`, at: e.created_at };
    case "ReleaseEvent":
      return { id: e.id, kind: "release", repo, text: `release ${p.release?.tag_name ?? ""}`, at: e.created_at };
    default:
      return null;
  }
}

export async function fetchPulse(user: string, signal?: AbortSignal): Promise<Pulse[]> {
  const r = await fetch(`https://api.github.com/users/${user}/events/public?per_page=60`, {
    signal,
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!r.ok) throw new Error(`github ${r.status}`);
  const events = (await r.json()) as Event[];
  return rank(events.map(toPulse).filter((x): x is Pulse => x !== null));
}

// Landed work first (pushes, merges, releases); opened issues and pull requests only
// fill the list when little has landed. Duplicates by repo and text are dropped.
export function rank(all: Pulse[], limit = 18): Pulse[] {
  const seen = new Set<string>();
  const uniq = all.filter((x) => !seen.has(`${x.repo}|${x.text}`) && !!seen.add(`${x.repo}|${x.text}`));
  const landed = uniq.filter((x) => x.kind === "push" || x.kind === "merge" || x.kind === "release");
  const rest = uniq.filter((x) => !landed.includes(x));
  return [...landed, ...rest.slice(0, Math.max(0, 6 - landed.length))]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, limit);
}

export function ago(iso: string, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.round(s / 60)}m`;
  if (s < 86400) return `${Math.round(s / 3600)}h`;
  return `${Math.round(s / 86400)}d`;
}
