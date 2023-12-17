document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('battle-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const playerResources = {
            gold: parseInt(document.querySelector('#userResources-gold').textContent, 10),
            wood: parseInt(document.querySelector('#userResources-wood').textContent, 10),
            stone: parseInt(document.querySelector('#userResources-stone').textContent, 10),
            amber: parseInt(document.querySelector('#userResources-amber').textContent, 10),
        };
        const selectedUnits = {};
        const unitCosts = {};

        document.querySelectorAll('input[type="number"]').forEach((input) =>{
            const unitName = input.name;
            const quantity = parseInt(input.value, 10);
            selectedUnits[unitName] = quantity;

            unitCosts[unitName] = {
                gold: parseInt(input.getAttribute('data-gold-cost'), 10),
                wood: parseInt(input.getAttribute('data-wood-cost'), 10),
                stone: parseInt(input.getAttribute('data-stone-cost'), 10),
                amber: parseInt(input.getAttribute('data-amber-cost'), 10),
            };
        });

        const validationResult = validateResources(playerResources, selectedUnits, unitCosts);

        if (validationResult.valid){
            form.submit();
        } else {
            alert(validationResult.message);
        }
    });

    function validateResources(playerResources, selectedUnits, unitCosts) {
        const resourceValidation = {
            gold: true,
            wood: true,
            stone: true,
            amber: true,
        };

        Object.keys(selectedUnits).forEach((unitName) => {
            const unitQuantity = selectedUnits[unitName];
            const unitCost = unitCosts[unitName];

            Object.keys(unitCost).forEach((resource) => {
                if (playerResources[resource] < unitCost[resource] * unitQuantity) {
                    resourceValidation[resource] = false;
                }
            });
        });

        const valid = Object.values(resourceValidation).every((isValid) => isValid);

        let message = 'Not enough resources to recruit selected units:';
        Object.keys(resourceValidation).forEach((resource) => {
            if (!resourceValidation[resource]) {
                message += ` Insufficient ${resource}.`;
            }
        });

        return { valid, message };
    }
});
