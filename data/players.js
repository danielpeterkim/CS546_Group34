//import mongo collections, bcrypt and implement the following data functions
import { players as playersCollection } from '../config/mongoCollections.js';
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
    level: 0,
    gold: 0,
    wood: 0,
    stone: 0,
    amber: 0,
    tasks: [task1, task2, task3],
    buildings: {}
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
