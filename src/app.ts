import express from "express";
import cors from "cors"
import compression from "compression";
import passport from "passport";
import routes from "./routes/v1"
import config from "./config/config";
import { authLimiter } from './middlewares/rateLimiter';
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utils/ApiError';
import { morganSuccessHandler, morganErrorHandler } from './config/morgan';
import helmet from 'helmet';
import httpStatus from "http-status";
import { jwtStrategy } from './passport/JwtStrategy';

const app = express();


if (config.env !== 'test') {
    app.use(morganSuccessHandler);
    app.use(morganErrorHandler);
}

// set security HTTP headers
app.use(helmet());

app.set('port', config.port)

// compress request
app.use(compression());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// enable cors
app.use(cors());
app.options('*', cors());
// initialize passport
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
    app.use('/v1/auth', authLimiter);
}
// api routes v1
app.use('/v1', routes);
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found', false, ''));
});
// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);


export default app;