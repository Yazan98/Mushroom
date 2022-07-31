"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationUtils = void 0;
const common_1 = require("@nestjs/common");
class ApplicationUtils {
    static printAppLog(message) {
        this.logger.log(message);
    }
    static getHelpCommands() {
        let response = '';
        response += 'Invalid Command Triggered, Please Use Correct Command !! \n';
        response += 'Allowed Commands List: \n';
        response += '\t 1. get account info UserName \n';
        response += '\t 2. get account repos UserName \n';
        response += '\t 3. get repo info UserName/RepoName \n';
        response += '\t 4. get libraries android \n';
        response += '\t 5. get libraries backend \n';
        response += '\t 6. get libraries github \n';
        return response;
    }
}
exports.ApplicationUtils = ApplicationUtils;
ApplicationUtils.logger = new common_1.Logger('ApplicationUtils');
//# sourceMappingURL=ApplicationUtils.js.map