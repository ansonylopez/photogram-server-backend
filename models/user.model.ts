import { Schema, model, Document } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema: Schema<IUser> = new Schema({

    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [ true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    }
});

userSchema.method('comparePassword', function (password: string = ''): boolean {
    if ( bcrypt.compareSync( password, this.password) ) {
        return true;
    }
    return false;
})

interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    avatar: string

    comparePassword(password: string): boolean
}

export const User = model<IUser>('User', userSchema);