import { LibraryVersionCache } from '../models/LibraryVersionCache';
export declare class CacheFileManager {
    private readonly fileCacheSystem;
    constructor(fileCacheSystem: string);
    onPrepareCacheFileLibraries(): Array<LibraryVersionCache>;
    updateJsonValue(name: string, version: string): void;
}
