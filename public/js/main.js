
(function ($) {

    const timeInterval = 5000;

    let firstTime = Date.now();
    let currentTime = firstTime;
    let updates = 0;
    let newUpdates = 0;

    let resources = {gold: 0, wood: 0, stone: 0, amber: 0};
    let resourceProduction = {gold: 1, wood: 0, stone: 0, amber: 0};

    let updateResources = () => {
        console.log('updating');
        $(document).ready(function(){
            currentTime = Date.now();
            newUpdates = Math.floor((currentTime - firstTime)/timeInterval);
            if (newUpdates > updates) {
                for (const [k, v] of Object.entries(resources)) {
                    resources[k] += (resourceProduction[k] * (newUpdates-updates));
                    $('#resourceText').text(`gold: ${resources.gold}, wood: ${resources.wood}, stone: ${resources.stone}, amber: ${resources.amber}`);
                }
                updates = newUpdates;
            }
        })
    }

    setInterval(updateResources, timeInterval);

})(window.jQuery);