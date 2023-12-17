function showError(input, message) {
    const formField = input.parentElement;
    formField.classList.add('error');
    const error = formField.querySelector('small');
    error.textContent = message;
}
function showSuccess(input) {
    const formField = input.parentElement;
    formField.classList.remove('error');
    const error = formField.querySelector('small');
    error.textContent = '';
}

function checkRequired(inputs){
    let isRequired = false;
    inputs.forEach(function(input) {
        if (input.value.trim() === ''){
            showError(input, `${getFieldName(input)} is required`);
            isRequired = true;
        } else{
            showSuccess(input);
        }
    });
    return !isRequired;
}

function checkLength(input, min, max){
    if(input.value.length < min){
        showError(input, `${getFieldName(input)} must be at least ${min} characters`);
        return false;
    }else if(input.value.length > max){
        showError(input, `${getFieldName(input)} must be less than ${max} characters`);
        return false;
    }else{
        showSuccess(input);
    }
    return true;
}

function checkPasswordsMatch(input1, input2) {
    if (input1.value !== input2.value) {
        showError(input2, 'Passwords do not match');
        return false;
    }
    return true;
}

function getFieldName(input){
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

function storage_capacity(playerBuildings, resourceType) {
    let totalCapacity = 0;
    const baseCapacity = 100; 
    const capacityIncrease = 200;

    playerBuildings.forEach(building => {
        if (resourceType === 'gold' && building.buildingName === 'Gold Storage' ||
            resourceType === 'amber' && building.buildingName === 'Amber Storage' ||
            resourceType === 'wood' && building.buildingName === 'Wood Storage' ||
            resourceType === 'stone' && building.buildingName === 'Stone Storage') {
            totalCapacity += capacityIncrease;
        }
    });

    return totalCapacity + baseCapacity;
}


document.getElementById('registration-form').addEventListener('submit', function(e) {
    e.preventDefault();

    if(!checkRequired([usernameInput, passwordInput, confirmPasswordInput]) ||
       !checkLength(usernameInput, 4,12) ||
       !checkLength(passwordInput, 8, 100) ||
       !checkPasswordsMatch(passwordInput, confirmPasswordInput)) {
        return; 
    }
    
    this.submit();
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    if(!checkRequired([usernameInput, passwordInput])){
        return;
    }
    this.submit();
});

document.storage_capacity.addEventListener('submit', function(e) {

});