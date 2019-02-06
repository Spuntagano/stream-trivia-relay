module.exports = class DatabaseError {
    public e: Error;
    public message: string;
    public status: number;
    public log: boolean;
    public send: boolean;

    constructor(e, message = 'Redis error', status = 500, log = true, send = false) {
        this.e = e;
        this.message = message;
        this.status = status;
        this.log = log;
        this.send = send;
    }
};
