interface IError {
    message: string;
    statusCode?: number;
}

export default class Error {
    public readonly message: string;

    public readonly statusCode: number;

    constructor({ message, statusCode = 400 }: IError) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
