import { LibraryVersionCache } from '../models/LibraryVersionCache';
import * as fs from 'fs';

export class CacheFileManager {
  constructor(private readonly fileCacheSystem: string) {}

  onPrepareCacheFileLibraries(): Array<LibraryVersionCache> {
    const result: Array<LibraryVersionCache> = [];
    const fileData = fs.readFileSync(this.fileCacheSystem, {
      encoding: 'utf8',
      flag: 'r',
    });

    const libraries = JSON.parse(fileData).libraries;
    for (let i = 0; i < libraries.length; i++) {
      result.push({
        name: libraries[i].name,
        version: libraries[i].version,
      });
    }

    return result;
  }

  updateJsonValue(name: string, version: string) {
    const result: Array<LibraryVersionCache> = [];
    const fileData = fs.readFileSync(this.fileCacheSystem, {
      encoding: 'utf8',
      flag: 'r',
    });

    const libraries = JSON.parse(fileData).libraries;
    for (let i = 0; i < libraries.length; i++) {
      result.push({
        name: libraries[i].name,
        version: libraries[i].version,
      });
    }

    result.push({
      name: name,
      version: version,
    });

    const json = JSON.stringify(
      {
        libraries: result,
      },
      null,
      4,
    );
    fs.writeFileSync(this.fileCacheSystem, json);
  }
}
