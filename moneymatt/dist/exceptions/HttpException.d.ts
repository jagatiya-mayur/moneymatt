declare class HttpException extends Error {
    status: number;
    message: string;
    hasError: boolean;
    constructor(status: number, message: string);
}
export default HttpException;
