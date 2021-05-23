var allowedOrigins = ['http://localhost:3000'];
console.log('atleast')
const corsMiddleware = (req, res, next) => {
  try {
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header(
      'Access-Control-Allow-Methods',
      'PUT, POST, GET, DELETE, HEAD,OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Cache-Control, Origin, X-Requested-With, Content-Type, Accept,X-REQUEST-TYPE, X-LANGUAGE-CODE, Authorization'
    );
    next();
  } catch (err) {
    console.log('innnn');
    return next(new HttpError('Cors error', 401));
  }
};

module.exports = corsMiddleware;