export interface EventCommand {
    type: EventCommandType;
    target: string;
}
export declare enum EventCommandType {
    GET_ACCOUNT_INFO = 0,
    GET_REPO_INFO = 1,
    GET_REPOS = 2,
    GET_BACKEND_LIBRARIES = 3,
    GET_ANDROID_LIBRARIES = 4,
    GET_GITHUB_LIBRARIES = 5,
    UNKNOWN_COMMAND = 6
}
