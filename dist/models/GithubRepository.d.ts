export interface GithubRepository {
    full_name: string;
    private: boolean;
    html_url: string;
    description: string;
    fork: boolean;
    stargazers_count: number;
    watchers_count: number;
    language: string;
    topics: string[];
    open_issues: number;
    watchers: number;
    default_branch: string;
    name: string;
}
