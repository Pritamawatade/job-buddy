export const errorMiddleware = (err: any, req: any, res: any, next: any) =>{
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    })
}