import { describe, expect, it } from "vitest";
import { resolve } from "@/lib/intents";
import { ago, rank, toPulse, type Pulse } from "@/lib/github";
import { site } from "@/site.config";

describe("intents", () => {
  it("routes spoken navigation", () => {
    expect(resolve("go to research")).toMatchObject({ kind: "go", href: "/research/" });
    expect(resolve("Show me the companies!")).toMatchObject({ kind: "go", href: "/companies/" });
    expect(resolve("take me to hermes")).toMatchObject({ kind: "go", href: "/companies/hermes/" });
  });
  it("answers the identity question", () => {
    expect(resolve("what is bytesync")).toMatchObject({ kind: "say" });
    expect(resolve("what do you do")).toMatchObject({ kind: "say" });
  });
  it("reads and stops", () => {
    expect(resolve("read this page")).toEqual({ kind: "read" });
    expect(resolve("stop")).toEqual({ kind: "stop" });
  });
  it("refuses nonsense and empties", () => {
    expect(resolve("")).toEqual({ kind: "none" });
    expect(resolve("banana loaf recipe")).toEqual({ kind: "none" });
  });
});

describe("github pulse", () => {
  const base = { id: "1", repo: { name: "chidionyema/idp" }, created_at: "2026-10-01T00:00:00Z" };
  it("maps merged pull requests", () => {
    const p = toPulse({ ...base, type: "PullRequestEvent", payload: { action: "closed", pull_request: { title: "x", merged: true } } });
    expect(p).toMatchObject({ kind: "merge", repo: "idp" });
  });
  it("drops unknown events", () => {
    expect(toPulse({ ...base, type: "WatchEvent", payload: {} })).toBeNull();
  });
  it("formats age", () => {
    const now = new Date("2026-10-01T00:30:00Z").getTime();
    expect(ago("2026-10-01T00:00:00Z", now)).toBe("30m");
    expect(ago("2026-09-30T00:00:00Z", now)).toBe("1d");
  });
});

describe("brand is config", () => {
  it("carries the legal identity", () => {
    expect(site.legalName).toMatch(/Ltd$/);
    expect(site.companyNumber).toMatch(/^\d{8}$/);
    expect(site.url).toMatch(/^https:\/\//);
  });
});

describe("github pulse filters churn", () => {
  const base = { id: "2", repo: { name: "chidionyema/crew" }, created_at: "2026-10-01T00:00:00Z" };
  it("drops label events, empty pushes and closed-unmerged PRs", () => {
    expect(toPulse({ ...base, type: "IssuesEvent", payload: { action: "labeled", issue: { title: "x" } } })).toBeNull();
    expect(toPulse({ ...base, type: "PushEvent", payload: { commits: [] } })).toBeNull();
    expect(toPulse({ ...base, type: "PullRequestEvent", payload: { action: "closed", pull_request: { title: "x", merged: false } } })).toBeNull();
  });
});

describe("github pulse ranking", () => {
  const row = (kind: Pulse["kind"], i: number): Pulse => ({ id: String(i), kind, repo: "r", text: `t${i}`, at: `2026-10-01T00:${String(i).padStart(2, "0")}:00Z` });
  it("prefers landed work and fills with at most a few opened items", () => {
    const out = rank([row("issue", 1), row("issue", 2), row("push", 3), row("merge", 4), ...Array.from({ length: 10 }, (_, i) => row("issue", 10 + i))]);
    expect(out.filter((x) => x.kind === "issue")).toHaveLength(4);
    expect(out.map((x) => x.kind)).toContain("push");
    expect(out[0].at >= out[1].at).toBe(true);
  });
});
