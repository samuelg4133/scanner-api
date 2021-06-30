import { Request, Response } from 'express';

import DiskStorageService from '@modules/uploads/services/DiskStorageService';

export default class UploadFilesController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { folder, filename, login } = request.query;
        const diskStorage = new DiskStorageService();

        const files = await diskStorage.getFiles({
            filename: filename?.toString() || '',
            folder: folder?.toString() || '',
            login: login?.toString() || '',
        });

        await diskStorage.createPDF(files);

        await diskStorage.deleteFiles(files.login);

        return response.send();
    }
}
