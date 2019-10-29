import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import StudentController from './app/controllers/StudentController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import PlansController from './app/controllers/PlansController';
import EnrollmentsController from './app/controllers/EnrollmentsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.get('/students/:id', StudentController.show);

routes.post('/files', upload.single('file'), FileController.store);

// Atualização dos planos
routes.post('/plans', PlansController.store);
routes.put('/plans/:myPlanId', PlansController.update);
routes.delete('/plans/:myPlanId', PlansController.delete);
routes.get('/plans', PlansController.index);

// Meus cadastros
routes.get('/enrollments', EnrollmentsController.index);
routes.get('/enrollments/:id', EnrollmentsController.show);
routes.post('/enrollments', EnrollmentsController.store);
routes.put('/enrollments/:id', EnrollmentsController.update);
routes.delete('/enrollments/:id', EnrollmentsController.delete);

export default routes;
