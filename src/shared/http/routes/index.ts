import { Router } from 'express';

import uploadFilesRouter from '@modules/uploads/http/routes/uploadFiles.routes';

const routes = Router();

routes.use('/upload', uploadFilesRouter);

export default routes;
