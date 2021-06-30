import IStorageProviderDTO from '../dtos/IStorageProviderDTO';

interface IResponse {
    fileList: string[];
    filePath: string;
    folder: string;
    filename: string;
    login: string;
}

export default interface IStorageProvider {
    createPDF({
        fileList,
        login,
        folder,
        filename,
        filePath,
    }: IResponse): Promise<void>;
    deleteFiles(login: string): Promise<void>;
    getFiles({
        filename,
        folder,
        login,
    }: IStorageProviderDTO): Promise<IResponse>;
}
