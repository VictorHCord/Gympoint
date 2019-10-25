import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import StudentController from './app/controllers/StudentController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import PlansController from './app/controllers/PlansController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);
routes.get('/students/:id', StudentController.show);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/plans', PlansController.store);
export default routes;
