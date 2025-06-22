import {Router} from 'express';
import userController from '../controllers/users.controller.js';
import validate from '../validators/validate.js';
import { createUserSchema } from '../validators/user.validate.js';
import { authenticatedToken } from '../middlewares/authenticated.js';

const router = Router();

//Routes
// router.get('/', userController.getUsers);
// router.post('/', userController.createUser);

router
.route('/')
.get(userController.getUsers)
.post(validate(createUserSchema, 'body'), userController.createUser);

router
.route('/:id')
.get(authenticatedToken, userController.getUser)
.put(authenticatedToken, userController.updateUser)
.delete(authenticatedToken, userController.deleteUser)
.patch(authenticatedToken, userController.activeInative);

router.get('/:id/tasks', authenticatedToken, userController.getTasks);

router.get('/list/pagination', userController.pagination);



export default router;