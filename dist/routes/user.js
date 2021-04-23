"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../class/token"));
const authentication_1 = require("../middlewares/authentication");
const userRoutes = express_1.Router();
//login
userRoutes.post('/login', (request, response) => {
    const body = request.body;
    user_model_1.User.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return response.json({
                ok: false,
                message: 'Usuario/contraseña no son correctos'
            });
        }
        if (userDB.comparePassword(body.password)) {
            const userToken = token_1.default.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar
            });
            response.json({
                ok: true,
                token: userToken
            });
            return;
        }
        return response.json({
            ok: false,
            message: 'Usuario/contraseña no son correctos ***'
        });
    });
});
//create user
userRoutes.post('/create', (request, response) => {
    const body = request.body;
    const user = {
        name: body.name,
        email: body.email,
        password: bcrypt_1.default.hashSync(body.password, 10),
        avatar: body.avatar
    };
    user_model_1.User.create(user).then(userDB => {
        const userToken = token_1.default.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatart: userDB.avatar
        });
        response.json({
            ok: true,
            userToken
        });
    }).catch(err => {
        response.json({
            ok: false,
            err
        });
    });
});
//update user
userRoutes.post('/update', [authentication_1.verifyToken], (request, response) => {
    const body = request.body;
    const user = {
        name: body.name || request.user.name,
        email: body.email || request.user.email,
        avatar: body.avatar || request.user.avatar
    };
    user_model_1.User.findByIdAndUpdate(request.user._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return response.json({
                ok: false,
                message: 'No existe usuario con este ID'
            });
        }
        const userToken = token_1.default.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatart: userDB.avatar
        });
        response.json({
            ok: true,
            userToken
        });
    });
});
userRoutes.get('/', [authentication_1.verifyToken], (request, response) => {
    const user = request.user;
    return response.json({
        ok: true,
        user
    });
});
exports.default = userRoutes;
