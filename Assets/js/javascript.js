var userFormEl = document.querySelector('#user-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var nameInputEl = document.querySelector('#city');
var weatherContainerEl = document.querySelector('#weather-container');
const YOUR_ACCESS_KEY = '7b3fff5ed94752a044fd7eb472b110e5'; //https://positionstack.com/quickstart
const YOUR_ACCESS_KEY_WEATHER = 'debe85d8fc3a44f41e99f4d94d0544ac'; //https://home.openweathermap.org/api_keys
const YOUR_ACCESS_KEY_FC = 'debe85d8fc3a44f41e99f4d94d0544ac'
var history = [];

//LocalStorage



var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityF = nameInputEl.value.trim();
    var city = capitalize(cityF);
    console.log(city);

    if (city) {
        console.log('CITY INPUT VALUE-->', city)
        searchLatLon(city);
        weatherContainerEl.textContent = '';
    } else {
        alert('Please enter a city');
    }


};


//Search latitude and longitude of a city
var searchLatLon = function (city) {
    var apiUrl = 'http://api.positionstack.com/v1/forward?access_key=' + YOUR_ACCESS_KEY + "&query=" + city + "&limit=1&output=json";
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    getLatLon(data, city);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to Position Stack');
        });
};

//Get the latitude and longitude
var getLatLon = function (result, city) {
    console.log(result);
    if (result.data.length === 0) {
        weatherContainerEl.textContent = 'No city found.';
        return;
    }
    var lat = result.data[0].latitude;
    var lon = result.data[0].longitude;
    searchCity(lat, lon, city);


};

//Give the weather information of the city
var searchCity = function (latitude, longitude, city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=imperial&exclude=minutely,hourly&appid=' + YOUR_ACCESS_KEY_WEATHER;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    showWeather(data, city);

                    //LocalStorage
                    localStorageCities(city);


                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to One Call API');
        });

};

//Change the format of the inputCity
var capitalize = function (city) {
    city = city.toLowerCase();
    const upperCasedCity = city.split(' ').map(city => {
        return city[0].toUpperCase() + city.slice(1)
    }).join(' ');

    return upperCasedCity;
}

//Save the city in localStorage
var localStorageCities = function (city) {
    var history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(city);
    let uniqueChars = [...new Set(history)];
    history = uniqueChars;
    localStorage.setItem('history', JSON.stringify(history));
    console.log(localStorage.getItem('history'));
    //removeAllChildNodes(cityButtonsEl);
    //showListCities(history);
}