import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';

export const storage = multer.diskStorage({
    destination: (req, _, cb) => {
        const defaultPath = path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'tmp',
            'uploads',
        );
        const { folder, filename, login } = req.query;
        const loginPath = path.resolve(defaultPath, login?.toString() || '');
        const loginAndFolderPath = path.resolve(
            loginPath,
            folder?.toString() || '',
        );
        const fullPath = path.resolve(
            loginAndFolderPath,
            filename?.toString() || '',
        );

        if (fs.existsSync(fullPath)) {
            cb(null, fullPath);
        } else {
            if (!fs.existsSync(loginPath)) {
                fs.mkdirSync(loginPath);
                fs.mkdirSync(loginAndFolderPath);
                fs.mkdirSync(fullPath);
                cb(null, fullPath);
            } else {
                if (!fs.existsSync(loginAndFolderPath)) {
                    fs.mkdirSync(loginAndFolderPath);
                    fs.mkdirSync(fullPath);
                    cb(null, fullPath);
                } else {
                    fs.mkdirSync(fullPath);
                    cb(null, fullPath);
                }
            }
        }
    },
    filename: (req, file, cb) => {
        const { filename } = req.query;
        if (!filename) {
            cb(
                new Error('Filename was not provided.'),
                `${Date.now()}${file.originalname}`,
            );
        }
        cb(null, `${filename}${Date.now()}.jpeg`);
    },
});

export const fileFilter = (
    _: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
) => {
    const allowedMimes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/jpg',
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid format.'));
    }
};
