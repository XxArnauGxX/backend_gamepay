import { Router } from 'express';
import { validateBody } from '../middlewares/validate.js';
import { registerSchema } from '../validators/userValidator.js';
import { register } from '../controllers/userController.js';

const userRouter = Router();

userRouter.post('/register', validateBody(registerSchema), register);

export default userRouter;
