import ConnectDB from "./DB/index.js";
import { app } from './app.js'
import dotenv from 'dotenv';
import { seedCrypto } from './Utils/seedCrypto.js';

dotenv.config({
    path: './.env'
});

ConnectDB()
.then(() => {
    seedCrypto()
})
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server Started listning on ${process.env.PORT}`);
    });
})