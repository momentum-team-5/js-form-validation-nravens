const form = document.querySelector('#parking-form')
const today = new Date(Date.now())
let formIsValid  // this is set as a global variable so it can be used in different functions
form.addEventListener('submit', validateForm)


function validateForm (event) {
    event.preventDefault()
    //removeErrorMessage() // if an error message is showing from a previous validation attempt
    formIsValid = true // reset this each time you try to validate the form    
    
    //validation methods 
        
        // Validate the format of the credit card number.
        const credit_card_field = document.querySelector('#credit-card')
        console.log(credit_card_field.value)
        if (!validateCardNumber(credit_card_field.value)) {
             credit_card_field.setCustomValidity("Invalid credit card number")
             formIsValid = false
         }

        // Expiration date must not be in the past.
        const expiration_date_field = document.querySelector('#expiration')
        console.log(expiration_date_field.value)
        const expiration_date = new Date(expiration_date_field.value)
        if (expiration_date < today) {
            formIsValid = false
            expiration_date_field.setCustomValidity("Expiration date must not be in the past")
            event.preventDefault()
        }
        else {
            expiration_date_field.setCustomValidity("");
        }
        
        // Car year cannot be in the future.
        const car_year_field = document.querySelector('#car-year')
        console.log(car_year_field.value)
        if (car_year_field.value > today.getFullYear()) {
            formIsValid = false
            car_year_field.setCustomValidity("Car year cannot be in the future")
            event.preventDefault()
        }
        else {
            car_year_field.setCustomValidity("");
        }
        
        
        //create date object for parking date
        const daysField = document.querySelector('#days')
        const dateField = document.querySelector('#start-date')
        let parking_date = new Date(dateField.value)
        
        //Parking date must be in the future.
        console.log(parking_date)
        if (parking_date <= today) {
           dateField.setCustomValidity("Parking date must be in the future")
           event.preventDefault()
           formIsValid = false
        }    
        else {
            dateField.setCustomValidity("");
        }  
        
        // Calculate the cost of parking
        cost = calculateCost(daysField.value, parking_date)
        const total_field = document.querySelector('#total')
        total_field.textContent = cost
        console.log(cost)

        let name = document.querySelector('#name')
       if (formIsValid) {
                fetch('https://momentum-server.glitch.me/parking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ formData: { name: name } }) // get this value from the form input!
              })
                .then(res => res.json())
                .then(data => {
                  console.log(data)
                  // you can add a message to the DOM that says that the form was successfully submitted!
                })
        }
    }
      


// input is number of days, and  a date object
function calculateCost(days, start_date) {
    let new_date = new Date(start_date)
    let cost = 0

    let days_index = []
    for (let i = 0; i < days; i ++) {
        new_date.setDate(start_date.getDate() + i)
        if (new_date.getDay() == 0 || new_date.getDay() == 6) {
            cost += 7
        }
        else {
            cost += 5   
        }
    }
    return cost
}

function validateCardNumber(number) {
    var regex = new RegExp("^[0-9]{16}$");
    if (!regex.test(number))
        return false;

    return luhnCheck(number);
}

function luhnCheck(val) {
    var sum = 0;
    for (var i = 0; i < val.length; i++) {
        var intVal = parseInt(val.substr(i, 1));
        if (i % 2 == 0) {
            intVal *= 2;
            if (intVal > 9) {
                intVal = 1 + (intVal % 10);
            }
        }
        sum += intVal;
    }
    return (sum % 10) == 0;
}



