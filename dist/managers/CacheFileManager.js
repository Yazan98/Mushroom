"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheFileManager = void 0;
const fs = require("fs");
class CacheFileManager {
    constructor(fileCacheSystem) {
        this.fileCacheSystem = fileCacheSystem;
    }
    onPrepareCacheFileLibraries() {
        const result = [];
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
    updateJsonValue(name, version) {
        const result = [];
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
        const json = JSON.stringify({
            libraries: result,
        }, null, 4);
        fs.writeFileSync(this.fileCacheSystem, json);
    }
}
exports.CacheFileManager = CacheFileManager;
//# sourceMappingURL=CacheFileManager.js.map