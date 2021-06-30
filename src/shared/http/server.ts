import 'reflect-metadata';
import 'dotenv/config';

import { errors } from 'celebrate';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import 'express-async-errors';

import routes from './routes';
import Error from '@shared/utils/errors';
import { MulterError } from 'multer';

const PORT = 3333;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use(routes);

app.use(errors());

app.use(
    (
        err: Error | MulterError,
        req: Request,
        res: Response,
        _: NextFunction,
    ) => {
        if (err instanceof Error) {
            return res.status(err.statusCode).json({
                status: err.statusCode,
                message: err.message,
                instance: req.url,
            });
        }

        if (err instanceof MulterError) {
            return res.status(400).json({
                status: 400,
                code: err.code,
                name: err.name,
                field: err.field,
                message: err.message,
                instance: req.url,
            });
        }

        console.error(err);

        return res.status(500).json({
            status: res.statusCode,
            message: 'Internal server error.',
            instance: req.url,
        });
    },
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
