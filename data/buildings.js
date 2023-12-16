import { buildings } from "./mongoCollections.js";
import {ObjectId} from 'mongodb';
import isURL from 'is-url';

export const createBuilding = async (
    buildingName, 
    buildingDescription, 
    buildingCost,
    unlockLevel,
    lethality,
    resourceProduction,
    icon 
    ) => {
    if (!buildingName) throw 'Error: Missing building name.';
    if (!buildingDescription) throw 'Error: Missing building description.';
    if (!buildingCost) throw 'Error: Missing building cost.';
    if (!unlockLevel) throw 'Error: Missing building unlock level.';
    if (!lethality) throw 'Error: Missing building lethality.';
    if (!resourceProduction) throw 'Error: Missing building resource production.';
    if (!icon) throw 'Error: Missing unit image link.';

    if (typeof buildingName !== 'string') throw 'Error: Building Name must be a string';
    if (typeof buildingDescription !== 'string') throw 'Error: Building Description must be a string';
    if (buildingName.trim().length <= 0) throw `Error: Building Name cannot be empty.`;
    if (buildingDescription.trim().length <= 0) throw `Error: Building Description cannot be empty.`;

    if (typeof unlockLevel !== "number") throw "Error: Unlock level is not a number.";
    if (!Number.isInteger(unlockLevel)) throw "Error: Unlock level is not an integer.";

    if (typeof buildingCost !== 'object') throw "Error: Building cost is not an object.";
    let cost_g = buildingCost.gold;
    let cost_w = buildingCost.wood;
    let cost_s = buildingCost.stone;
    if (cost_g === null || cost_g === undefined) throw "Error: Gold cost is missing.";
    if (cost_w === null || cost_w === undefined) throw "Error: Wood cost is missing.";
    if (cost_s === null || cost_s === undefined) throw "Error: Stone cost is missing.";
    if (typeof cost_g !== 'number') throw "Error: Gold cost is not a number.";
    if (!Number.isInteger(cost_g)) throw "Error: Gold cost is not an integer.";
    if (cost_g < 0) throw "Error: Gold cost cannot be negative.";
    if (typeof cost_w !== 'number') throw "Error: Wood cost is not a number.";
    if (!Number.isInteger(cost_w)) throw "Error: Wood cost is not an integer.";
    if (cost_w < 0) throw "Error: Wood cost cannot be negative.";
    if (typeof cost_s !== 'number') throw "Error: Stone cost is not a number.";
    if (!Number.isInteger(cost_s)) throw "Error: Stone cost is not an integer.";
    if (cost_s < 0) throw "Error: Stone cost cannot be negative.";

    if (typeof lethality !== 'object') throw "Error: Lethality index is not an object.";
    let melee = lethality.dmg_to_melee;
    let ranged = lethality.dmg_to_ranged;
    let magic = lethality.dmg_to_magic;
    if (melee === null || melee === undefined) throw "Error: Damage to melee troops is missing.";
    if (ranged === null || ranged === undefined) throw "Error: Damage to ranged troops is missing.";
    if (magic === null || magic === undefined) throw "Error: Damage to magic troops is missing.";
    if (typeof melee !== 'number') throw "Error: Damage to melee troops is not a number.";
    if (!Number.isInteger(melee)) throw "Error: Damage to melee troops is not an integer.";
    if (melee < 0) throw "Error: Damage to melee troops cannot be negative.";
    if (typeof ranged !== 'number') throw "Error: Damage to ranged troops is not a number.";
    if (!Number.isInteger(ranged)) throw "Error: Damage to ranged troops is not an integer.";
    if (ranged < 0) throw "Error: Damage to ranged troops cannot be negative.";
    if (typeof magic !== 'number') throw "Error: Damage to magic troops is not a number.";
    if (!Number.isInteger(magic)) throw "Error: Damage to magic troops is not an integer.";
    if (magic < 0) throw "Error: Damage to magic troops cannot be negative.";

    if (typeof resourceProduction !== 'object') throw "Error: Resource Production field is not an object.";
    let prod_g = resourceProduction.gold_prod;
    let prod_w = resourceProduction.wood_prod;
    let prod_s = resourceProduction.stone_prod;
    let prod_d = resourceProduction.amber_prod;
    if (prod_g === null || prod_g === undefined) throw "Error: Gold production is missing.";
    if (prod_w === null || prod_w === undefined) throw "Error: Wood production is missing.";
    if (prod_s === null || prod_s === undefined) throw "Error: Stone production is missing.";
    if (prod_d === null || prod_d === undefined) throw "Error: Amber production is missing.";
    if (typeof prod_g !== 'number') throw "Error: Gold production is not a number.";
    if (!Number.isInteger(prod_g)) throw "Error: Gold production is not an integer.";
    if (prod_g < 0) throw "Error: Gold production cannot be negative.";
    if (typeof prod_w !== 'number') throw "Error: Wood production is not a number.";
    if (!Number.isInteger(prod_w)) throw "Error: Wood production is not an integer.";
    if (prod_w < 0) throw "Error: Wood production cannot be negative.";
    if (typeof prod_s !== 'number') throw "Error: Stone production is not a number.";
    if (!Number.isInteger(prod_s)) throw "Error: Stone production is not an integer.";
    if (prod_s < 0) throw "Error: Stone production cannot be negative.";
    if (typeof prod_d !== 'number') throw "Error: Amber production is not a number.";
    if (!Number.isInteger(prod_d)) throw "Error: Amber production is not an integer.";
    if (prod_d < 0) throw "Error: Amber production cannot be negative.";

    if (typeof icon !== 'string') throw "Error: Image URL must be a string.";
    if (!isURL(icon)) throw "Error: The image link is an invalid URL.";

    buildingName = buildingName.trim();
    buildingDescription = buildingDescription.trim();

    let nBuilding = {
        buildingName: buildingName, 
        buildingDescription: buildingDescription, 
        icon: icon,
        buildingCost: buildingCost, 
        unlockLevel: unlockLevel,
        lethality: lethality,
        resourceProduction: resourceProduction
    };
    const buildingCollection = await buildings();
    const insertInfo = await buildingCollection.insertOne(nBuilding);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add building.';
    return {insertedBuilding: true};
};

export const getAllBuildings = async () => {
    const buildingCollection = await buildings();
    let buildList = await buildingCollection.find({}, {projection: {_id: 0}}).toArray();
    if (!buildList) throw 'Error: Could not get all buildings';
    return buildList;
};

export const getBuilding = async (id) => {
    if (!id) throw 'Error: Missing id.';
    if (typeof id !== 'string') throw 'Error: id is not a string.';
    if (id.trim().length === 0) throw 'Error: id cannot be empty.';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Error: Invalid object ID';
    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({_id: new ObjectId(id)}, {projection: {_id: 0}});
    if (building === null) throw 'Error: No building with that id';
    return building;
};