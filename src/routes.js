import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import StudentController from './app/controllers/StudentController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import PlansController from './app/controllers/PlansController';
import EnrollmentsController from './app/controllers/EnrollmentsController';
import HelporderController from './app/controllers/HelporderController';
import CheckinsController from './app/controllers/CheckinsController';

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

// Checkins
routes.post('/students/:id/checkins', CheckinsController.store);
routes.get('/students/:id/checkins', CheckinsController.show);

// Help orders
routes.post('/students/:student_id/help-orders', HelporderController.store);
routes.get('/students/:student_id/help-orders', HelporderController.index);

export default routes;
