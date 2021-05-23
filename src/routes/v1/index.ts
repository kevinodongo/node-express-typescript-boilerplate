import express from 'express';
import authRoute from './auth.routes'
import userRoute from './user.routes'
//import docRoute from './doc.routes'
//import config from "../../config/config"

const router = express.Router();


const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
];

// const devRoutes = [
//   routes available only in development mode
//   {
//     path: '/docs',
//     route: docRoute,
//   },
// ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }
  
export default router;


