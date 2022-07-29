export interface GoogleMavenLibrary {
  groupId: string;
  artifacts: Array<GoogleMavenArtifact>;
}

export interface GoogleMavenArtifact {
  name: string;
  versions: Array<string>;
}

export class GoogleCacheArtifact {
  artifact: string;
  version: string;
}
