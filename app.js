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
// if the user is not signed in (cookie wise) and if the current page isn't login or register than you go to login
  if (!req.session.player && (route !== '/login' && route !== '/register')) {
      return res.redirect('/login');
  } else if (req.session.player  && route !== '/city'  && route !== '/logout' && route !== '/buy-building' && route !== '/destroy-building' && route !== '/get-player' && route !== '/report') {
// if the user is signed in and the current page is not city or logout, then you go to city. This is so that players do not need to log in if cookie exist
// You will need to add to this if statement for each route the player can access (pvp, fighting page, etc.)
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
    eq: (v1, v2) => v1 === v2
  }
});

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

// Listen on port 3000
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
