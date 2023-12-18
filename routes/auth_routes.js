//import express, express router as shown in lecture code
import express from 'express';
import * as playerHelper from "../data/players.js";
import * as unitHelper from "../data/units.js";
import xss from 'xss';
import { players as playersCollection } from '../config/mongoCollections.js';

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
      req.session.player = player;
      res.redirect('/city')
  } catch (e) {
      res.status(400).render('login', { error: e.message });
  }
  });

  router.route('/city').get(async (req, res) => {
    try {
      if (!req.session.player) {
        return res.redirect('/login');
      }
  
      // Removed the storage_capacity calculations
      res.render('city', {
        username: req.session.player.username.trim(),
        xp: req.session.player.xp,
        level: req.session.player.level,
        gold: req.session.player.gold,
        wood: req.session.player.wood,
        stone: req.session.player.stone,
        amber: req.session.player.amber,
        tasks: req.session.player.tasks,
        buildings: req.session.player.buildings,
      });
    } catch (error) {
      console.error('Error fetching player buildings:', error);
      res.status(500).render('error');
    }
  });
  



router.route('/pvp').get(async (req, res) => {
  try {
    if(!req.session.player){
      return res.redirect('/login');
    }
    res.render('pvp');


} catch (error) {
  console.error('Error fetching pvp pages:', error);
  res.status(500).render('error');
}
});

router.post('/pvp/targeted-battle', async (req, res) => {
  try {
    let opponentUsername = req.body.targetPlayer;
    if (!opponentUsername){
      return res.render('pvp', { errorMessage: 'No match for player was found'});
    }
    const players = await playersCollection();
    const existingPlayer = await players.findOne({ username: opponentUsername.toLowerCase()});
    if (!existingPlayer){
      return res.render('pvp', { errorMessage: 'User does not exist'});
    }
    const currentPlayer = req.session.player.username;
    const userPlayer = await players.findOne({username: currentPlayer.toLowerCase()});

    const allUnits = await unitHelper.getAllUnits();
    req.session.inCombat = true;
    res.render('battleprep',{
      opponent: existingPlayer,
      units: allUnits,
      userResources: userPlayer
    });
  } catch (error) {
    console.error('Error in targeted-battle:', error);
    res.render('error', {message: 'An error occurred'});
  }
});



router.post('/pvp/random-attack', async (req, res) => {
  try {
    const currentPlayer = req.session.player.username;
    const players = await playersCollection();
    //https://stackoverflow.com/questions/2824157/how-can-i-get-a-random-record-from-mongodb
    const randomOpponent = await players.aggregate([
        {$match: {username: {$ne: currentPlayer}}},
        {$sample: {size: 1}}
    ]).toArray();

    if(randomOpponent.length === 0) {
        return res.status(404).json({ success: false, message: 'No opponents found'});
    }
    const userPlayer = await players.findOne({username: currentPlayer.toLowerCase()});

    const allUnits = await unitHelper.getAllUnits();
    req.session.inCombat = true;
    res.render('battleprep',{
      opponent: randomOpponent[0],
      units: allUnits,
      userResources: userPlayer
    });
  } catch (error) {
    console.error('Error in random-battle:', error);
    res.status(500).render('error', {message: 'Server error'});
  }
});


router.post('/pvp/execute-battle', async (req, res) => {
  try {
    const username = req.session.player.username;
    const selectedUnits = req.body.units;
    const opponent = JSON.parse(req.body.opponent);
    const allUnits = await unitHelper.getAllUnits();

    const totalcost = await playerHelper.validateUnitPurchase(username, selectedUnits, allUnits);
    await playerHelper.deductResources(username, totalcost);

    let unitsArray = Object.keys(selectedUnits).map(unitName => ({
        ...allUnits.find(unit => unit.unitName === unitName),
        quantity: selectedUnits[unitName]
    }));
    console.log(unitsArray);
    console.log(opponent.buildings);
    const result = playerHelper.simulateBattle(unitsArray, opponent.buildings['Castle'] * 10, opponent.buildings);
    res.render('battleresults', { result: { message: `${result}` } });
} catch (error) {
    res.status(400).send(error.message);
  }
});



router.route('/tasks').get(async (req, res) => {
  if(!req.session.player){
    return res.redirect('/login');
  }
  res.render('tasks', {
    tasks: req.session.player.tasks,
    reward: req.session.player.level,
    username: req.session.player.username
  })
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

router.post('/buy-building', async (req, res) => {
  try {
    const username = req.session.player.username; 
    const building = req.body.building;
    const updatedPlayer = await playerHelper.buyBuilding(username, building);

    res.json(updatedPlayer);
  } catch (error) {
    console.error('Error in buyBuilding:', error);
    res.status(500).json({ error: error.message });
  }
});
router.post('/destroy-building', async (req, res) => {
  try {
    const username = req.session.player.username; 
    const building = req.body.building;
    const updatedPlayer = await playerHelper.destroyBuilding(username, building);

    res.json(updatedPlayer);
  } catch (error) {
    console.error('Error in destroyBuilding:', error);
    res.status(500).json({ error: error.message });
  }
});
router.post('/get-player', async (req, res) => {
  try {
    const playerData = await playerHelper.getPlayer(req.session.player.username);
    res.json(playerData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
