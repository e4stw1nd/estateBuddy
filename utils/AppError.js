class AppError extends Error{
    constructor(msg,status_code){
        super();
        this.message = msg;
        this.statusCode = status_code;
    }

}
module.exports=AppError;
