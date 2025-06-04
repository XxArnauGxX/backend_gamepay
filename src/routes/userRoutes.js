import { Router } from 'express';
import { validateBody } from '../middlewares/validate.js';
import { loginSchema, registerSchema } from '../validators/userValidator.js';
import {
  login,
  logoutUser,
  refreshTokenUser,
  register,
} from '../controllers/userController.js';

const userRouter = Router();

userRouter.post('/register', validateBody(registerSchema), register);
userRouter.post('/login', validateBody(loginSchema), login);
userRouter.post('/refresh', refreshTokenUser);
userRouter.post('/logout', logoutUser);

export default userRouter;
