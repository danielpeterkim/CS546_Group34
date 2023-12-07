import authRoutes from './auth_routes.js';

const constructorMethod = (app) => {
  app.use('/', authRoutes);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;