export interface EventCommand {
  type: EventCommandType;
  target: string;
}

export enum EventCommandType {
  GET_ACCOUNT_INFO,
  GET_REPO_INFO,
  GET_REPOS,
  GET_BACKEND_LIBRARIES,
  GET_ANDROID_LIBRARIES,
  GET_GITHUB_LIBRARIES,
}
