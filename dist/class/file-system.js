"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const uniqid_1 = __importDefault(require("uniqid"));
const fs_1 = __importDefault(require("fs"));
class FileSystem {
    constructor() { }
    saveImageTemp(file, userId) {
        return new Promise((resolve, reject) => {
            //make folders
            const path = this.makeUserFolder(userId);
            //file name
            const fileName = this.nameGenerator(file.name);
            //move file from temp to folder user
            file.mv(`${path}/${fileName}`, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
    moveImagesFromTempToPostFolder(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads', userId, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagesTemp = this.getImagesFromTempFolder(userId);
        imagesTemp.forEach(image => {
            fs_1.default.renameSync(`${pathTemp}/${image}`, `${pathPost}/${image}`);
        });
        return imagesTemp;
    }
    getPhotoUrl(userId, img) {
        const pathPhoto = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        const exist = fs_1.default.existsSync(pathPhoto);
        if (!exist) {
            return path_1.default.resolve(__dirname, '../assets/400x250.jpeg');
        }
        return pathPhoto;
    }
    getImagesFromTempFolder(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        console.log(pathTemp);
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    nameGenerator(originalName) {
        const nameArr = originalName.split('.');
        const extension = nameArr[nameArr.length - 1];
        const uniqueId = uniqid_1.default();
        return `${uniqueId}.${extension}`;
    }
    makeUserFolder(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        const exist = fs_1.default.existsSync(pathUser);
        if (!exist) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
}
exports.default = FileSystem;
