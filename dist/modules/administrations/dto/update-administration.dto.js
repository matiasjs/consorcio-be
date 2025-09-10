"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdministrationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_administration_dto_1 = require("./create-administration.dto");
class UpdateAdministrationDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_administration_dto_1.CreateAdministrationDto, ['cuit'])) {
}
exports.UpdateAdministrationDto = UpdateAdministrationDto;
//# sourceMappingURL=update-administration.dto.js.map