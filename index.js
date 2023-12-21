import { APIKey } from "./exclusions.js";

//! Select all of the items inside of our document that we want to manipulate. 

const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');

//! Create temp in F and Temp in C to toggle back and forth
let tempInF
let tempInC
let isFahrenheit = true;

//! Let's split up our original addEventListener into two separate functions. 

//! Create a function that will allow us to update the display of the weather
const updateWeatherDisplay = (json) => {
    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');
    const windSpeed = isFahrenheit ? parseInt(json.wind.speed) : parseInt(json.wind.speed * 3.6);

    //! Save the temp in both F and C
    tempInF = parseInt(json.main.temp)
    tempInC = parseInt(((tempInF - 32) * (5/9)) * -1)

    temperature.innerHTML = `${isFahrenheit ? tempInF : tempInC}<span>°${isFahrenheit ? 'F' : 'C'}</span>`;
    
    switch (json.weather[0].main) {
        case 'Clear':
            image.src = 'images/clear.png';
            break;

        case 'Rain':
            image.src = 'images/rain.png';
            break;

        case 'Snow':
            image.src = 'images/snow.png';
            break;

        case 'Clouds':
            image.src = 'images/cloud.png';
            break;

        case 'Haze':
            image.src = 'images/mist.png';
            break;

        default:
            image.src = '';
    }

    description.innerHTML = `${json.weather[0].description}`;
    humidity.innerHTML = `${json.main.humidity}%`;
    wind.innerHTML = `${windSpeed} ${isFahrenheit ? 'mp/h' : 'km/h'}`;

    weatherBox.style.display = '';
    weatherDetails.style.display = '';
    weatherBox.classList.add('fadeIn');
    weatherDetails.classList.add('fadeIn');
    container.style.height = '590px';
}

// Function to fetch weather data
function fetchWeather(city) {
    const units = isFahrenheit ? 'imperial' : 'metric'; // Determine units based on isFahrenheit
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            updateWeatherDisplay(json);
        });
}

// Search button event listener
search.addEventListener('click', () => {
    const city = document.querySelector('.search-box input').value;
    if (city !== '') fetchWeather(city);
});

// Temperature toggle button event listener
toggleSwitch.addEventListener('change', () => {
    isFahrenheit = !isFahrenheit;
    const city = document.querySelector('.search-box input').value;
    if (city) fetchWeather(city);
});

