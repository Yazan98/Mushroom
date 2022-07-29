export interface LibraryUpdateModel {
  groupId: string;
  artifact: string;
  version: string;
  isGithubSource: boolean;
  url: string;
  releaseUrl: string;
  name: string;
}
