(function ($) {
    let er = document.getElementById("no_buy");

    const resources = {
        gold: parseInt($('#gold').text()),
        wood: parseInt($('#wood').text()),
        stone: parseInt($('#stone').text()),
        amber: parseInt($('#amber').text())
    };

    function storage_capacity(playerBuildings, resourceType) {
        let totalCapacity = 0;
        const baseCapacity = 100; 
        const capacityIncrease = 200;
      
        for (const [buildingName, count] of Object.entries(playerBuildings)) {
            if ((resourceType === 'gold' && buildingName === 'Gold Storage') ||
                (resourceType === 'amber' && buildingName === 'Amber Storage') ||
                (resourceType === 'wood' && buildingName === 'Wood Storage') ||
                (resourceType === 'stone' && buildingName === 'Stone Storage')) {
                totalCapacity += capacityIncrease * count;
            }
        }
      
        return totalCapacity + baseCapacity;
      }
      
      function updateStorageCapacities(playerBuildings) {
        const goldStorageCapacity = storage_capacity(playerBuildings, 'gold');
        const woodStorageCapacity = storage_capacity(playerBuildings, 'wood');
        const stoneStorageCapacity = storage_capacity(playerBuildings, 'stone');
        const amberStorageCapacity = storage_capacity(playerBuildings, 'amber');
    
        $('#goldStorage .storage-capacity').text(goldStorageCapacity);
        $('#woodStorage .storage-capacity').text(woodStorageCapacity);
        $('#stoneStorage .storage-capacity').text(stoneStorageCapacity);
        $('#amberStorage .storage-capacity').text(amberStorageCapacity);
    }


    async function fetchAndUpdatePlayerData() {
        $.ajax({
            url: '/get-player',
            method: 'POST',
            success: function (playerData) {
                console.log(playerData);
                updateResources(playerData, playerData.buildings); // Pass playerData.buildings here
                updateBuildings(playerData.buildings);
                updateStorageCapacities(playerData.buildings);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error fetching player data:', textStatus, errorThrown);
            }
        });
    }


    function updateResources(playerData, playerBuildings) {
        const updatedResources = {
            gold: Math.min(storage_capacity(playerBuildings, 'gold'), Math.floor(playerData.gold)),
            wood: Math.min(storage_capacity(playerBuildings, 'wood'), Math.floor(playerData.wood)),
            stone: Math.min(storage_capacity(playerBuildings, 'stone'), Math.floor(playerData.stone)),
            amber: Math.min(storage_capacity(playerBuildings, 'amber'), Math.floor(playerData.amber))
        };
    
        // Get storage capacities from playerBuildings
        const goldStorageCapacity = storage_capacity(playerBuildings, 'gold');
        const woodStorageCapacity = storage_capacity(playerBuildings, 'wood');
        const stoneStorageCapacity = storage_capacity(playerBuildings, 'stone');
        const amberStorageCapacity = storage_capacity(playerBuildings, 'amber');
    
        // Check if resource exceeds storage capacity and limit if necessary
        if (updatedResources.gold > goldStorageCapacity) {
            updatedResources.gold = goldStorageCapacity;
        }
        if (updatedResources.wood > woodStorageCapacity) {
            updatedResources.wood = woodStorageCapacity;
        }
        if (updatedResources.stone > stoneStorageCapacity) {
            updatedResources.stone = stoneStorageCapacity;
        }
        if (updatedResources.amber > amberStorageCapacity) {
            updatedResources.amber = amberStorageCapacity;
        }
    
        // Update the resource displays
        $('#gold').text(updatedResources.gold);
        $('#wood').text(updatedResources.wood);
        $('#stone').text(updatedResources.stone);
        $('#amber').text(updatedResources.amber);
    
        // Update the global resources object
        resources.gold = updatedResources.gold;
        resources.wood = updatedResources.wood;
        resources.stone = updatedResources.stone;
        resources.amber = updatedResources.amber;
    }
    

    function updateBuildings(buildings){
        var buildingsOwnedDiv = $('.buildingsOwned');
        buildingsOwnedDiv.empty();
    

        for (const [buildingName, count] of Object.entries(buildings)) {
            buildingsOwnedDiv.append(`<div class="buildingRow">${buildingName}: ${count}</div>`);
        }
    }
    

    function handleBuildingAction(action, buildingName){
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
                er.hidden = true;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error with building action:', textStatus, errorThrown);
                er.hidden = false;
            }
        });
    }
    

    $(document).ready(function (){
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
        setInterval(fetchAndUpdatePlayerData, 100); 
    });
    

    
    

})(window.jQuery);
