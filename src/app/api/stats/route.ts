import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 3600; // cache upstream calls for an hour

const GH_USER = "AnirudhChandan";
const LC_USER = "crytondre";

async function fetchGitHub(): Promise<{ repos: number | null; followers: number | null } | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${GH_USER}`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "anirudh-portfolio" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const d = (await res.json()) as { public_repos?: number; followers?: number };
    return { repos: d.public_repos ?? null, followers: d.followers ?? null };
  } catch {
    return null;
  }
}

type LeetCode = { solved: number | null; easy: number | null; medium: number | null; hard: number | null };

async function fetchLeetCode(): Promise<LeetCode | null> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": "anirudh-portfolio",
      },
      body: JSON.stringify({
        query:
          "query($u:String!){ matchedUser(username:$u){ submitStatsGlobal{ acSubmissionNum{ difficulty count } } } }",
        variables: { u: LC_USER },
      }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const d = (await res.json()) as {
      data?: {
        matchedUser?: {
          submitStatsGlobal?: { acSubmissionNum?: Array<{ difficulty: string; count: number }> };
        };
      };
    };
    const nums = d.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;
    if (!Array.isArray(nums)) return null;
    const count = (d: string) => nums.find((n) => n.difficulty === d)?.count ?? null;
    return { solved: count("All"), easy: count("Easy"), medium: count("Medium"), hard: count("Hard") };
  } catch {
    return null;
  }
}

export async function GET() {
  const [github, leetcode] = await Promise.all([fetchGitHub(), fetchLeetCode()]);
  return NextResponse.json(
    {
      github: github ?? { repos: null, followers: null },
      leetcode: leetcode ?? { solved: null, easy: null, medium: null, hard: null },
      users: { github: GH_USER, leetcode: LC_USER },
    },
    { headers: { "cache-control": "s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
