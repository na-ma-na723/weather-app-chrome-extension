let weather = {
    apiKey : "bda9d930e85d71c85fb3010d57464cf6",
    fetchWeather: function ( city ) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" 
            + city 
            + "&units=metric&appid="
            + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data))
    },

    getBackground: function(desc, t) {
        if( t < 6 || t > 17 ) {
            if( desc == "Rain" ) document.querySelector("#main").style.backgroundImage = "url(./assests/rainy_night.gif)";
            else if( desc == "Clouds") document.querySelector("#main").style.backgroundImage = "url(./assests/cloudy_sky_night.gif)";
            else if( desc == "Clear" ) document.querySelector("#main").style.backgroundImage = "url(./assests/clear_sky_night.gif)";
            else if( desc == "Snow" ) document.querySelector("#main").style.backgroundImage = "url(./assests/snow_night.gif)";
            else if( desc == "Fog" ) document.querySelector("#main").style.backgroundImage = "url(./assests/fog_night.gif)";
            else if( desc == "Mist" ) document.querySelector("#main").style.backgroundImage = "url(./assests/mist_night.gif)";
            else if( desc == "Smoke" || desc == "Haze" ) document.querySelector("#main").style.backgroundImage = "url(./assests/smoke_night.jpg)";
            

            let elements = document.querySelectorAll(".switch");
            elements.forEach(element => element.classList.add("night"));
            elements.forEach(element => element.classList.remove("day"));
        }
        else {
            
            if( desc == "Rain" ) document.querySelector("#main").style.backgroundImage = "url(./assests/rainy_day.gif)";
            else if( desc == "Clouds") document.querySelector("#main").style.backgroundImage = "url(./assests/cloudy_sky_day.gif)";
            else if( desc == "Clear" ) document.querySelector("#main").style.backgroundImage = "url(./assests/clear_sky_day.gif)";
            else if( desc == "Snow" ) document.querySelector("#main").style.backgroundImage = "url(./assests/snow_day.gif)";
            else if( desc == "Fog"  ) document.querySelector("#main").style.backgroundImage = "url(./assests/fog_day.gif)";
            else if( desc == "Mist" ) document.querySelector("#main").style.backgroundImage = "url(./assests/mist_day.gif)";
            else if( desc == "Smoke" || desc == "Haze" ) document.querySelector("#main").style.backgroundImage = "url(./assests/smoke_day.jpg)";

            let elements = document.querySelectorAll(".switch");
            elements.forEach(element => element.classList.add("day"));
            elements.forEach(element => element.classList.remove("night"));
        }

    },

    getTime: function(seconds, main) {

        const standardTime = new Date().toLocaleString("en-GB", {timeZone:'Europe/London', timeStyle:'short', hourCycle:'h24'});
        
        const d = new Date();
        const dateDay = d.toDateString();

        const hour = (seconds/60)/60;
        let hourS = parseInt(standardTime.slice(0, 2));
        let minuteS = parseInt(standardTime.slice(3, 5));

        hourS = hourS + Math.trunc(hour)
        minuteS = minuteS + (hour%1)*60
        if( minuteS < 0 ) {
            hourS -= 1;
            minuteS += 60;
        }
        if( minuteS >= 60 ) {
            hourS += 1;
            minuteS -= 60;
        }
        if( hourS < 0 ) hourS += 24;

        if( hourS >= 24 ) hourS -= 24;


        this.getBackground(main, hourS);

        if(Math.floor(minuteS/10) == 0) {
            minuteS =  "0" + minuteS;
        }
        if( hourS < 12 ) document.querySelector("#time").innerText = dateDay + ", " + hourS + ":" + minuteS + " AM";
        else document.querySelector("#time").innerText = dateDay + ", " + hourS + ":" + minuteS + " PM";
  
    },


    displayWeather: function (data) {
        const { temp, humidity, feels_like, pressure, temp_max, temp_min } = data.main;
        const { name, timezone } = data;
        const { speed } = data.wind;
        const { description, main, icon } = data.weather[0];

        this.getTime(timezone, main);

        document.querySelector("#cityName").innerText = name;
        document.querySelector("#temperature").innerText = temp + "°C";
        document.querySelector("#feelLike").innerText = "Feels Like " + feels_like + "°C";
        document.querySelector("#description").innerText = description;
        document.querySelector("#icon").src = "https://openweathermap.org/img/wn/" + icon + ".png" ;
        
        document.querySelector("#humidity").innerText = humidity;
        document.querySelector("#wind").innerText = speed;
        document.querySelector("#pressure").innerText = pressure;

        document.querySelector("#minTemp").innerText = temp_min;
        document.querySelector("#maxTemp").innerText = temp_max;
    },

    search: function() {
        this.fetchWeather(document.querySelector("#input").value)
    },
};

let geoCode = {
    reverseGeoCode: function(latitude, longitude) {

        var api_key = '573f006c7e1740f89ce33f67a2226ce0';

        var api_url = 'https://api.opencagedata.com/geocode/v1/json';

        var request_url = api_url
            + '?'
            + 'key=' + api_key
            + '&q=' + encodeURIComponent(latitude + ',' + longitude)
            + '&pretty=1'
            + '&no_annotations=1';

        var request = new XMLHttpRequest();
        request.open('GET', request_url, true);

        request.onload = function() {

            if (request.status === 200){
                var data = JSON.parse(request.responseText);
                weather.fetchWeather(data.results[0].components.city)
            } 
            else if (request.status <= 500){
                console.log("unable to geocode! Response code: " + request.status);
                var data = JSON.parse(request.responseText);
                console.log('error msg: ' + data.status.message);
            } 
            else {
                console.log("server error");
            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
            console.log("unable to connect to server");
        };

        request.send();  // make the request

    },

    getLocation: function() {
        function success (data) {
            geoCode.reverseGeoCode(data.coords.latitude, data.coords.longitude);
        }

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, console.error);
        }
        else {
            weather.fetchWeather("dehradun");
        }
    },
};

document.querySelector("#searchButton").addEventListener("click", function() {
    weather.search();
});

document.querySelector("#input").addEventListener("keyup", function(event) {
    if(event.key == "Enter") weather.search();
});

geoCode.getLocation();

function addClass() {

    let loading = document.getElementById("loading");
    let mainScreen = document.getElementById("main");

    loading.classList.remove("visible");
    loading.classList.add("notVisible");
    mainScreen.classList.add("visible");
    mainScreen.classList.remove("notVisible");
    
}
setTimeout(addClass, 2000);