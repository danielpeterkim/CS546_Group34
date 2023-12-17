import { createBuilding } from './data/buildings.js';

async function seedBuildings() {
    try {
        const buildingsToSeed = [
            {
                buildingName: 'Coin Generator',
                buildingDescription: 'Generates 1 gold for your city.',
                buildingCost: { gold: 40, wood: 0, stone: 0 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 1, wood_prod: 0, stone_prod: 0, amber_prod: 0 },
                icon: 'your_icon_url_here'
            },
            {
                buildingName: 'Amber Generator',
                buildingDescription: 'Generates 1 amber for your city.',
                buildingCost: { gold: 50, wood: 0, stone: 0 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 1 },
                icon: 'your_icon_url_here' 
            },
            {
                buildingName: 'Wood Generator',
                buildingDescription: 'Generates 1 wood for your city.',
                buildingCost: { gold: 60, wood: 0, stone: 0 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 1, stone_prod: 0, amber_prod: 0 },
                icon: 'your_icon_url_here' 
            },
            {
                buildingName: 'Stone Generator',
                buildingDescription: 'Generates 1 stone for your city.',
                buildingCost: { gold: 40, wood: 10, stone: 0 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 1, amber_prod: 0 },
                icon: 'your_icon_url_here' ,
            },
            {
                buildingName: 'Gold Storage',
                buildingDescription: 'Increase gold storage in your city by 200.',
                buildingCost: { gold: 20, wood: 20, stone: 20 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0 },
                icon: 'your_icon_url_here' 
            },
            {
                buildingName: 'Amber Storage',
                buildingDescription: 'Increase amber storage in your city by 200.',
                buildingCost: { gold: 20, wood: 20, stone: 30 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0},
                icon: 'your_icon_url_here' 
            },
            {
                buildingName: 'Wood Storage',
                buildingDescription: 'Increase wood storage in your city by 200.',
                buildingCost: { gold: 30, wood: 30, stone: 20 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0 },
                icon: 'your_icon_url_here' 
            },
            {
                buildingName: 'Stone Storage',
                buildingDescription: 'Increase stone storage in your city by 200.',
                buildingCost: { gold: 30, wood: 30, stone: 30 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0},
                icon: 'your_icon_url_here' 
            },
            {
                buildingName: 'Archer Tower',
                buildingDescription: 'Increases your chance to unalive unarmored and armored units.',
                buildingCost: { gold: 50, wood: 50, stone: 20 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 2, dmg_to_ranged: 3, dmg_to_magic: 1 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0},
                icon: 'your_icon_url_here' 
            },
            {
                buildingName: 'Spell Tower',
                buildingDescription: 'A powerful tower that will defend your city from tough opponents',
                buildingCost: { gold: 100, wood: 60, stone: 150 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 10, dmg_to_ranged: 8, dmg_to_magic: 5 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0},
                icon: 'your_icon_url_here' 
            },
            {
                buildingName: 'Castle',
                buildingDescription: 'The center of your city and protection from outside forces.',
                buildingCost: { gold: 100, wood: 100, stone: 100 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0},
                icon: 'your_icon_url_here' 
            },
            {
                buildingName: 'Barracks',
                buildingDescription: 'Train stronger and more lethal troops.',
                buildingCost: { gold: 70, wood: 50, stone: 30 },
                unlockLevel: 1,
                lethality: { dmg_to_melee: 0, dmg_to_ranged: 0, dmg_to_magic: 0 },
                resourceProduction: { gold_prod: 0, wood_prod: 0, stone_prod: 0, amber_prod: 0},
                icon: 'your_icon_url_here' 
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
    } catch (error) {
        console.error('Error seeding buildings:', error);
    }
}

seedBuildings();
