import Server from './class/server';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

import postRoutes from './routes/post';
import userRoutes from './routes/user';

const server = new Server();

//Body parser
server.app.use( bodyParser.urlencoded({extended: true}) )
server.app.use( bodyParser.json() )

//FileUpload
server.app.use( fileUpload({ useTempFiles: true }) )

//routes
server.app.use('/user', userRoutes)
server.app.use('/posts', postRoutes)


//connect DB
mongoose.connect('mongodb://localhost:27017/photosgram', {
  useNewUrlParser: true, useCreateIndex: true
}, ( err) => {

  if (err) {
    throw err;
  }

  console.log('Base de datos online');
  

})

//init server
server.start( () => {
  console.log(`Servidor corriendo en puerto ${ server.port }`);
})
  