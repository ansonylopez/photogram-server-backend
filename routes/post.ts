import { Response, Router, Request } from "express";
import { verifyToken } from '../middlewares/authentication';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../class/file-system';


const postRoutes = Router();
const fileSystem = new FileSystem();


//paginate post
postRoutes.get('/', [verifyToken], async (request: any, response: Response) => {

    let page = Number(request.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;

    const posts = await Post.find()
        .sort({ _id: -1 })
        .skip( skip )
        .limit(10)
        .populate('user', '-password')
        .exec();

    response.json({
        ok: true,
        page,
        posts
    });
})


// create post
postRoutes.post('/', [verifyToken], (request: any, response: Response) => {

    const body = request.body;
    body.user = request.user._id;

    const images = fileSystem.moveImagesFromTempToPostFolder( request.user._id );
    body.imgs = images;

    Post.create(body).then(async postBD => {

        await postBD.populate('user', '-password').execPopulate();

        response.json({
            ok: true,
            post: postBD
        });
    }).catch(err => {
        response.json(err)
    })
})

//upload files

postRoutes.post('/upload', [verifyToken], async (request: any, response: Response) => {

    if (!request.files) {
        return response.status(400).json({
            ok: false,
            message: 'No se subió ningún archivo'
        });
    }

    const file: FileUpload = request.files.image

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

    await fileSystem.saveImageTemp(file, request.user._id)

    response.json({
        ok: true,
        file: file.mimetype
    });

})


postRoutes.get('/image/:userId/:img', (request: any, response: Response) => {

    const userId = request.params.userId
    const img = request.params.img

    const pathPhoto = fileSystem.getPhotoUrl( userId, img);

    response.sendFile(pathPhoto);

})

export default postRoutes;