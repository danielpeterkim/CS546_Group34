import { createBuilding } from './data/buildings.js';
import { buildings as buildingsCollection } from "./config/mongoCollections.js";
import { createUnit } from './data/units.js';
import { army_units as unitsCollection } from "./config/mongoCollections.js";
import { createPlayerForSeed } from './data/players.js';
import { players as playersCollection } from "./config/mongoCollections.js";


async function seedBuildings() {
    try {
        const buildings = await buildingsCollection();
        await buildings.deleteMany({});
        const buildingsToSeed = [
            {
                buildingName: 'Gold Generator',
                buildingDescription: 'Generates 1 gold for your city.',
                buildingCost: { gold: 40, wood: 0, stone: 0 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 1, wood_prod: 0, stone_prod: 0, amber_prod: 0 },
                icon: 'https://i.ibb.co/Z6wvd4K/Coin-Generator.png'
            },
            {
                buildingName: 'Amber Generator',
                buildingDescription: 'Generates 1 amber for your city.',
                buildingCost: { gold: 50, wood: 0, stone: 0 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 1 },
                icon: 'https://i.ibb.co/PQwD3zD/Amber-Generator.png' 
            },
            {
                buildingName: 'Wood Generator',
                buildingDescription: 'Generates 1 wood for your city.',
                buildingCost: { gold: 60, wood: 0, stone: 0 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 1, stone_prod: 0, amber_prod: 0 },
                icon: 'https://i.ibb.co/QvN2yyy/Wood-Generator.png' 
            },
            {
                buildingName: 'Stone Generator',
                buildingDescription: 'Generates 1 stone for your city.',
                buildingCost: { gold: 40, wood: 10, stone: 0 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 1, amber_prod: 0 },
                icon: 'https://i.ibb.co/gSz1VSN/Stone-Generator.png' ,
            },
            {
                buildingName: 'Gold Storage',
                buildingDescription: 'Increase gold storage in your city by 200.',
                buildingCost: { gold: 20, wood: 20, stone: 20 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0 },
                icon: 'https://i.ibb.co/4szRP4P/Coin-Storage.png' 
            },
            {
                buildingName: 'Amber Storage',
                buildingDescription: 'Increase amber storage in your city by 200.',
                buildingCost: { gold: 20, wood: 20, stone: 30 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0},
                icon: 'https://i.ibb.co/xfVfN6T/Amber-Storage.png' 
            },
            {
                buildingName: 'Wood Storage',
                buildingDescription: 'Increase wood storage in your city by 200.',
                buildingCost: { gold: 30, wood: 30, stone: 20 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0 },
                icon: 'https://i.ibb.co/5k9ZFTv/Wood-Storage.png' 
            },
            {
                buildingName: 'Stone Storage',
                buildingDescription: 'Increase stone storage in your city by 200.',
                buildingCost: { gold: 30, wood: 30, stone: 30 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0},
                icon: 'https://i.ibb.co/Bj0dmH8/Stone-Storage.png' 
            },
            {
                buildingName: 'Archer Tower',
                buildingDescription: 'Increases your chance to unalive unarmored and armored units.',
                buildingCost: { gold: 50, wood: 50, stone: 20 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 2, dmg_to_ranged: 3, dmg_to_magic: 1 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0},
                icon: 'https://i.ibb.co/MfYNbC5/Archer-Tower.png' 
            },
            {
                buildingName: 'Spell Tower',
                buildingDescription: 'A powerful tower that will defend your city from tough opponents',
                buildingCost: { gold: 100, wood: 60, stone: 150 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 10, dmg_to_ranged: 8, dmg_to_magic: 5 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0},
                icon: 'https://i.ibb.co/Lgwd2RQ/Spell-Tower.png' 
            },
            {
                buildingName: 'Castle',
                buildingDescription: 'The center of your city and protection from outside forces.',
                buildingCost: { gold: 100, wood: 100, stone: 100 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0},
                icon: 'https://i.ibb.co/TYfmdXs/Castle.png' 
            },
            {
                buildingName: 'Barracks',
                buildingDescription: 'Train stronger and more lethal troops.',
                buildingCost: { gold: 70, wood: 50, stone: 30 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0},
                icon: 'https://i.ibb.co/VvqKvd4/Barracks.png' 
            },
            {
                buildingName: 'Magic Academy',
                buildingDescription: 'Train your troops in the arcane and mystery.',
                buildingCost: { gold: 140, wood: 190, stone: 130 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0},
                icon: 'https://i.ibb.co/k2m4Ym3/Magic-Academy.png' 
            },
            {
                buildingName: 'Army Camp',
                buildingDescription: 'Increase the amount of troops you can deploy in combat.',
                buildingCost: { gold: 40, wood: 40, stone: 20 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0},
                icon: 'https://i.ibb.co/sqWfvVG/Army-Camp.png' 
            }
            
        ];

        for (const building of buildingsToSeed) {
            await createBuilding(
                building.buildingName,
                building.buildingDescription,
                building.buildingCost,
                building.unlockLevel,
                building.lethality,
                building.resourceProduction,
                building.icon
            );
        }

        console.log('Buildings seeded successfully');
        const units = await unitsCollection();
        await units.deleteMany({});
        const unitsToSeed = [
            {
                unitName: "Swords Man",
                unitCost: {gold: 10 , wood: 5, stone: 10, amber: 10}, 
                accuracy: 80,
                damage_per_hit: 2,
                mortality: 30,
                type: "melee",
                armor: "armored",
                size: 2,
                icon: "https://i.ibb.co/4K9BgLL/tile056.png"        
            },
            {
                unitName: "Archer",
                unitCost: {gold: 10 , wood: 10, stone: 5, amber: 15}, 
                accuracy: 30,
                damage_per_hit: 1,
                mortality: 15,
                type: "ranged",
                armor: "unarmored",
                size: 1,
                icon: "https://i.ibb.co/nmLsPLL/tile075.png"        
            },
            {
                unitName: "Bezerker",
                unitCost: {gold: 10 , wood: 15, stone: 15, amber: 20}, 
                accuracy: 90,
                damage_per_hit: 3,
                mortality: 60,
                type: "melee",
                armor: "armored",
                size: 3, 
                icon: "https://i.ibb.co/t4RJFq8/tile064.png"        
            },
            {
                unitName: "Ranger",
                unitCost: {gold: 15 , wood: 20, stone: 10, amber: 15}, 
                accuracy: 55,
                damage_per_hit: 2,
                mortality: 10,
                type: "ranged",
                armor: "unarmored",
                size: 1, 
                icon: "https://i.ibb.co/Q8DWtB5/tile076.png"        
            },
            {
                unitName: "Juggernaut",
                unitCost: {gold: 50 , wood: 30, stone: 40, amber: 50}, 
                accuracy: 5,
                damage_per_hit: 5,
                mortality: 8,
                type: "melee",
                armor: "armored",
                size: 4, 
                icon: "https://i.ibb.co/M2B1j64/tile110.png"        
            },
            {
                unitName: "Boomer",
                unitCost: {gold: 90 , wood: 40, stone: 70, amber: 80}, 
                accuracy: 80,
                damage_per_hit: 4,
                mortality: 10,
                type: "ranged",
                armor: "armored",
                size: 4,
                icon: "https://i.ibb.co/kmkYfFy/tile081.png"       
            },
            {
                unitName: "Apprentice Mage",
                unitCost: {gold: 60 , wood: 40, stone: 50, amber: 40}, 
                accuracy: 100,
                damage_per_hit: 2,
                mortality: 20,
                type: "magic",
                armor: "magic armor",
                size: 1,
                icon: "https://i.ibb.co/zV3qNCT/tile114.png"        
            },
            {
                unitName: "Shaman", 
                unitCost: {gold: 90 , wood: 90, stone: 60, amber: 100}, 
                accuracy: 100,
                damage_per_hit: 3,
                mortality: 10,
                type: "magic",
                armor: "magic armor",
                size: 2,
                icon: "https://i.ibb.co/tDX6X10/tile116.png"        
            },
            {
                unitName: "True Sage",
                unitCost: {gold: 300 , wood: 400, stone: 500, amber: 600}, 
                accuracy: 100,
                damage_per_hit: 10,
                mortality: 1,
                type: "magic",
                armor: "magic armor",
                size: 7,
                icon: "https://i.ibb.co/bmTV9Yh/tile118.png"        
            }
        ]

        for (const units of unitsToSeed) {
            await createUnit(
                units.unitName,
                units.unitCost,
                units.accuracy,
                units.damage_per_hit,
                units.mortality,
                units.type,
                units.armor,
                units.size,
                units.icon
            );
        }
        console.log('Units seeded successfully');
    } catch (error) {
        console.error('Error seeding:', error);
    }
}

async function seedPlayers() {
    try {
        // Define the players you want to seed
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
        const playersToSeed = [
            {
                username: 'noob1',
                password: 'Password123!',
                xp: 100,
                level: 2,
                gold: 200,
                wood: 150,
                stone: 100,
                amber: 50,
                tasks: [task1, task2, task3],
                buildings: { 'Castle' : 1, 'Gold Generator': 2, 'Gold Storage': 2, 'Wood Storage': 1, "Archer Tower": 2, 'Army Camp': 2}
            },
            {
                username: 'player1',
                password: 'Password123@',
                xp: 100,
                level: 5,
                gold: 200,
                wood: 150,
                stone: 100,
                amber: 50,
                tasks: [task1, task2, task3],
                buildings: {  'Castle' : 3, 'Gold Generator': 4, 'Gold Storage': 4, 'Wood Storage': 2, 'Stone Generator': 2 ,"Archer Tower": 5 , 'Army Camp': 5}
            },
            {
                username: 'thebest',
                password: 'theBest1!',
                xp: 100,
                level: 10,
                gold: 200,
                wood: 150,
                stone: 100,
                amber: 50,
                tasks: [task1, task2, task3],
                buildings: { 'Castle' : 6,'Gold Generator': 10, 'Gold Storage': 10,'Wood Generator': 10,'Wood Storage': 7,'Stone Generator': 10,'Stone Storage': 7,'Amber Generator': 10,'Amber Storage': 7, "Archer Tower": 7, 'Spell Tower': 2 , 'Army Camp': 20}
            }
        ];
        const player = await playersCollection();
        await player.deleteMany({});
        for (const player of playersToSeed) {
            await createPlayerForSeed(player);
        }

        console.log('Players seeded successfully');
    } catch (error) {
        console.error('Error seeding players:', error);
    }
}


seedBuildings();

seedPlayers();
