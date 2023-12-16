
(function ($) {

    const timeInterval = 5000;

    let firstTime = Date.now();
    let currentTime = firstTime;
    let updates = 0;
    let newUpdates = 0;

    let resources = {gold: 80, wood: 0, stone: 0, amber: 0};
    let resourceProduction = {gold: 1, wood: 0, stone: 0, amber: 0};
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

    let buyCoinGenerator = () => {
        console.log('bought');
        if (resources.gold >= 40) {
            resources.gold -= 40;
            if (!('coinGenerator' in buildingsOwned)) {
                buildingsOwned.coinGenerator = 1;
            } else {
                buildingsOwned.coinGenerator += 1;
            }
            resourceProduction.gold += 1;

            $('#buildingText').text(`Coin Generator: ${buildingsOwned.coinGenerator}`);
            showResources();
        }
    }

    setInterval(passiveResourceUpdate, timeInterval);

    $(document).ready(function(){
        $('#buyCoinGeneratorButton').click(buyCoinGenerator);
    })

})(window.jQuery);