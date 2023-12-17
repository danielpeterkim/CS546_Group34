
(function ($) {

    const timeInterval = 5000;

    let firstTime = Date.now();
    let currentTime = firstTime;
    let updates = 0;
    let newUpdates = 0;

    let resources = {gold: 120, wood: 0, stone: 0, amber: 0};
    let resourceProduction = {gold: 1, wood: 0, stone: 0, amber: 0};

    let buildings = [
        {
            _id: '1',
            buildingName: 'Coin Generator', 
            buildingDescription: 'Generates 1 gold for your city.', 
            buildingCost: {gold: 40},
            unlockLevel: 0,
            lethality: 0,
            resourceProduction: {gold: 1},
            icon: null
        },

        {
            _id: '2',
            buildingName: 'Amber Generator',
            buildingDescription: 'Generates 1 amber for your city.',
            buildingCost: {gold: 50},
            unlockLevel: 0,
            lethality: 0,
            resourceProduction: {amber: 1},
            icon: null
        }
    ]

    let resourcesToString = (prodValue) => {
        let s = '('

        for (const [type, amount] of Object.entries(prodValue)) {
            s += `${amount} ${type}, `
        }

        s = s.slice(0, s.length-2);
        s += ')';

        return s;
    }

    $(document).ready(function(){
        for (b of buildings) {
            $('.buyButtons').append(`<button id=button_${b._id}>+ ${b.buildingName} ${resourcesToString(b.buildingCost)}</button>`)
        }
    });
    

    let buildingsOwned = {};

    let showResources = () => {
        $('#resourceText').text(`gold: ${resources.gold} (+${resourceProduction.gold}), wood: ${resources.wood} (+${resourceProduction.wood}), stone: ${resources.stone} (+${resourceProduction.stone}), amber: ${resources.amber} (+${resourceProduction.amber})`);
    }

    showResources();

    let passiveResourceUpdate = () => {
        console.log('updating');
        $(document).ready(function(){
            currentTime = Date.now();
            newUpdates = Math.floor((currentTime - firstTime)/timeInterval);
            if (newUpdates > updates) {
                for (const [k, v] of Object.entries(resources)) {
                    resources[k] += (resourceProduction[k] * (newUpdates-updates));
                }
                updates = newUpdates;
                showResources();
            }
        })
    }

    let buyBuilding = (buildingId) => {
        console.log(buildings);
        console.log('bought');
        const buildingBought = buildings.find((b) => b._id === buildingId);
        if (buildingBought === undefined) throw new Error('that building does not exist!');
        let canAfford = true;
        let newResources = {gold: resources.gold, wood: resources.wood, stone: resources.stone, amber: resources.amber};
        for (const [type, amount] of Object.entries(buildingBought.buildingCost)) {
            if (!(type in resources)) throw new Error(`that resource does not exist!`);
            if (resources[type] < amount) {
                canAfford = false;
            } else {
                newResources[type] = resources[type] - amount;
            }
        }
        if (canAfford) {
            if (!(buildingBought.buildingName in buildingsOwned)) {
                buildingsOwned[buildingBought.buildingName] = 1;
            } else {
                buildingsOwned[buildingBought.buildingName] += 1;
            }

            let newProduction = {gold: resourceProduction.gold, wood: resourceProduction.wood, stone: resourceProduction.stone, amber: resourceProduction.amber}
            for (const [type, amount] of Object.entries(buildingBought.resourceProduction)) {
                if (!(type in resourceProduction)) throw new Error('that resource does not exist!');
                newProduction[type] += amount;
            }

            resources = newResources;
            resourceProduction = newProduction;

            $('#noBuildingsText').hide();
            if (!($(`#building_${buildingBought._id}`).length)) {
                $('.buildingsOwned').append(`<p id='building_${buildingBought._id}'>${buildingBought.buildingName}: ${buildingsOwned[buildingBought.buildingName]}</p>`)
            }
            else {
                $(`#building_${buildingBought._id}`).text(`${buildingBought.buildingName}: ${buildingsOwned[buildingBought.buildingName]}`);
            }
            showResources();
        }
    }

    setInterval(passiveResourceUpdate, timeInterval);

    let onButtonClicked = (id) => {
        return function() {
            console.log(`clicked button ${id}`);
            buyBuilding(id);
        }
    }

    $(document).ready(function(){
        for (b of buildings) {
            $(`#button_${b._id}`).click(onButtonClicked(b._id));
        }
    });
    


    

})(window.jQuery);