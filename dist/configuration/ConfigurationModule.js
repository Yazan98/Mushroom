"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationModule = void 0;
const common_1 = require("@nestjs/common");
const ConfigurationService_1 = require("./ConfigurationService");
const ConfigurationController_1 = require("./ConfigurationController");
const http_module_1 = require("@nestjs/axios/dist/http.module");
let ConfigurationModule = class ConfigurationModule {
};
ConfigurationModule = __decorate([
    (0, common_1.Module)({
        imports: [http_module_1.HttpModule],
        controllers: [ConfigurationController_1.ConfigurationController],
        providers: [ConfigurationService_1.ConfigurationService],
        exports: [ConfigurationService_1.ConfigurationService],
    })
], ConfigurationModule);
exports.ConfigurationModule = ConfigurationModule;
//# sourceMappingURL=ConfigurationModule.js.map