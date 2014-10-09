//TODO: create a module of type main here, so that you can use global json with all clinic details
var clinicData = JSON.parse(getClinicData());
var mapZoomLevel = 3;
var mapLat = 0.56;
var mapLon = 22.89;
var selectedClinic = clinicData[0];

function loadContent() {
    if (!clinicData) {
        alert("No data Received");
    }
    prepareChart("ms-grid", clinicData);
    prepareGrid(clinicData);
    prepareMap(clinicData);
}
function setContentToAllStock() {
    clinicData = JSON.parse(getClinicData());
    loadContent();
}

function setContentToLowStock() {
    clinicData = JSON.parse(getLowStockClinics());
    loadContent();
}
function lowStockClinic(clinic) {
    return clinic["stavudineStock"] < 5 || clinic["zidotabineStock"] < 5 || clinic["nevirapineStock"] < 5;
}

var createMode = false;
function prepareMap(cd) {
    var map = L.map('ms-map').setView([mapLat, mapLon], mapZoomLevel);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'examples.map-i875mjb7'
    }).addTo(map);

    var markersLayer = new L.LayerGroup();	//layer contain searched elements
    map.addLayer(markersLayer);

    for (var i = 0; i < cd.length; i++) {
        var clinic = cd[i];
        var buttonUpdate = $("<button id='btn-update' type=submit>Update</button>").click(function (data) {
            var form = $("#form-update");
            updateClinic(form.serialize());
        });
        var buttonDelete = $("<button id='btn-delete' type=submit>Delete</button>").click(function (data) {
            var form = $("#form-update");
            if (confirm("Are you sure you want to delete this clinic?"))deleteClinic(form.serializeObject()["clinicId"]);
        });
        var buttonCancel = $("<button id='btn-cancel' type=submit>Cancel</button>").click(function (data) {
            map.closePopup()
        });

        var field = function (name, label, value) {
            return "<div style='padding: 2px 0 2px 0'>" +
                "<label style='width: 120px;display: inline-block;'>" + label + "</label>" +
                "<input name=" + name + " type='text' style='width: 204px;' value='" + value + "'/>" +
                "</div>";
        };
        var formUpdate = $("<form id='form-update'>");
        formUpdate.append("<h1>Clinic: " + clinic.name + "</h1>");
        // form.append("<form id='update-form'>");
        formUpdate.append(field("clinicId", "Clinic ID:", clinic.clinicId));
        formUpdate.append(field("name", "Name:", clinic.name));
        formUpdate.append(field("countryId", "Country:", clinic.countryId));
        formUpdate.append(field("nevirapineStock", "Nevirapine:", clinic.nevirapineStock));
        formUpdate.append(field("stavudineStock", "Stavudine:", clinic.stavudineStock));
        formUpdate.append(field("zidotabineStock", "Zidotabine:", clinic.countryId));
        formUpdate.append(field("latitude", "Latitude:", clinic.latitude));
        formUpdate.append(field("longitude", "Longitude:", clinic.longitude));
        formUpdate.append("</form>");
        formUpdate.append(buttonUpdate);
        formUpdate.append(buttonDelete);
        formUpdate.append(buttonCancel);

        var marker = L.marker([clinic.latitude, clinic.longitude], {title: clinic["name"]});
        if (lowStockClinic(clinic)) {
            marker.setIcon = L.Icon({ iconUrl: 'images/marker-icon-red.png'});
        }
        marker.addTo(markersLayer)
        marker.bindPopup(formUpdate[0]);

    }

    var formCreate = function (event) {
        var buttonCreate = $("<button id='btn-create' type=submit>Update</button>").click(function () {
            var form = $("#form-create");
            createClinic(form.serialize());
        });
        var formCreate = $("<form id='form-create'>");
        formCreate.append("<h1>Add Clinic</h1>");
        // form.append("<form id='update-form'>");
        formCreate.append(field("name", "Name:", ""));
        formCreate.append(field("countryId", "Country:", ""));
        formCreate.append(field("nevirapineStock", "Nevirapine:", ""));
        formCreate.append(field("stavudineStock", "Stavudine:", ""));
        formCreate.append(field("zidotabineStock", "Zidotabine:", ""));
        formCreate.append(field("latitude", "Latitude:", event.latlng.lat));
        formCreate.append(field("longitude", "Longitude:", event.latlng.lng));
        formCreate.append("</form>");
        formCreate.append(buttonCreate);

        return formCreate;
    };

    var popup = L.popup();
    function onMapClick(e) {
        if (createMode) {
            popup
                .setLatLng(e.latlng)
                .setContent(formCreate(e)[0])
                .openOn(map);
        }
    }

    var list = new L.Control.ListMarkers({layer: markersLayer, itemIcon: null});
  //TODO: see if you can fix this
  /*  list.on('item-mouseover',function (e) {
        e.layer.options.icon.options.iconUrl = L.Icon.Default.imagePath + 'marker-icon-green.png';
            (L.icon({
            iconUrl: L.Icon.Default.imagePath + 'marker-icon-green.png'
        })                    );
    }).on('item-mouseout', function (e) {
            e.layer.setIcon(L.icon({
                iconUrl: L.Icon.Default.imagePath+'/marker-icon.png'
            }))
        });  */

    map.addControl(list);

    map.on('click', onMapClick);
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
    grid.setSelectionModel(new Slick.RowSelectionModel());
    //grid.onClick.subscribe(setSelectedGridRow);
    grid.onSelectedRowsChanged.subscribe(function () {
        selectedClinic = (grid.getData()[grid.getSelectedRows()]);
        alert(selectedClinic["clinicId"]);
        setMapSelectedMarker(selectedClinic["clinicId"]);
    });
}

function setMapSelectedMarker(id) {

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
                barWidth: 1 / chartData.ticks.length,
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
function getLowStockClinics() {
    return $.ajax({
        type: "GET",
        url: "/clinics/lowStock",
        async: false
    }).responseText;
}
function deleteClinic(id) {
    return $.ajax({
        type: "DELETE",
        url: "/clinics/" + id,
        async: false
    }).responseText;
}
function updateClinic(clinic) {
    return $.ajax({
        type: "PUT",
        url: "/clinics/update?" + clinic,
        async: false
    }).responseText;
}
function createClinic(clinic) {
    return $.ajax({
        type: "POST",
        url: "/clinics/add",
        data: clinic,
        async: false
    }).responseText;
}

function toggleCreate() {
    if (createMode == true) {
        createMode = false;
        $("#buttonToggle").html("Add Mode Off");
    } else {
        createMode = true;
        $("#buttonToggle").html("Add Mode On");
    }
}
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};







