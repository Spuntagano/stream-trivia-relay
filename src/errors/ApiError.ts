module.exports = class ApiError {
    public e: Error;
    public message: string;
    public status: number;
    public log: boolean;
    public send: boolean;

    constructor(e, message = 'API error', status = 500, log = true, send = true) {
        this.e = e;
        this.message = message;
        this.status = status;
        this.log = log;
        this.send = send;
    }
};
