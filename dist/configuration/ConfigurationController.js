"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationController = void 0;
const common_1 = require("@nestjs/common");
const ConfigurationService_1 = require("./ConfigurationService");
let ConfigurationController = class ConfigurationController {
    getGeneratedConfigurationFiles() {
        this.service.generateJsonTemplates();
        return true;
    }
};
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", ConfigurationService_1.ConfigurationService)
], ConfigurationController.prototype, "service", void 0);
__decorate([
    (0, common_1.Get)('/files'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "getGeneratedConfigurationFiles", null);
ConfigurationController = __decorate([
    (0, common_1.Controller)('/config')
], ConfigurationController);
exports.ConfigurationController = ConfigurationController;
//# sourceMappingURL=ConfigurationController.js.map