export interface GithubRepositoryTag {
    name: string;
    zipball_url: string;
    tarball_url: string;
    commit: GithubRepositoryTagCommit;
}
export interface GithubRepositoryTagCommit {
    url: string;
}
