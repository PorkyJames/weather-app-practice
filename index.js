import { APIKey } from "./exclusions.js";

//! Select all of the items inside of our document that we want to manipulate. 

const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

//! Create temp in F and Temp in C to toggle back and forth
let tempInF
let tempInC

//! Create a function that will allow us to update the display of the weather
const updateWeatherDisplay = (json) => {
    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');

    //! Save the temp in both F and C
    tempInF = parseInt(json.main.temp)
    tempInC = parseInt((tempInF - 32) * (5 / 9))

    temperature.innerHTML = `${isFahrenheit ? temperatureInFahrenheit : temperatureInCelsius}<span>°${isFahrenheit ? 'F' : 'C'}</span>`;
}

//! Event listener for when we click on the search. Really only need one since we're working with only using one button to look for our weather. 
search.addEventListener('click', () => {

    //! Establish that our city is whatever the value is in our search box input's value. 
    const city = document.querySelector('.search-box input').value;

    //! If there isn't anything in our input, then we'll just return. So this deals with the edge case of there being nothing. 
    if (city === '')
        return;

    //! If we do include anything, then we're going to first fetch our api website. 
    //! After we do that, we're going to use .then() and get the response of that and then .json() it so we can parse it. 
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            
            //! json.cod is very specific to the weather app. From what I've read online, cod is based on 
            //! the HTTP status code of the API response. It's not related to the weather data itself, but provides info
            //! about the success or failure of the API Call. 
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');


        //! Switch cases are for establishing if each case is met. For example, if the weather is sunny, we'll set our image as the sunny icon.
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

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°F</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
        });

});
