//import express, express router as shown in lecture code
import express from 'express';
import * as playerHelper from "../data/players.js";
import xss from 'xss';

const router = express.Router();

router.route('/').get(async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});


router
  .route('/register')
  .get(async (req, res) => {
    if (req.session.player) {
      return res.render('/city');
    }
    res.render('register');
  })
  .post(async (req, res) => {
    try {
      //const {usernameInput, passwordInput, confirmPasswordInput} = req.body;
      const usernameInput = xss(req.body.usernameInput);
      const passwordInput = xss(req.body.passwordInput);
      const confirmPasswordInput = xss(req.body.confirmPasswordInput);
      console.log(passwordInput);
      if(!usernameInput || !passwordInput){
        throw new Error("Username and/or password was not supplied");
      }
      if (typeof usernameInput !== 'string' || usernameInput.trim().length < 4 || usernameInput.trim().length > 12) {
        throw new Error('Username must be between 4 to 12 characters long');
      }
      //used online generator to generate ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$
      if (passwordInput.length < 8 || !passwordInput.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)) {
        throw new Error('Password needs to be at least 8 characters long, at least one uppercase character, there has to be at least one number and there has to be at least one special character');
      }
      if(passwordInput !== confirmPasswordInput) {
          throw new Error('Passwords do not match');
      }
      const newplayer = await playerHelper.registerPlayer(usernameInput.trim(), passwordInput.trim(), confirmPasswordInput.trim());
      res.redirect('/login');
  }catch (e){
      res.status(400).render('register', {error: e.message});
  }
  });

router
  .route('/login')
  .get(async (req, res) => {
    if (req.session.player) {
      return res.redirect('/city');
    }
    res.render('login');  })
  .post(async (req, res) => {
    try {
      //const{usernameInput, passwordInput} = req.body;
      const usernameInput = xss(req.body.usernameInput);
      const passwordInput= xss(req.body.passwordInput);
      if(!usernameInput || !passwordInput){
        throw new Error("Username and/or password was not supplied");
      }
      //used online generator to generate ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$
      if (passwordInput.length < 8 || !passwordInput.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)) {
        throw new Error('Password needs to be at least 8 characters long, at least one uppercase character, there has to be at least one number and there has to be at least one special character');
      }
      const player = await playerHelper.loginPlayer(usernameInput, passwordInput);
      req.session.player = {username: player.username};
      res.redirect('/city')
  } catch (e) {
      res.status(400).render('login', { error: e.message });
  }
  });

router.route('/city').get(async (req, res) => {
  if(!req.session.player){
    return res.redirect('/login');
  }
  const currentTime = new Date().toLocaleTimeString();
  //added all the player database info for use in city. you can access these in city by calling on their variable names
  res.render('city',{
    username: req.session.player.username.trim(),
    xp: req.session.player.xp,
    level: req.session.player.level,
    gold: req.session.player.gold,
    wood: req.session.player.wood,
    stone: req.session.player.stone,
    amber: req.session.player.amber,
    tasks: req.session.player.tasks,
    buildings: req.session.player.buildings
  }
)
});
router.route('/error').get(async (req, res) => {
  res.status(500).render('error');
});

router.route('/logout').get(async (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
        if(err){
            console.error('Error destroying session:', err);
            return res.status(500).render('error', { message: 'Error logging out. Please try again.' });
        }
        res.clearCookie('AuthState');
        res.render('logout');
    });
} else {
    res.render('logout');
}
});

export default router;
