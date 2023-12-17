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

  let newPlayer = {
    username: username.trim(),
    password: hashedPassword,
    xp: 0,
    level: 0,
    gold: 0,
    wood: 0,
    stone: 0,
    amber: 0,
    tasks: [],
    buildings: {},
    lastCollect: Date.now(),
    capacity: {},
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
  delete existingPlayer.password;
  return existingPlayer;
};

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
  const tickNumber = 1000000;
  const goldGenerator = gold_generator;
  const woodGenerator = wood_generator;
  const stoneGenerator = stone_generator;
  const amberGenerator = amber_generator;

  //resource calcuation
  const buildings = await buildingsCollection();
  const buildingGoldInfo = await buildings.findOne({ buildingName: goldGenerator});
  const buildingWoodInfo = await buildings.findOne({ buildingName: woodGenerator});
  const buildingStoneInfo = await buildings.findOne({ buildingName: stoneGenerator});
  const buildingAmberInfo = await buildings.findOne({ buildingName: amberGenerator});

  const ticks = (currentTime - existingPlayer.lastCollect)

  const playerGold = existingPlayer.gold + ticks / tickNumber * existingPlayer.buildings[goldGenerator] * buildingGoldInfo.resourceProduction.gold_prod;
  const playerWood = existingPlayer.wood + ticks / tickNumber * existingPlayer.buildings[woodGenerator] * buildingWoodInfo.resourceProduction.wood_prod;
  const playerStone = existingPlayer.stone + ticks / tickNumber * existingPlayer.buildings[stoneGenerator] * buildingStoneInfo.resourceProduction.stone_prod;
  const playerAmber = existingPlayer.amber + ticks / tickNumber * existingPlayer.buildings[amberGenerator] * buildingAmberInfo.resourceProduction.amber_prod;


  //checking if buying is valid
  const buildingBuyingInfo = await buildings.findOne({ buildingName: building});
  if(!buildingBuyingInfo){
    throw new Error("Building you are trying to buy does not exist");
  }
  const buildingCostOfBuying = buildingBuyingInfo.buildingCost;
  // cost of buying should scale with building amount, this will need to be updated for balance
  //if there exist more than 0 buildings, increase cost of buildings
  const costScale = .3;
  if(existingPlayer.buildings[building]){
    costScale = costScale * existingPlayer.buildings[building];
  }
  else{
    //else, remains basic cost
    costScale = 0;
  }

  if(playerGold - (buildingCostOfBuying.gold + buildingCostOfBuying.gold * costScale) < 0 || playerWood - buildingCostOfBuying.wood < 0 || playerStone - buildingCostOfBuying.stone < 0){
    throw new Error("Not enough resources.");
  }
  //
  if(existingPlayer.buildings[building]){
    existingPlayer.buildings[building]++;
  }else{
    existingPlayer.buildings[building] = 1;
  }
  playerGold -= buildingCostOfBuying.gold;
  playerWood -= buildingCostOfBuying.wood;
  playerStone -= buildingCostOfBuying.stone;
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
