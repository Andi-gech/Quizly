
const errorHandler = (err, req, res, next) => {
    
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
  
 
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${message}`);
  
  
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  };
  
  module.exports = errorHandler;
  