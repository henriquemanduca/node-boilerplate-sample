import { Router } from 'express';

import UserController from '../controllers/UserController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const userController = new UserController();

usersRouter.post('/', userController.create);

export default usersRouter;
