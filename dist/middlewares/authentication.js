"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const token_1 = __importDefault(require("../class/token"));
const verifyToken = (request, response, next) => {
    const userToken = request.get('x-token') || '';
    token_1.default.verifyToken(userToken)
        .then((decoded) => {
        request.user = decoded.user;
        next();
    })
        .catch(err => {
        response.json({
            ok: false,
            message: 'Token invalido'
        });
    });
};
exports.verifyToken = verifyToken;
