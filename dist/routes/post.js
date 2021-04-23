"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middlewares/authentication");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../class/file-system"));
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
//paginate post
postRoutes.get('/', [authentication_1.verifyToken], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let page = Number(request.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .exec();
    response.json({
        ok: true,
        page,
        posts
    });
}));
// create post
postRoutes.post('/', [authentication_1.verifyToken], (request, response) => {
    const body = request.body;
    body.user = request.user._id;
    const images = fileSystem.moveImagesFromTempToPostFolder(request.user._id);
    body.imgs = images;
    post_model_1.Post.create(body).then((postBD) => __awaiter(void 0, void 0, void 0, function* () {
        yield postBD.populate('user', '-password').execPopulate();
        response.json({
            ok: true,
            post: postBD
        });
    })).catch(err => {
        response.json(err);
    });
});
//upload files
postRoutes.post('/upload', [authentication_1.verifyToken], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    if (!request.files) {
        return response.status(400).json({
            ok: false,
            message: 'No se subió ningún archivo'
        });
    }
    const file = request.files.image;
    if (!file) {
        return response.status(400).json({
            ok: false,
            message: 'No se subió ningún archivo valido'
        });
    }
    if (!file.mimetype.includes('image')) {
        return response.status(400).json({
            ok: false,
            message: 'Solo se permite subir imagenes'
        });
    }
    yield fileSystem.saveImageTemp(file, request.user._id);
    response.json({
        ok: true,
        file: file.mimetype
    });
}));
postRoutes.get('/image/:userId/:img', (request, response) => {
    const userId = request.params.userId;
    const img = request.params.img;
    const pathPhoto = fileSystem.getPhotoUrl(userId, img);
    response.sendFile(pathPhoto);
});
exports.default = postRoutes;
