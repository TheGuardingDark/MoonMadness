// global variables

const submitButton = $(".button-submit");
const mapKey = "c760d648-3728-45a4-9c60-bf2d3ed9d5fc";
const weatherKey = "05af7fb84d059448719e29570f453dd0";
var incidentTime = [];
var incidentLat = [];
var incidentLong = [];
var timeConvertedUnixArray = [];
var moonPhaseNum = [];
var newMoon = [];
var firstQuarterMoon = [];
var fullMoon = [];
var thirdQuarterMoon = [];
var crimeSummary = [];
var weatherSummaryArray = [];

var map;

// establish location variables

var Chandler = {
    lat: 33.3039917,
    lng: -111.8318716,
    pop: "253,458",
    id: "chn-az",

};

var Mesa = {
    lat: 33.420614,
    lng: -111.789240,
    pop: "508,958",
    id: "mesa-az",
};

var Scottsdale = {
    lat: 33.483901,
    lng: -111.908444,
    pop: "246,645",
    id: "sct-az",
};

var Seattle = {
    lat: 47.607803,
    lng: -122.331341,
    pop: "744,955",
    id: "sea-wa",
};

var SanFrancisco = {
    lat: 37.769866,
    lng: -122.426256,
    pop: "883,305",
    id: "sf-ca",
};

var Detroit = {
    lat: 42.336762,
    lng: -83.066283,
    pop: "673,104",
    id: "dt-mi",
};

// on click submit button event

submitButton.on("click", function (event) {

    event.preventDefault();

    $("tbody").empty();

    // grabbing limit value
    var limit = $("#userEntrySelection").val();
    var place

    // grabbing value of city selected
    city = $("#userCitySelection option:selected").val()

    // returning coordinates and initiating map for each city
    switch (city) {
        case "Option 1":
            initMap(Chandler.lat, Chandler.lng);
            place = Chandler.id;
            break;
        case "Option 2":
            initMap(Detroit.lat, Detroit.lng);
            place = Detroit.id;
            break;
        case "Option 3":
            initMap(Mesa.lat, Mesa.lng);
            place = Mesa.id;
            break;
        case "Option 4":
            initMap(SanFrancisco.lat, SanFrancisco.lng);
            place = SanFrancisco.id;
            break;
        case "Option 5":
            initMap(Scottsdale.lat, Scottsdale.lng);
            place = Scottsdale.id;
            break;
        case "Option 6":
            initMap(Seattle.lat, Seattle.lng);
            place = Seattle.id;
    };

    // ajax call to municipal site
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://municipal.systems/v1/places/" + place + "/dataTypes/crime/data?key=" + mapKey + "&limit=" + limit + "&offset=10",
        method: "GET",
        success: function() {
            console.log("Here");
            for (var i = 0; i < incidentLat.length; i++) {
                $.ajax({
                    url: "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/05af7fb84d059448719e29570f453dd0/" + incidentLat[i] + "," + incidentLong[i] + "," + incidentTime[i],
                    method: "GET",
                }).then(function (weatherResponse) {
                    weatherSummaryArray.push(weatherResponse.currently.summary);
                    console.log(weatherSummaryArray);
        
                    // $(".weather").text(weatherSummaryArray[i]);
                    moonPhaseNum.push(weatherResponse.daily.data[0].moonPhase);
                    console.log(moonPhaseNum);
        
                    $("#" + i).find("td.weather").text(weatherResponse.daily.data[0].summary);
                    console.log(weatherResponse.daily.data[0].summary)
                });
            };
        }
    }).then(function (crimeResponse) {
        console.log(crimeResponse);
        for (var i = 0; i < crimeResponse.results.length; i++) {

            incidentLong.push(crimeResponse.results[i].data.location.coordinates[0].toFixed(4));
            incidentLat.push(crimeResponse.results[i].data.location.coordinates[1].toFixed(4));
            incidentTime.push(moment(crimeResponse.results[i].data.startedAt).format("X"));
            crimeSummary.push(crimeResponse.results[i].data.type);

            var coords = crimeResponse.results[i].data.location.coordinates;
            var latLng = new google.maps.LatLng(coords[1], coords[0]);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map

            });

            //format date and time for table
            var date = moment(incidentTime[i], "X").format("LL");
            var time = moment(incidentTime[i], "X").format("hh:mm a");

            //display crime type, date, and time in the table
            var newRow = $("<tr>").append(
                $("<td>").text(crimeResponse.results[i].data.type),
                $("<td>").text(date),
                $("<td>").text(time),
                $("<td>").addClass("weather"),
            );
            newRow.attr("id", i);

            $("table > tbody").append(newRow);
          
        };

    })

});

// }).done(function () {
//     checkMoonPhase();




//need to filter through results using moon phase set above
$(".moon-image").on("click", function () {
    console.log(newMoon);
    var moonPhase = $(this).data("value");
    var newRow = $("<tr>");
    newRow.text("Crime Type");
    newRow.addClass("moon-filters");
    $("#putMoonsHere").append(newRow);

    if (moonPhase === "new-moon") {

        for (var i = 0; i < newMoon[0].length; i++) {

            var crimeRow = $("<tr><td>");
            crimeRow.text("Here");
            newRow.append(crimeRow);

        }
    }
    else if (moonPhase === "first-quarter") {
        for (var i = 0; i < firstQuarterMoon[0].length; i++) {

            var crimeRow = $("<tr><td>");
            crimeRow.text("Here");
            newRow.append(crimeRow);

        }
    }
    else if (moonPhase === "full-moon") {
        for (var i = 0; i < fullMoon[0].length; i++) {

            var crimeRow = $("<tr><td>");
            crimeRow.text("Here");
            newRow.append(crimeRow);

        }
    }
    else {
        for (var i = 0; i < thirdQuarterMoon[0].length; i++) {

            var crimeRow = $("<tr><td>");
            crimeRow.text("Here");
            newRow.append(crimeRow);

        }
    }
});


// function to display map
function initMap(latitude, longitude) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: latitude, lng: longitude },
        zoom: 10
    });
};


function checkMoonPhase() {

    if (moonPhaseNum >= 0 && moonPhaseNum < 0.2) {
        newMoon.push(crimeSummary);
        console.log(newMoon);
    } else if (moonPhaseNum >= 0.2 && moonPhaseNum < 0.4) {
        firstQuarterMoon.push(crimeSummary);
    } else if (moonPhaseNum >= 0.4 && moonPhaseNum < 0.7) {
        fullMoon.push(crimeSummary);
        console.log(fullMoon);
    } else if (moonPhaseNum >= 0.7 && moonPhaseNum <= 1.00) {
        thirdQuarterMoon.push(crimeSummary);
        console.log(thirdQuarterMoon);
    };
}


