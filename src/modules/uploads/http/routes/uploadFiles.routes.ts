import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import { fileFilter, storage } from '@shared/utils/uploads';

import UploadFilesController from '../controllers/UploadFilesController';

const uploadFilesRouter = Router();
const uploadFilesController = new UploadFilesController();

const upload = multer({ fileFilter, storage });

uploadFilesRouter.post(
    '/',
    celebrate({
        [Segments.QUERY]: {
            filename: Joi.string().required(),
            folder: Joi.string().required(),
            login: Joi.string().required(),
        },
    }),
    upload.array('images'),
    uploadFilesController.create,
);

export default uploadFilesRouter;
