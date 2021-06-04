"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./class/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const post_1 = __importDefault(require("./routes/post"));
const user_1 = __importDefault(require("./routes/user"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
//Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//FileUpload
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
//cors config
server.app.use(cors_1.default({ origin: true, credentials: true }));
//routes
server.app.use('/user', user_1.default);
server.app.use('/posts', post_1.default);
//connect DB
mongoose_1.default.connect('mongodb://localhost:27017/photosgram', {
    useNewUrlParser: true, useCreateIndex: true
}, (err) => {
    if (err) {
        throw err;
    }
    console.log('Data base online');
});
//init server
server.start(() => {
    console.log(`Server run in port: ${server.port}`);
});
