import jwt, { decode } from "jsonwebtoken";

export default class Token {

    private static seed: string = 'this-is-my-seed-of-my-app';
    private static expired: string = '30d'; 

    constructor() {}

    static getJwtToken( payload: any): string {

        return jwt.sign({
            user: payload
        }, this.seed, { expiresIn: this.expired })
    }

    static verifyToken(userToken: string) {

        return new Promise( (resolve, reject) => {
  
            jwt.verify( userToken, this.seed, (err, decoded) => {
                
                if (err) {
                    reject()                    
                }
                resolve( decoded )
            })
        })

    }



}