export const errorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || 500

  if (process.env.NODE_ENV === 'development') {
    
    res.status(statusCode).json({

      success: false,
      error: {
        code: err.code || "INTERNAL_SERVER_ERROR",
        message: err.message || "Something went wrong",
        stack: err.stack
      }

    })
  }else{
      res.status(statusCode).json({

    success: false,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: err.message || "Something went wrong"

    }

  })
  }

}