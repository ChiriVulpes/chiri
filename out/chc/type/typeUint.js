var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../read/consume/numeric/consumeUnsignedIntegerOptional", "./ChiriType", "./TypeDefinition"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const consumeUnsignedIntegerOptional_1 = __importDefault(require("../read/consume/numeric/consumeUnsignedIntegerOptional"));
    const ChiriType_1 = require("./ChiriType");
    const TypeDefinition_1 = __importDefault(require("./TypeDefinition"));
    exports.default = (0, TypeDefinition_1.default)({
        type: ChiriType_1.ChiriType.of("uint"),
        stringable: true,
        consumeOptionalConstructor: reader => {
            const restore = reader.savePosition();
            const uint = (0, consumeUnsignedIntegerOptional_1.default)(reader);
            if (!uint)
                return undefined;
            if (reader.peek(".")) {
                reader.restorePosition(restore);
                return undefined;
            }
            return uint;
        },
        coerce: (value, error) => {
            if (typeof value === "boolean")
                return value ? 1 : 0;
            if (value === undefined || value === null)
                return 0;
            if (typeof value === "number")
                return Math.max(0, Math.trunc(value));
            throw error();
        },
        is: value => typeof value === "number" && Number.isInteger(value) && value >= 0,
    });
});
//# sourceMappingURL=typeUint.js.map