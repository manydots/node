import "reflect-metadata";
import {createKoaServer } from "routing-controllers";
import {UserController} from "./UserController";
const app = createKoaServer ({
   controllers: [UserController] // we specify controllers we want to use
});
app.listen(3000);