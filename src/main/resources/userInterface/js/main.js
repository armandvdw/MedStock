//TODO: create a module of type main here, so that you can use global json with all clinic details

function prepareMap() {
    //Get a leaflet map here with openstreetmaps tiles
}

function prepareGrid() {
    //Get a slickgrid going here

}
//TODO: try to make a clinic object with attributes.
//This is the entire
function preparePropertyBox(divId, clinic) {
    var propboxHeading = "<h2>Clinic: " + clinic.name + "</h2>";
    var propboxFields = "<ul>" +
        "<li>Clinic ID: " + clinic.id + "</li>" +
        "<li>Country: " + clinic.country + "</li>" +
        "<li>Nevirapine: " + clinic.nevirapineStock + "</li>" +
        "<li>Stavudine: " + clinic.stavudineStock + "</li>" +
        "<li>Zidotabine: " + clinic.zidotabine + "</li>" +
        "</ul>";

    $("#" + divId).append(propboxHeading);
    $("#" + divId).append(propboxFields);
}
function prepareChart() {
    //get a flot chart going here.

}

function loadContent(){
   // preparePropertyBox("ms-propbox");
}

$(document).ready(loadContent());


