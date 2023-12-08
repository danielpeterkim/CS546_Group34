// TODO: Export and implement the following functions in ES6 format
import { army_units } from "./mongoCollections.js";
import {ObjectId} from 'mongodb';
import isURL from 'is-url';

export const createUnit = async (
    unitName, 
    unitCost,
    accuracy,
    damage_per_hit,
    mortality,
    unit_type,
    armor,
    size,
    icon
) => {
    if (!unitName) throw 'Error: Missing unit name.';
    if (!unitCost) throw 'Error: Missing unit cost.';
    if (!damage_per_hit) throw 'Error: Missing unit damage-per-hit.';
    if (!accuracy) throw 'Error: Missing unit accuracy.';
    if (!mortality) throw 'Error: Missing unit mortality chance.';
    if (!unit_type) throw 'Error: Missing unit type.';
    if (!armor) throw 'Error: Missing unit armor';
    if (!size) throw 'Error: Missing unit size.';
    if (!icon) throw 'Error: Missing unit image link.';

    if (typeof unitName !== 'string') throw 'Error: Unit Name must be a string';
    if (unitName.trim().length <= 0) throw `Error: Unit Name cannot be empty.`;
    unitName = unitName.trim();

    if (typeof unitCost !== 'object') throw "Error: Unit cost is not an object.";
    let cost_a = unitCost.amber;
    let cost_g = unitCost.gold;
    let cost_w = unitCost.wood;
    let cost_s = unitCost.stone;
    if (cost_a === null || cost_a === undefined) throw "Error: Amber cost is missing.";
    if (cost_g === null || cost_g === undefined) throw "Error: Gold cost is missing.";
    if (cost_w === null || cost_w === undefined) throw "Error: Wood cost is missing.";
    if (cost_s === null || cost_s === undefined) throw "Error: Stone cost is missing.";
    if (typeof cost_a !== 'number') throw "Error: Amber cost is not a number.";
    if (!Number.isInteger(cost_a)) throw "Error: Amber cost is not an integer.";
    if (cost_a < 0) throw "Error: Amber cost cannot be negative.";
    if (typeof cost_g !== 'number') throw "Error: Gold cost is not a number.";
    if (!Number.isInteger(cost_g)) throw "Error: Gold cost is not an integer.";
    if (cost_g < 0) throw "Error: Gold cost cannot be negative.";
    if (typeof cost_w !== 'number') throw "Error: Wood cost is not a number.";
    if (!Number.isInteger(cost_w)) throw "Error: Wood cost is not an integer.";
    if (cost_w < 0) throw "Error: Wood cost cannot be negative.";
    if (typeof cost_s !== 'number') throw "Error: Stone cost is not a number.";
    if (!Number.isInteger(cost_s)) throw "Error: Stone cost is not an integer.";
    if (cost_s < 0) throw "Error: Stone cost cannot be negative.";

    if (typeof accuracy !== "number") throw "Error: Accuracy is not a number.";
    if (!Number.isInteger(accuracy)) throw "Error: Accuracy is not an integer.";
    if (accuracy > 100) throw "Error: Cannot have a higher accuracy than 100%.";
    if (accuracy < 0) throw "Error: Accuracy cannot be negative.";

    if (typeof damage_per_hit !== "number") throw "Error: Damage per hit is not a number.";
    if (!Number.isInteger(damage_per_hit)) throw "Error: Damage per hit is not an integer.";
    if (damage_per_hit < 0) throw "Error: Damage per hit cannot be negative.";

    if (typeof mortality !== "number") throw "Error: Mortality chance is not a number.";
    if (!Number.isInteger(mortality)) throw "Error: Mortality is not an integer.";
    if (mortality > 100) throw "Error: Cannot have a higher mortality chance than 100%.";
    if (mortality < 0) throw "Error: Mortality cannot be negative.";

    if (typeof unit_type !== 'string') throw 'Error: Unit type must be a string';
    if (unit_type.trim().length <= 0) throw `Error: Unit type cannot be empty.`;
    unit_type = unit_type.trim().toLowerCase();
    console.log(unit_type);
    if (unit_type !== 'melee' && unit_type !== 'ranged' && unit_type !== 'magic') throw 'Error: Invalid unit type.';

    if (typeof armor !== 'string') throw 'Error: Armor must be a string';
    if (armor.trim().length <= 0) throw `Error: Armor cannot be empty.`;
    armor = armor.trim().toLowerCase();
    if (armor !== 'unarmored' && armor !== 'armored' && armor !== 'magic armor') throw 'Error: Invalid armor type.';

    if (typeof size !== "number") throw "Error: Unit size is not a number.";
    if (!Number.isInteger(size)) throw "Error: Unit size is not an integer.";
    if (size < 0) throw "Error: Unit size cannot be negative.";

    if (typeof icon !== 'string') throw "Error: Image URL must be a string.";
    if (!isURL(icon)) throw "Error: The image link is an invalid URL.";


    



    let nUnit = {
        unitName: unitName, 
        icon: icon,
        unitCost: unitCost, 
        accuracy: accuracy,
        damage_per_hit: damage_per_hit,
        mortality: mortality,
        type: unit_type,
        armor: armor,
        size: size        
    };
    const armyCollection = await army_units();
    const insertInfo = await armyCollection.insertOne(nUnit);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add building.';
    return {insertedUnit: true};
};

export const getAllUnits = async () => {
    const armyCollection = await army_units();
    let armyList = await armyCollection.find({}, {projection: {_id: 0}}).toArray();
    if (!armyList) throw 'Error: Could not get all buildings';
    return armyList;
};

export const getUnit = async (id) => {
    if (!id) throw 'Error: Missing id.';
    if (typeof id !== 'string') throw 'Error: id is not a string.';
    if (id.trim().length === 0) throw 'Error: id cannot be empty.';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Error: Invalid object ID';
    const armyCollection = await army_units();
    const unit = await armyCollection.findOne({_id: new ObjectId(id)}, {projection: {_id: 0}});
    if (unit === null) throw 'Error: No unit with that id';
    return unit;
};
