import express from 'express';
import session from 'express-session';
import exphbs from 'express-handlebars';
import configRoutes from './routes/index.js';
import Handlebars from 'handlebars';
const app = express();
const staticDir = express.static('public');

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: 'AuthState',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.use((req, res, next) => {
  const timestamp = new Date().toUTCString();
  const method = req.method;
  const route = req.originalUrl;
  const isAuthenticated = req.session.player ? "Authenticated Player" : "Non-Authenticated Player";
  console.log(`[${timestamp}]: ${method} ${route} (${isAuthenticated})`);

  if (!req.session.player && (route !== '/login' && route !== '/register' && route !== '/leaderboard')) {
      return res.redirect('/login');
  }
  //better way to make middleware according to w3schools
  if (req.session.player && !['/city', '/logout', '/buy-building', '/destroy-building', '/get-player', '/pvp', '/report', '/report-player', '/pvp/targeted-battle', '/pvp/random-attack', '/pvp/execute-battle', '/tasks', '/help', '/options', '/leaderboard'].includes(route)) {
      return res.redirect('/city');
  }

  next();
});

configRoutes(app);

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number') {
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
      }
      return new Handlebars.SafeString(JSON.stringify(obj));
    },
    eq: (v1, v2) => v1 === v2,
    isEmptyObject: (obj) => {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    }
  }
});
//stackoverflow on how to use spaced atrribute objects in handlebars
handlebarsInstance.handlebars.registerHelper('getProperty', function(object, property){
  return object[property];
});
handlebarsInstance.handlebars.registerHelper('json', function(context){
  return JSON.stringify(context);
});

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

// Listen on port 3000
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
