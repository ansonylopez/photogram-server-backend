import { Router, Request, Response } from "express";
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import Token from '../class/token';
import { verifyToken } from '../middlewares/authentication';


const userRoutes = Router();

//login
userRoutes.post('/login', (request: Request, response: Response) => {

    const body = request.body;

    User.findOne({email: body.email}, (err: any, userDB: any) => {

        if (err) throw err;

        if (!userDB) {
            return response.json({
                ok: false,
                message: 'Usuario/contraseña no son correctos'
            });
        }

        if( userDB.comparePassword(body.password) ) {

            const userToken = Token.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar
            });

            response.json({
                ok: true,
                token: userToken
            });
            return
        }

        return response.json({
            ok: false,
            message: 'Usuario/contraseña no son correctos ***'
        });
    });

});

//create user
userRoutes.post('/create', (request: Request, response: Response) => {

    const body = request.body;

    const user = {
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        avatar: body.avatar
    }

    User.create(user).then( userDB => {

        const userToken = Token.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });

        response.json({
            ok: true,
            userToken
        });

    }).catch( err => {
        response.json({
            ok: false,
            err
        });
    });

});


//update user
userRoutes.post('/update', [verifyToken] ,(request: any, response: Response) => {

    const body = request.body;

    const user = {
        name: body.name || request.user.name,
        email: body.email || request.user.email,
        avatar: body.avatar || request.user.avatar
    }

    User.findByIdAndUpdate( request.user._id, user, { new: true }, (err, userDB) => {

        if (err) throw err;

        if (!userDB) {
            return response.json({
                ok: false,
                message: 'No existe usuario con este ID'
            });
        }

        const userToken = Token.getJwtToken({
            _id: userDB._id, 
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        })

        response.json({
            ok: true,
            userToken
        })


    })
});

userRoutes.get('/', [verifyToken], (request: any, response: Response) => {

    const user = request.user;

    return response.json({
        ok: true,
        user
    });

});

export default userRoutes;