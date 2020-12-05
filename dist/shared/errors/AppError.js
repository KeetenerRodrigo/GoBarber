"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageError = /** @class */ (function () {
    function MessageError(message, statusCode) {
        if (statusCode === void 0) { statusCode = 400; }
        this.message = message;
        this.statusCode = statusCode;
    }
    return MessageError;
}());
exports.default = MessageError;
