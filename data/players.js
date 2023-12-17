//import mongo collections, bcrypt and implement the following data functions
import { players as playersCollection } from '../config/mongoCollections.js';
import { buildings as buildingsCollection } from '../config/mongoCollections.js';

import bcrypt from 'bcryptjs';
export const registerPlayer = async (
  username,
  password,
  confirmPassword
  ) => {
  if(!username || !password){
    throw new Error("Username and/or password was not supplied");
  }
  if (typeof username !== 'string' || username.trim().length < 4 || username.trim().length > 12) {
    throw new Error('Username must be between 4 to 12 characters long');
  }
  //used online generator to generate ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$
  if (password.length < 8 || !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)) {
    throw new Error('Password needs to be at least 8 characters long, at least one uppercase character, there has to be at least one number and there has to be at least one special character');
  }
  if(password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
  const insensitiveCaseUsername = username.toLowerCase();
  const players = await playersCollection();
  const existingPlayer = await players.findOne({ username: insensitiveCaseUsername});
  
  if (existingPlayer) {
    throw new Error('A player with that username exists already');
  }
  const hashedPassword = await bcrypt.hash(password, 16);
  let task1 = {
    name: "Task 1",
    description: "Login",
    complete: false,
    complete_date: undefined,
    reward: undefined
  };
  let task2 = {
    name: "Task 2",
    description: "Buy a Building",
    complete: false,
    complete_date: undefined,
    reward: undefined
  };
  let task3 = {
    name: "Task 3",
    description: "Attack Another Player",
    complete: false,
    complete_date: undefined,
    reward: undefined
  };
  let newPlayer = {
    username: username.trim(),
    password: hashedPassword,
    xp: 0,
    level: 1,
    gold: 100,
    wood: 0,
    stone: 0,
    amber: 0,
    tasks: [task1, task2, task3],
    buildings: {},
    lastCollect: Date.now(),
  }

  const insertInfo = await players.insertOne(newPlayer);
  if (insertInfo.insertedCount === 0) {
    throw new Error('Could not register player');
  }
  return {insertedPlayer: true};
}

export const loginPlayer = async (username, password) => {
  if(!username || !password){
    throw new Error("Username and/or password was not supplied");
  }
  //used online generator to generate ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$
  if (password.length < 8 || !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)) {
    throw new Error('Password needs to be at least 8 characters long, at least one uppercase character, there has to be at least one number and there has to be at least one special character');
  }
  const insensitiveCaseUsername = username.toLowerCase();
  const players = await playersCollection();
  const existingPlayer = await players.findOne({ username: insensitiveCaseUsername});
  if (!existingPlayer) {
    throw new Error("Username or password is invalid");
  }
  const passwordsMatch = await bcrypt.compare(password, existingPlayer.password);
  if (!passwordsMatch) {
    throw new Error("Username or password is invalid");
  }
  const date = new Date();
  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();
  let tasks = existingPlayer.tasks;
  let r = existingPlayer.level * 10;
  if (r <= 0){
    r = 10;
  }
  tasks.forEach(task => {
    if (task.complete){
      if(task.complete_date !== undefined){
        const c_date = task.complete_date;
        if(y > c_date.getFullYear() || y == c_date.getFullYear() && m > c_date.getMonth() || y == c_date.getFullYear() && m == c_date.getMonth() && d > c_date.getDate()){
          task.complete_date = undefined;
          task.complete = false;
        }
      }
    }
    task.reward = r;
  });
  let t1 = tasks[0];
  if(!t1.complete){
    t1.complete = true;
    t1.complete_date = date;
    existingPlayer.gold += r;
    existingPlayer.wood += r;
    existingPlayer.stone += r;
    existingPlayer.amber += r;
  };
  existingPlayer.tasks = tasks;
  await players.findOneAndUpdate({username: insensitiveCaseUsername}, {$set: existingPlayer});
  delete existingPlayer.password;
  return existingPlayer;
};

export const getPlayer = async (username) => {
  if(!username){
    throw new Error("Error with authentication, please logout and login");
  }
  const players = await playersCollection();
  const insensitiveCaseUsername = username.toLowerCase();
  const existingPlayer = await players.findOne({ username: insensitiveCaseUsername});
  if (!existingPlayer) {
    throw new Error("You are not a valid user, please restart");
  }
  delete existingPlayer.password;

  //variables to change, tick, building names
  const tickNumber = 1000;
  const goldGenerator = "Gold Generator";
  const woodGenerator = "Wood Generator";
  const stoneGenerator = "Stone Generator";
  const amberGenerator = "Amber Generator";

  //resource calcuation
  const buildings = await buildingsCollection();
  const buildingGoldInfo = await buildings.findOne({ buildingName: goldGenerator});
  const buildingWoodInfo = await buildings.findOne({ buildingName: woodGenerator});
  const buildingStoneInfo = await buildings.findOne({ buildingName: stoneGenerator});
  const buildingAmberInfo = await buildings.findOne({ buildingName: amberGenerator});

  const currentTime = Date.now()
  const ticks = (currentTime - existingPlayer.lastCollect)
  let goldGenCount = 0
  let woodGenCount = 0
  let stoneGenCount = 0
  let amberGenCount = 0
  if(existingPlayer.buildings[goldGenerator]){
    goldGenCount = existingPlayer.buildings[goldGenerator]
  }
  if(existingPlayer.buildings[woodGenerator]){
    woodGenCount = existingPlayer.buildings[woodGenerator]
  }
  if(existingPlayer.buildings[stoneGenerator]){
    stoneGenCount = existingPlayer.buildings[stoneGenerator]
  }
  if(existingPlayer.buildings[amberGenerator]){
    amberGenCount = existingPlayer.buildings[amberGenerator]
  }

  let playerGold = existingPlayer.gold + ticks / tickNumber * goldGenCount * buildingGoldInfo.resourceProduction.gold_prod;
  let playerWood = existingPlayer.wood + ticks / tickNumber * woodGenCount * buildingWoodInfo.resourceProduction.wood_prod;
  let playerStone = existingPlayer.stone + ticks / tickNumber * stoneGenCount * buildingStoneInfo.resourceProduction.stone_prod;
  let playerAmber = existingPlayer.amber + ticks / tickNumber * amberGenCount * buildingAmberInfo.resourceProduction.amber_prod;
  await players.updateOne(
    { username: insensitiveCaseUsername },
    {
      $set: {
        gold: playerGold,
        wood: playerWood,
        stone: playerStone,
        amber: playerAmber,
        buildings: existingPlayer.buildings,
        lastCollect: currentTime
      }
    }
  )
  const updatedPlayer = {
    ...existingPlayer,
    gold: playerGold,
    wood: playerWood,
    stone: playerStone,
    amber: playerAmber,
    lastCollect: currentTime
  };

  return updatedPlayer;
}




export const buyBuilding = async(username, building) => {
  if(!username){
    throw new Error("Error with authentication, please logout and login");
  }
  if(!building){
    throw new Error("Building not selected");
  }
  const currentTime = Date.now();
  const players = await playersCollection();
  const insensitiveCaseUsername = username.toLowerCase();
  const existingPlayer = await players.findOne({ username: insensitiveCaseUsername});
  if (!existingPlayer) {
    throw new Error("You are not a valid user, please restart");
  }
  delete existingPlayer.password;
  //variables to change, tick, building names
  const tickNumber = 1000;
  const goldGenerator = "Gold Generator";
  const woodGenerator = "Wood Generator";
  const stoneGenerator = "Stone Generator";
  const amberGenerator = "Amber Generator";

  //resource calcuation
  const buildings = await buildingsCollection();
  const buildingGoldInfo = await buildings.findOne({ buildingName: goldGenerator});
  const buildingWoodInfo = await buildings.findOne({ buildingName: woodGenerator});
  const buildingStoneInfo = await buildings.findOne({ buildingName: stoneGenerator});
  const buildingAmberInfo = await buildings.findOne({ buildingName: amberGenerator});

  const ticks = (currentTime - existingPlayer.lastCollect)
  let goldGenCount = 0
  let woodGenCount = 0
  let stoneGenCount = 0
  let amberGenCount = 0
  if(existingPlayer.buildings[goldGenerator]){
    goldGenCount = existingPlayer.buildings[goldGenerator]
  }
  if(existingPlayer.buildings[woodGenerator]){
    woodGenCount = existingPlayer.buildings[woodGenerator]
  }
  if(existingPlayer.buildings[stoneGenerator]){
    stoneGenCount = existingPlayer.buildings[stoneGenerator]
  }
  if(existingPlayer.buildings[amberGenerator]){
    amberGenCount = existingPlayer.buildings[amberGenerator]
  }

  console.log(existingPlayer.gold + " " + ticks  + " " +  tickNumber  + " " +  goldGenCount  + " " + buildingGoldInfo.resourceProduction.gold_prod)
  console.log(existingPlayer.wood + " " + ticks  + " " +  tickNumber  + " " +  woodGenCount  + " " + buildingGoldInfo.resourceProduction.wood_prod)
  let playerGold = existingPlayer.gold + ticks / tickNumber * goldGenCount * buildingGoldInfo.resourceProduction.gold_prod;
  let playerWood = existingPlayer.wood + ticks / tickNumber * woodGenCount * buildingWoodInfo.resourceProduction.wood_prod;
  let playerStone = existingPlayer.stone + ticks / tickNumber * stoneGenCount * buildingStoneInfo.resourceProduction.stone_prod;
  let playerAmber = existingPlayer.amber + ticks / tickNumber * amberGenCount * buildingAmberInfo.resourceProduction.amber_prod;


  //checking if buying is valid
  const buildingBuyingInfo = await buildings.findOne({ buildingName: building});
  if(!buildingBuyingInfo){
    throw new Error("Building you are trying to buy does not exist");
  }
  const buildingCostOfBuying = buildingBuyingInfo.buildingCost;
  // cost of buying should scale with building amount, this will need to be updated for balance
  //if there exist more than 0 buildings, increase cost of buildings
  let costScale = .3;
  if(existingPlayer.buildings[building]){
    costScale = costScale * existingPlayer.buildings[building];
  }
  else{
    //else, remains basic cost
    costScale = 0;
  }
  
  if(playerGold - (buildingCostOfBuying.gold + buildingCostOfBuying.gold * costScale) < 0 || playerWood - buildingCostOfBuying.wood < 0 || playerStone - buildingCostOfBuying.stone < 0){
    await players.updateOne(
      { username: insensitiveCaseUsername },
      {
        $set: {
          gold: playerGold,
          wood: playerWood,
          stone: playerStone,
          amber: playerAmber,
          buildings: existingPlayer.buildings,
          lastCollect: currentTime
        }
      }
    );
    throw new Error("Not enough resources.");
  }
  //
  if(existingPlayer.buildings[building]){
    existingPlayer.buildings[building]++;
  }else{
    existingPlayer.buildings[building] = 1;
  }
  playerGold -= (buildingCostOfBuying.gold + buildingCostOfBuying.gold * costScale);
  playerWood -= (buildingCostOfBuying.wood + buildingCostOfBuying.wood * costScale);
  playerStone -= (buildingCostOfBuying.stone + buildingCostOfBuying.stone * costScale);

  

  await players.updateOne(
    { username: insensitiveCaseUsername },
    {
      $set: {
        gold: playerGold,
        wood: playerWood,
        stone: playerStone,
        amber: playerAmber,
        buildings: existingPlayer.buildings,
        lastCollect: currentTime
      }
    }
  );
  const updatedPlayer={
    ...existingPlayer,
    gold: playerGold + buildingCostOfBuying.gold * costScale,
    wood: playerWood + buildingCostOfBuying.wood * costScale,
    stone: playerStone + buildingCostOfBuying.stone * costScale,
    amber: playerAmber,
    lastCollect: currentTime
  };
  return updatedPlayer;
}

export const destroyBuilding = async(username, building) => {
  if(!username){
    throw new Error("Error with authentication, please logout and login");
  }
  if(!building){
    throw new Error("Building not selected");
  }
  const currentTime = Date.now();
  const players = await playersCollection();
  const insensitiveCaseUsername = username.toLowerCase();
  const existingPlayer = await players.findOne({ username: insensitiveCaseUsername});
  if (!existingPlayer) {
    throw new Error("You are not a valid user, please restart");
  }
  delete existingPlayer.password;
  if(existingPlayer.buildings[building] && existingPlayer.buildings[building] > 0){
    existingPlayer.buildings[building]--;
  }else{
    throw new Error("No buildings to destroy");
  }

  await players.updateOne(
    { username: insensitiveCaseUsername },
    {
      $set: {
        buildings: existingPlayer.buildings,
      }
    }
  );
  return existingPlayer;
}



function calculateTotalCost(selectedUnits, allUnits) {
  let totalCost = { gold: 0, wood: 0, stone: 0, amber: 0 , size : 0};

  for (const unitName in selectedUnits) {
      const unitAmount = selectedUnits[unitName];
      const unitInfo = allUnits.find(unit => unit.unitName === unitName);

      if (unitInfo) {
          totalCost.gold += unitAmount * unitInfo.unitCost.gold;
          totalCost.wood += unitAmount * unitInfo.unitCost.wood;
          totalCost.stone += unitAmount * unitInfo.unitCost.stone;
          totalCost.amber += unitAmount * unitInfo.unitCost.amber;
          totalCost.size += unitAmount * unitInfo.size;
      }
  }

  return totalCost;
}




// Function to validate selected units against player's resources
export async function validateUnitPurchase(username, selectedUnits, allUnits) {
  const player = await getPlayer(username);
  const totalCost = calculateTotalCost(selectedUnits, allUnits);

  if (totalCost.gold > player.gold ||
      totalCost.wood > player.wood ||
      totalCost.stone > player.stone ||
      totalCost.amber > player.amber) {
      throw new Error("Not enough resources to purchase selected units.");
  }
  if(totalCost.size > player.buildings['Army Camp'] * 10){
    throw new Error("Not enough space in army camps for selected units.");
  }
  return totalCost;
}



export function simulateBattle(playerUnits, opponentCityHealth, opponentBuildings) {
  let cityHealth = opponentCityHealth;
  let army = [...playerUnits];

  const extraMortalityFromTowers = opponentBuildings['Archer Tower'] * 3 + opponentBuildings['Spell Tower'] * 10;

  while (cityHealth > 0 && army.length > 0) {
      for (let unit of army) {
          if (Math.random() * 100 < unit.accuracy) {
              cityHealth -= unit.damage_per_hit;
              if (cityHealth <= 0) break;
          }
      }

      army = army.filter(unit => Math.random() * 100 >= (unit.mortality + extraMortalityFromTowers));
  }

  return cityHealth <= 0 ? 'Victory' : 'Defeat';
}


export const createPlayerForSeed = async ({
  username,
  password,
  xp = 0,
  level = 1,
  gold = 100,
  wood = 100,
  stone = 100,
  amber = 100,
  tasks = [],
  buildings = {}
}) => {
  if (!username || !password) {
      throw new Error("Username and/or password was not supplied");
  }

  const insensitiveCaseUsername = username.toLowerCase();
  const players = await playersCollection();
  const existingPlayer = await players.findOne({ username: insensitiveCaseUsername });

  if (existingPlayer) {
      throw new Error('A player with that username already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 16);

  let newPlayer = {
      username: username.trim(),
      password: hashedPassword,
      xp,
      level,
      gold,
      wood,
      stone,
      amber,
      tasks,
      buildings,
      lastCollect: new Date()
  };

  const insertInfo = await players.insertOne(newPlayer);
  if (insertInfo.insertedCount === 0) {
      throw new Error('Could not create player for seed');
  }
  return { createdPlayer: true };
};


export const deductResources = async (username, totalCost) => {
  if (!username || !totalCost){
      throw new Error("Missing username or cost information");
  }

  const players = await playersCollection();
  const insensitiveCaseUsername = username.toLowerCase();
  const existingPlayer = await players.findOne({ username: insensitiveCaseUsername });

  if (!existingPlayer) {
      throw new Error("Player does not exist");
  }

  if (existingPlayer.gold < totalCost.gold || existingPlayer.wood < totalCost.wood || existingPlayer.stone < totalCost.stone || existingPlayer.amber < totalCost.amber) {
      throw new Error("Not enough resources to deduct");
  }

  const updatedResources ={
      gold: existingPlayer.gold - totalCost.gold,
      wood: existingPlayer.wood - totalCost.wood,
      stone: existingPlayer.stone - totalCost.stone,
      amber: existingPlayer.amber - totalCost.amber
  };

  const updateInfo = await players.updateOne(
      {username: insensitiveCaseUsername},
      {
          $set: {
              gold: updatedResources.gold,
              wood: updatedResources.wood,
              stone: updatedResources.stone,
              amber: updatedResources.amber
          }
      }
  );

  if (!updateInfo.matchedCount && !updateInfo.modifiedCount){
      throw new Error("Failed to deduct resources");
  }

  return true; // Indicating successful resource deduction
};