//TODO: create a module of type main here, so that you can use global json with all clinic details
function loadContent() {
    var clinicData = JSON.parse(getClinicData());
    if (!clinicData) {
        alert("No data Received");
    }
    prepareChart("ms-grid", clinicData);
    prepareGrid(clinicData);
    prepareMap(clinicData);
}
function prepareMap(cd) {
    var map = L.map('ms-map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'examples.map-i875mjb7'
    }).addTo(map);

    for (var i = 0; i < cd.length; i++) {
        var clinic = cd[i];
        var button = $("<button id='btn-dialog' type=submit>Update</button>").click(function (data) {
            var form = $("#form-update");

            alert(formData);
        });

        var field = function (name, label, value) {
            return "<div style='padding: 2px 0 2px 0'>" +
                "<label style='width: 120px;display: inline-block;'>" + label + "</label>" +
                "<input name=" + name + " type='text' style='width: 204px;' value='" + value + "'/>" +
                "</div>";
        };
        var form = $("<form id='form-update' action=''>");
        form.append("<h1>Clinic: " + clinic.name + "</h1>");
       // form.append("<form id='update-form'>");
        form.append(field("clinicId","Clinic ID:", clinic.clinicId));
        form.append(field("name", "Name:", clinic.name));
        form.append(field("countryId", "Country:", clinic.countryId));
        form.append(field("nevirapineStock", "Nevirapine:", clinic.nevirapineStock));
        form.append(field("stavudineStock", "Stavudine:", clinic.stavudineStock));
        form.append(field("zidotabineStock", "Zidotabine:", clinic.countryId));
        form.append(field("latitude","Latitude:",clinic.latitude));
        form.append(field("longitude","Longitude:",clinic.longitude));
        form.append("</form>");

        L.marker([clinic.latitude, clinic.longitude], L.Icon({iconUrl: '/images/marker-icon.png'})).addTo(map)
            .bindPopup(form.append(button)[0])
            .openPopup();
    }

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);
}

function updateClinic(clinic) {
    alert("updated Clinic:" + clinic["name"]);
}

function prepareGrid(cd) {
    var grid;
    var columns = [
        {id: "ID", name: "ID", field: "clinicId", maxWidth: 30, width: 25},
        {id: "Name", name: "Name", field: "name"},
        {id: "Country", name: "Country", field: "countryId"},
        {id: "Nevirapine", name: "Nevirapine", field: "nevirapineStock"},
        {id: "Stavudine", name: "Stavudine", field: "stavudineStock"},
        {id: "Zidotabine", name: "Zidotabine", field: "zidotabineStock"}
    ];

    var options = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        forceFitColumns: true

    };
    grid = new Slick.Grid("#ms-propbox", cd, columns, options);
}
//TODO: replace temp clinic with backend data.
var tempClinic = {
    clinName: "Mezza",
    id: "001",
    country: "ZA",
    nev: "10",
    sta: "5",
    zid: "8"
};


function preparePropertyBox(divId, clinic) {
    var propboxHeading = "<h2>Clinic: " + clinic.clinName + "</h2>";
    var propboxFields = "<ul>" +
        "<li>Clinic ID: " + clinic.id + "</li>" +
        "<li>Country: " + clinic.country + "</li>" +
        "<li>Nevirapine: " + clinic.nev + "</li>" +
        "<li>Stavudine: " + clinic.sta + "</li>" +
        "<li>Zidotabine: " + clinic.zid + "</li>" +
        "</ul>";


}
function prepareChart(divId, clinicData) {
    var chartData = barGraphDataPreparation(clinicData);
    var settings = {
        grid: {
            borderWidth: 1,
            hoverable: false
        },
        series: {
            bars: {
                show: true,
                barWidth: 1 / chartData.ticks.length / 2,
                order: 1,
                align: "center"
            }
        },
        xaxis: {
            //tickSize: 1,
            tickLength: 0,
            axisLabel: "Clinics",
            axisLabelUseCanvas: true,
            axisLabelFontFamily: "Verdana",
            axisLabelFontSizePixels: 15,
            axisLabelPadding: 20,
            mode: "categories",
            ticks: chartData.ticks
        },
        yaxis: {
            axisLabel: "MedicineStock",
            axisLabelUseCanvas: true,
            axisLabelFontFamily: "verdana",
            axisLabelFontSizePixels: 15,
            axisLabelPadding: 18
        },
        selection: { mode: "x" }
    };
    $.plot($("#" + divId), chartData.data, settings);
}

//TODO: remove this after implementation!
function barGraphDataPreparation(sourceData) {
    if (!sourceData) return undefined;

    var chartData = {
        ticks: [],
        data: []
    };
    var nevirapine = [];
    var stavudine = [];
    var zidotabine = [];
    for (var i = 0; i < sourceData.length; i++) {
        var clinic = sourceData[i];
        var clinName = clinic["name"];
        nevirapine.push([i, clinic["nevirapineStock"]]);
        stavudine.push([i, clinic["stavudineStock"]]);
        zidotabine.push([i, clinic["zidotabineStock"]]);
        chartData.ticks.push([i, clinName]);
    }
    chartData.data.push({
        data: nevirapine,
        label: "Nevirapine"
    });
    chartData.data.push({
        data: stavudine,
        label: "Stavudine"
    });

    chartData.data.push({
        data: zidotabine,
        label: "Zidotabine"
    });

    return chartData;
}

function getClinicData() {
    return $.ajax({
        type: "GET",
        url: "/clinics/all",
        async: false
    }).responseText;
}
function deleteClinic(id){
    return $.ajax({
        type: "DELETE",
        url: "/clinics/" + id,
        async: false
    }).responseText;
}
function updateClinic(clinic){
    return $.ajax({
        type: "PUT",
        url: "/clinics/" + clinic,
        async: false
    }).responseText;
}
function createClinic(clinic){
    return $.ajax({
        type: "POST",
        url: "/clinics/" + clinic,
        async: false
    }).responseText;
}







