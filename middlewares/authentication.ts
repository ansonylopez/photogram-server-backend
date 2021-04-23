import { Response, Request, NextFunction } from 'express';
import Token from '../class/token';


export const verifyToken = (request: any, response: Response, next: NextFunction) => {

    const userToken = request.get('x-token') || '';

    Token.verifyToken( userToken )
        .then( (decoded: any) => {
            request.user = decoded.user
            next();
        })
        .catch( err => {

            response.json({
                ok: false,
                message: 'Token invalido'
            })

        })


}