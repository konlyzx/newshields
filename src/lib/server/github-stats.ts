interface GitHubRepoStats {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

const REPO = 'konlyzx/newshields';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cachedStats: GitHubRepoStats | null = null;
let cacheTime = 0;

export async function getGitHubStats(): Promise<GitHubRepoStats> {
  const now = Date.now();
  
  // Return cached stats if still valid
  if (cachedStats && now - cacheTime < CACHE_TTL) {
    return cachedStats;
  }

  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'newshields'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers
    });

    if (!res.ok) {
      console.error(`GitHub API failed: ${res.status}`);
      // Return cached stats even if expired, or defaults
      return cachedStats ?? { stargazers_count: 0, forks_count: 0, open_issues_count: 0 };
    }

    const data = await res.json();
    cachedStats = {
      stargazers_count: data.stargazers_count ?? 0,
      forks_count: data.forks_count ?? 0,
      open_issues_count: data.open_issues_count ?? 0
    };
    cacheTime = now;
    return cachedStats;
  } catch (error) {
    console.error('GitHub API fetch error:', error);
    return cachedStats ?? { stargazers_count: 0, forks_count: 0, open_issues_count: 0 };
  }
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
