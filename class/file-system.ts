import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import uniqid from 'uniqid';
import fs from 'fs';


export default class FileSystem {

    constructor() { }

    saveImageTemp(file: FileUpload, userId: string) {

        return new Promise<void>( (resolve, reject) => {

            //make folders
            const path = this.makeUserFolder(userId);

            //file name
            const fileName = this.nameGenerator(file.name);

            //move file from temp to folder user
            file.mv(`${path}/${fileName}`, (err: any) => {

                if (err) {
                    reject(err);
                }
                resolve();
            })

        })

    }

    moveImagesFromTempToPostFolder( userId: string) {

        const pathTemp = path.resolve( __dirname, '../uploads', userId, 'temp');
        const pathPost = path.resolve( __dirname, '../uploads', userId, 'posts');

        if (!fs.existsSync( pathTemp)) {
            return [];
        }

        if (!fs.existsSync( pathPost) ) {
            fs.mkdirSync( pathPost );
        }

        const imagesTemp = this.getImagesFromTempFolder(userId);

        imagesTemp.forEach( image => {
            fs.renameSync(`${ pathTemp }/${image}`, `${ pathPost}/${image}`);
        })

        return imagesTemp;

    }

    getPhotoUrl( userId: string, img: string ) {

        const pathPhoto = path.resolve( __dirname, '../uploads', userId, 'posts', img)
        const exist = fs.existsSync(pathPhoto);

        if (!exist) {
            return path.resolve( __dirname, '../assets/400x250.jpeg' );
        }

        return pathPhoto;

    }

    private getImagesFromTempFolder(userId: string) {

        const pathTemp = path.resolve( __dirname, '../uploads/', userId, 'temp');
console.log(pathTemp);

        return fs.readdirSync( pathTemp) || [];

    }

    private nameGenerator(originalName: string) {

        const nameArr = originalName.split('.');
        const extension = nameArr[nameArr.length - 1];

        const uniqueId = uniqid();


        return `${uniqueId}.${extension}`;
    }

    private makeUserFolder(userId: string) {

        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';

        const exist = fs.existsSync(pathUser);

        if (!exist) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;



    }

}