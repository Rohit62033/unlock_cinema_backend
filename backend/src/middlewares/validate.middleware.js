export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body)

      req.validatedBody = parsed
      next()
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: {
          type: "VALIDATION_ERROR",
          message: error.errors?.[0]?.message || "Invalid request data"
        }
      })
    }
  }
}

export const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.params)

      req.validatedParams = parsed
      next()
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: {
          type: "VALIDATION_ERROR",
          message: error.errors?.[0]?.message || "Invalid request data"
        }
      })
    }
  }
}
export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.query)

      req.validatedQuery = parsed
      next()
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: {
          type: "VALIDATION_ERROR",
          message: error.errors?.[0]?.message || "Invalid request data"
        }
      })
    }
  }
}