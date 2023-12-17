(function ($) {
    // const timeInterval = 5000;

    // let firstTime = Date.now();
    // let currentTime = firstTime;
    // let updates = 0;
    // let newUpdates = 0;

    // let resources = {gold: 120, wood: 0, stone: 0, amber: 0};
    // let resourceProduction = {gold: 1, wood: 0, stone: 0, amber: 0};

    // let buildings = [
    //     {
    //         _id: '1',
    //         buildingName: 'Coin Generator', 
    //         buildingDescription: 'Generates 1 gold for your city.', 
    //         buildingCost: {gold: 40},
    //         unlockLevel: 0,
    //         lethality: 0,
    //         resourceProduction: {gold: 1},
    //         icon: null
    //     },

    //     {
    //         _id: '2',
    //         buildingName: 'Amber Generator',
    //         buildingDescription: 'Generates 1 amber for your city.',
    //         buildingCost: {gold: 50},
    //         unlockLevel: 0,
    //         lethality: 0,
    //         resourceProduction: {amber: 1},
    //         icon: null
    //     }
    // ]

    // let resourcesToString = (prodValue) => {
    //     let s = '('

    //     for (const [type, amount] of Object.entries(prodValue)) {
    //         s += `${amount} ${type}, `
    //     }

    //     s = s.slice(0, s.length-2);
    //     s += ')';

    //     return s;
    // }

    // $(document).ready(function(){
    //     for (b of buildings) {
    //         $('.buyButtons').append(`<button id=button_${b._id}>+ ${b.buildingName} ${resourcesToString(b.buildingCost)}</button>`)
    //     }
    // });
    

    // let buildingsOwned = {};

    // let showResources = () => {
    //     $('#resourceText').text(`gold: ${resources.gold} (+${resourceProduction.gold}), wood: ${resources.wood} (+${resourceProduction.wood}), stone: ${resources.stone} (+${resourceProduction.stone}), amber: ${resources.amber} (+${resourceProduction.amber})`);
    // }

    // showResources();

    // let passiveResourceUpdate = () => {
    //     console.log('updating');
    //     $(document).ready(function(){
    //         currentTime = Date.now();
    //         newUpdates = Math.floor((currentTime - firstTime)/timeInterval);
    //         if (newUpdates > updates) {
    //             for (const [k, v] of Object.entries(resources)) {
    //                 resources[k] += (resourceProduction[k] * (newUpdates-updates));
    //             }
    //             updates = newUpdates;
    //             showResources();
    //         }
    //     })
    // }
    let er = document.getElementById("no_buy");

    const resources = {
        gold: parseInt($('#gold').text()),
        wood: parseInt($('#wood').text()),
        stone: parseInt($('#stone').text()),
        amber: parseInt($('#amber').text())
    };


    async function fetchAndUpdatePlayerData() {
        $.ajax({
            url: '/get-player',
            method: 'POST',
            success: function (playerData) {
                console.log(playerData);
                updateResources(playerData);
                updateBuildings(playerData.buildings);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error fetching player data:', textStatus, errorThrown);
            }
        });
    }

    function updateResources(playerData) {
        resources.gold = Math.floor(playerData.gold);
        resources.wood = Math.floor(playerData.wood);
        resources.stone = Math.floor(playerData.stone);
        resources.amber = Math.floor(playerData.amber);
        er.hidden = true;
        $('#gold').text(resources.gold);
        $('#wood').text(resources.wood);
        $('#stone').text(resources.stone);
        $('#amber').text(resources.amber);
    }

    function updateBuildings(buildings) {
        var buildingsOwnedDiv = $('.buildingsOwned');
        buildingsOwnedDiv.empty();
    
        for (const [buildingName, count] of Object.entries(buildings)) {
            buildingsOwnedDiv.append(`<div class="buildingRow">${buildingName}: ${count}</div>`);
        }
    }
    
    

    function handleBuildingAction(action, buildingName) {
        $.ajax({
            url: '/' + action,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: $('#username').text(),
                building: buildingName
            }),
            success: function (response) {
                updateResources(response.resources);
                updateBuildings(response.buildings);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error with building action:', textStatus, errorThrown);
                er.hidden = false;
            }
        });
    }
    

    $(document).ready(function () {
        $('#buy-gold-generator').click(function () { handleBuildingAction('buy-building', 'Gold Generator'); });
        $('#destroy-gold-generator').click(function () { handleBuildingAction('destroy-building', 'Gold Generator'); });
        $('#buy-wood-generator').click(function () { handleBuildingAction('buy-building', 'Wood Generator'); });
        $('#destroy-wood-generator').click(function () { handleBuildingAction('destroy-building', 'Wood Generator'); });
        $('#buy-stone-generator').click(function () { handleBuildingAction('buy-building', 'Stone Generator'); });
        $('#destroy-stone-generator').click(function () { handleBuildingAction('destroy-building', 'Stone Generator'); });
        $('#buy-amber-generator').click(function () { handleBuildingAction('buy-building', 'Amber Generator'); });
        $('#destroy-amber-generator').click(function () { handleBuildingAction('destroy-building', 'Amber Generator'); });
        $('#buy-gold-storage').click(function () { handleBuildingAction('buy-building', 'Gold Storage'); });
        $('#destroy-gold-storage').click(function () { handleBuildingAction('destroy-building', 'Gold Storage'); });
        $('#buy-wood-storage').click(function () { handleBuildingAction('buy-building', 'Wood Storage'); });
        $('#destroy-wood-storage').click(function () { handleBuildingAction('destroy-building', 'Wood Storage'); });
        $('#buy-stone-storage').click(function () { handleBuildingAction('buy-building', 'Stone Storage'); });
        $('#destroy-stone-storage').click(function () { handleBuildingAction('destroy-building', 'Stone Storage'); });
        $('#buy-amber-storage').click(function () { handleBuildingAction('buy-building', 'Amber Storage'); });
        $('#destroy-amber-storage').click(function () { handleBuildingAction('destroy-building', 'Amber Storage'); });
        $('#buy-archer-tower').click(function () { handleBuildingAction('buy-building', 'Archer Tower'); });
        $('#destroy-archer-tower').click(function () { handleBuildingAction('destroy-building', 'Archer Tower'); });
        $('#buy-spell-tower').click(function () { handleBuildingAction('buy-building', 'Spell Tower'); });
        $('#destroy-spell-tower').click(function () { handleBuildingAction('destroy-building', 'Spell Tower'); });
        $('#buy-barracks').click(function () { handleBuildingAction('buy-building', 'Barracks'); });
        $('#destroy-barracks').click(function () { handleBuildingAction('destroy-building', 'Barracks'); });
        $('#buy-magic-academy').click(function () { handleBuildingAction('buy-building', 'Magic Academy'); });
        $('#destroy-magic-academy').click(function () { handleBuildingAction('destroy-building', 'Magic Academy'); });
        $('#buy-army-camp').click(function () { handleBuildingAction('buy-building', 'Army Camp'); });
        $('#destroy-army-camp').click(function () { handleBuildingAction('destroy-building', 'Army Camp'); });
        setInterval(fetchAndUpdatePlayerData, 50); 
    });
    

})(window.jQuery);


