var userFormEl = document.querySelector('#user-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var nameInputEl = document.querySelector('#city');
var weatherContainerEl = document.querySelector('#weather-container');
const YOUR_ACCESS_KEY = '7b3fff5ed94752a044fd7eb472b110e5'; //https://positionstack.com/quickstart
const YOUR_ACCESS_KEY_WEATHER = 'debe85d8fc3a44f41e99f4d94d0544ac'; //https://home.openweathermap.org/api_keys
const YOUR_ACCESS_KEY_FC = 'debe85d8fc3a44f41e99f4d94d0544ac'
var history = [];

//LocalStorage
var history = JSON.parse(localStorage.getItem('history')) || [];
var originalList = localStorage.getItem('history');
if (originalList != null) {
    var removeList = originalList.replace('[', '');
    var removeList = removeList.replace(']', '');
    var removeList = removeList.replaceAll('"', '');
    var list = removeList.split(",");

    if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
            var btnCity = document.createElement("button");
            btnCity.className = 'btn';
            btnCity.id = list[i];
            console.log(list[i]);
            btnCity.setAttribute("data-city", list[i]);
            btnCity.innerHTML = list[i];
            cityButtonsEl.appendChild(btnCity);

        }
    }
}


//When you click on the search button show the current and forecast weather
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

//When you click on the city button show the current and forecast weather
var buttonClickHandler = function (event) {
    var city = event.target.getAttribute('data-city');

    if (city) {
        searchLatLon(city);

        weatherContainerEl.textContent = '';
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
    removeAllChildNodes(cityButtonsEl);
    showListCities(history);
}


//Create a button list with the searched cities
var showListCities = function (history) {

    if (history.length > 0) {
        for (let i = 0; i < history.length; i++) {
            var btnCity = document.createElement("button");
            btnCity.className = 'btn';
            btnCity.id = history[i];
            btnCity.setAttribute("data-city", history[i]);
            btnCity.innerHTML = history[i];
            cityButtonsEl.appendChild(btnCity);

        }


    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

//Show the weather and forecast on the page
var showWeather = function (data, city) {
    currentWeather(data, city);
    forecastWeather(data, city);
    localStorageCities(city);

}

//Show the current weather information
var currentWeather = function (data, city) {
    var temp = data.current.temp;
    var time = data.current.dt;
    var wind = data.current.wind_speed;
    var humidity = data.current.humidity;
    var uvi = data.current.uvi;
    var icon = data.current.weather[0].icon;

    var divCurrent = document.createElement("div");
    divCurrent.className = 'border border-primary';
    weatherContainerEl.appendChild(divCurrent);

    var h2Current = document.createElement("h2");
    h2Current.textContent = city + ' (' + convertTime(time) + ')';
    divCurrent.appendChild(h2Current);

    var myImage = new Image(50, 50);
    var srcIcon = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';
    myImage.src = srcIcon;
    myImage.className = 'btn-inline';
    divCurrent.appendChild(myImage);

    var h5TempCurrent = document.createElement("h5");
    h5TempCurrent.textContent = "Temp: " + temp + "°F";
    divCurrent.appendChild(h5TempCurrent);

    var h5WindCurrent = document.createElement("h5");
    h5WindCurrent.textContent = "Wind: " + wind + " MPH";
    divCurrent.appendChild(h5WindCurrent);

    var h5HumidityCurrent = document.createElement("h5");
    h5HumidityCurrent.textContent = "Humidity: " + humidity + " %";
    divCurrent.appendChild(h5HumidityCurrent);

    var h5UviCurrent = document.createElement("h5");
    h5UviCurrent.textContent = "UV Index: ";
    divCurrent.appendChild(h5UviCurrent);

    spanEl = document.createElement("span");
    spanEl.className = 'status-icon';
    spanEl.style.backgroundColor = colorUvIndex(uvi);
    spanEl.style.color = "white";
    spanEl.textContent = uvi;
    h5UviCurrent.appendChild(spanEl);
}
//Show the forecast weather information
var forecastWeather = function (data, city) {
    weatherContainerEl.appendChild(document.createElement("br"));
    var titleForecast = document.createElement("h4");
    titleForecast.textContent = '5-Day Forecast';
    weatherContainerEl.appendChild(titleForecast);


    var divForecast = document.createElement("div");
    divForecast.className = 'card-group';
    weatherContainerEl.appendChild(divForecast);

    for (let i = 1; i <= 5; i++) {
        var divDay = document.createElement("div");
        divDay.className = ' card mb-1';
        divDay.id = 'day-' + i;
        divDay.style.maxWidth = '18rem';
        divForecast.appendChild(divDay);

        var divHeader = document.createElement("div");
        divHeader.className = 'card-header';
        var timeFc = data.daily[i].dt;
        divHeader.textContent = ' (' + convertTime(timeFc) + ')';
        divDay.appendChild(divHeader);

        var divBody = document.createElement("div");
        divBody.className = 'card-body';
        divDay.appendChild(divBody);

        var myImageFc = new Image(30, 30);
        var iconFc = data.daily[i].weather[0].icon;
        var srcIconFc = 'http://openweathermap.org/img/wn/' + iconFc + '@2x.png';
        myImageFc.src = srcIconFc;
        divBody.appendChild(myImageFc);

        var pTempMin = document.createElement("p");
        pTempMin.className = 'card-text';
        pTempMin.textContent = 'Temp Min: ' + data.daily[i].temp.min;
        divBody.appendChild(pTempMin);

        var pTempMax = document.createElement("p");
        pTempMax.className = 'card-text';
        pTempMax.textContent = 'Temp Max: ' + data.daily[i].temp.max
        divBody.appendChild(pTempMax);

        var pWind = document.createElement("p");
        pWind.className = 'card-text';
        pWind.textContent = 'Wind: ' + data.daily[i].wind_speed + ' MPH'
        divBody.appendChild(pWind);

        var pHum = document.createElement("p");
        pHum.className = 'card-text';
        pHum.textContent = 'Humidity: ' + data.daily[i].humidity + ' %'
        divBody.appendChild(pHum);



    }



}

//return the date 
var convertTime = function (time) {
    const unixTime = time;
    const date = new Date(unixTime * 1000);
    return date.toLocaleDateString("en-US");
}

//Change the color of UVI element
var colorUvIndex = function (uvi) {
    if (uvi >= 0 && uvi < 3) {
        return "green";
    } else if (uvi >= 3 && uvi < 6) {
        return "yellow";
    } else if (uvi >= 6 && uvi < 8) {
        return "orange";
    } else if (uvi >= 8 && uvi < 11) {
        return "red";
    } else {
        return "violet";
    }
}



userFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);