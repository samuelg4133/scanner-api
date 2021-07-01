import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import rimraf from 'rimraf';

import Error from '@shared/utils/errors';

import IStorageProviderDTO from '../dtos/IStorageProviderDTO';
import IStorageProvider from '../interfaces/IStorageProvider';

interface IResponse {
    fileList: string[];
    filePath: string;
    folder: string;
    filename: string;
    login: string;
}

export default class DiskStorageService implements IStorageProvider {
    public async createPDF({
        fileList,
        filename,
        filePath,
        folder,
        login,
    }: IResponse): Promise<void> {
        const doc = new PDFDocument({
            autoFirstPage: false,
            compress: true,
            size: 'A4',
        });

        const serverPath =
            '/run/user/1000/gvfs/smb-share:server=10.11.26.1,share=atendimento$/CADASTRO/CADASTRO_RETAGUARDA/DIGITALIZAÇÕES SS';

        const loginPath = path.resolve(serverPath, login);
        const folderPath = path.resolve(loginPath, folder);

        if (fs.existsSync(folderPath)) {
            doc.pipe(
                fs.createWriteStream(
                    `${folderPath}/${filename}${Date.now()}.pdf`,
                ),
            );
            for (let f in fileList) {
                doc.addPage().image(`${filePath}/${fileList[f]}`, 0, 0, {
                    width: 595.28,
                    height: 841.89,
                });
            }
            doc.end();
        } else {
            if (!fs.existsSync(loginPath)) {
                fs.mkdirSync(loginPath);
                fs.mkdirSync(folderPath);
                doc.pipe(
                    fs.createWriteStream(
                        `${folderPath}/${filename}${Date.now()}.pdf`,
                    ),
                );
                for (let f in fileList) {
                    doc.addPage().image(`${filePath}/${fileList[f]}`, 0, 0, {
                        width: 595.28,
                        height: 841.89,
                    });
                }
                doc.end();
            } else {
                fs.mkdirSync(folderPath);
                doc.pipe(
                    fs.createWriteStream(
                        `${folderPath}/${filename}${Date.now()}.pdf`,
                    ),
                );
                for (let f in fileList) {
                    doc.addPage().image(`${filePath}/${fileList[f]}`, 0, 0, {
                        width: 595.28,
                        height: 841.89,
                    });
                }
                doc.end();
            }
        }
    }
    public async getFiles({
        filename,
        folder,
        login,
    }: IStorageProviderDTO): Promise<IResponse> {
        if (!folder || !filename || !login) {
            throw new Error({
                message: 'Folder, Filename or Login was not provided.',
            });
        }

        const filePath = path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'tmp',
            'uploads',
            login,
            folder,
            filename,
        );

        if (!fs.existsSync(filePath)) {
            throw new Error({ message: 'Path not found.', statusCode: 404 });
        }

        const fileList = fs.readdirSync(filePath);

        return { login, folder, filename, filePath, fileList };
    }
    public async deleteFiles(login: string): Promise<void> {
        const filePath = path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'tmp',
            'uploads',
            login,
        );

        rimraf.sync(filePath);
    }
}
