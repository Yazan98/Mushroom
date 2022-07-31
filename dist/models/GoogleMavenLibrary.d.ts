export interface GoogleMavenLibrary {
    groupId: string;
    artifacts: Array<GoogleMavenArtifact>;
}
export interface GoogleMavenArtifact {
    name: string;
    versions: Array<string>;
}
export declare class GoogleCacheArtifact {
    artifact: string;
    version: string;
}
