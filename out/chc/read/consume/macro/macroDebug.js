var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./MacroConstruct"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const MacroConstruct_1 = __importDefault(require("./MacroConstruct"));
    exports.default = (0, MacroConstruct_1.default)("debug")
        .body("text")
        .consume(({ reader, assignments, body, position }) => ({
        type: "macro-use",
        name: { type: "word", value: "debug", position: { file: "internal", line: 0, column: 0 } },
        assignments: {},
        content: body,
        position,
    }));
});
//# sourceMappingURL=macroDebug.js.map