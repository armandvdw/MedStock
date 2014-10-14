//Some Global variables needed to control some state of components
var clinicData =[undefined]; //JSON.parse(getClinicData());
var mapZoomLevel = 3;//This is the default setting for the leaflet map
var mapLat = 0.56;
var mapLon = 22.89;
var selectedClinic = clinicData[0];
var createMode = false; //The toggle button to add new clinics.
var displayedWarning = false;

//This is used to load the Components with data/ also used as a refresher.
function loadContent() {
 /*   if (!clinicData) {
        alert("No data Received");
    }
	if(!displayedWarning){
		displayLowStockWarning(clinicData);
	}
    prepareChart("ms-chart", clinicData);
    prepareGrid("ms-grid", clinicData);
    prepareMap("ms-map", clinicData);*/
}

function loadChart(){

    var data = JSON.parse(getClinicData());
    if (!data) {
        alert("No data Received");
    }
    prepareChart("ms-chart", data);
}
function loadMap(){
    var data = JSON.parse(getClinicData());
    if (!data) {
        alert("No data Received");
    }
    prepareMap("ms-map",data);
}
function loadGrid(){
    var data = JSON.parse(getClinicData());
    if (!data) {
        alert("No data Received");
    }
    prepareGrid("ms-grid",data);
}

//Set the global content to all stock
function setContentToAllStock() {
    clinicData = JSON.parse(getClinicData());
	displayLowStockWarning(clinicData);
    loadContent();
}

//Gets the low stock and updates the global content to show it.
function setContentToLowStock() {
    clinicData = JSON.parse(getLowStockClinics());
	displayLowStockWarning(clinicData);
    loadContent();
}
//TODO: check if this works
//This checks if the Clinic object has stock levels less than 5
function lowStockClinic(clinic) {
    return clinic["stavudineStock"] < 5 || clinic["zidotabineStock"] < 5 || clinic["nevirapineStock"] < 5;
}

//This will do the setup for my map component
function prepareMap(divId, cd) {
    //Basic map initializer
    var map = L.map(divId, {
        closePopupOnClick: true
    });

    map.setView([mapLat, mapLon], mapZoomLevel);
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'examples.map-i875mjb7'
    }).addTo(map);

    //Add amrker layer to the map to enable marker shortcuts
    var markersLayer = new L.LayerGroup();	//layer contain searched elements
    map.addLayer(markersLayer);

    //Create the map content
    for (var i = 0; i < cd.length; i++) {
        var clinic = cd[i];

        //Create the update button
        var buttonUpdate = $("<button id='btn-update' type=submit>Update</button>").click(function (data) {
            var form = $("#form-update");
            updateClinic(form.serialize());
        });

        //Create the Delete button
        var buttonDelete = $("<button id='btn-delete' type=submit>Delete</button>").click(function (data) {
            var form = $("#form-update");
            if (confirm("Are you sure you want to delete this clinic?"))deleteClinic(form.serializeObject()["clinicId"]);
        });

        //Create the cancel button.
        var buttonCancel = $("<button id='btn-cancel'>Cancel</button>").click(function (data) {
            map.closePopup()
        });

        //A reusable function to create fields.
        var field = function (name, label, value) {
            return "<div style='padding: 2px 0 2px 0'>" +
                "<label style='width: 120px;display: inline-block;'>" + label + "</label>" +
                "<input name=" + name + " type='text' style='width: 204px;' value='" + value + "'/>" +
                "</div>";
        };

        //Create the form to be displayed in the popup
        var formUpdate = $("<form id='form-update'>");
        formUpdate.append("<h1>Clinic: " + clinic.name + "</h1>");
        // form.append("<form id='update-form'>");
        formUpdate.append(field("clinicId", "Clinic ID:", clinic.clinicId));
        formUpdate.append(field("name", "Name:", clinic.name));
        formUpdate.append(field("countryName", "Country:", clinic.countryName));
        formUpdate.append(field("nevirapineStock", "Nevirapine:", clinic.nevirapineStock));
        formUpdate.append(field("stavudineStock", "Stavudine:", clinic.stavudineStock));
        formUpdate.append(field("zidotabineStock", "Zidotabine:", clinic.zidotabineStock));
        formUpdate.append(field("latitude", "Latitude:", clinic.latitude));
        formUpdate.append(field("longitude", "Longitude:", clinic.longitude));
        formUpdate.append("</form>");
        formUpdate.append(buttonUpdate);
        formUpdate.append(buttonDelete);
        formUpdate.append(buttonCancel);

        //Add red markers to the map where stock is low
        var marker = L.marker([clinic.latitude, clinic.longitude], {title: clinic["name"]});
        if (lowStockClinic(clinic)) {
            marker.setIcon = L.Icon({ iconUrl: 'js/images/marker-icon-red.png'});
        }
        marker.addTo(markersLayer);
        marker.bindPopup(formUpdate[0]);
    }
    //
    var formCreate = function (event) {

        var buttonCreate = $("<button id='btn-create' type=submit>Create</button>").click(function () {
            var form = $("#form-create");
            createClinic(form.serialize());
        });
        var formCreate = $("<form id='form-create'>");
        formCreate.append("<h1>Add Clinic</h1>");
        // form.append("<form id='update-form'>");
        formCreate.append(field("name", "Name:", ""));
        formCreate.append(field("countryName", "Country:", ""));
        formCreate.append(field("nevirapineStock", "Nevirapine:", ""));
        formCreate.append(field("stavudineStock", "Stavudine:", ""));
        formCreate.append(field("zidotabineStock", "Zidotabine:", ""));
        formCreate.append(field("latitude", "Latitude:", event.latlng.lat));
        formCreate.append(field("longitude", "Longitude:", event.latlng.lng));
        formCreate.append("</form>");
        formCreate.append(buttonCreate);
        return formCreate;
    };
    //Create the popup to add the new clinic
    var popup = L.popup();
    function onMapClick(e) {
        if (createMode) {
            popup
                .setLatLng(e.latlng)
                .setContent(formCreate(e)[0])
                .openOn(map);
        }
    }

    //Create the markers list to add to the map
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

//This will toggle the stat of the button to create new clinics on map click
function toggleCreate() {
    if (createMode == true) {
        createMode = false;
        $("#buttonToggle").html("Add Mode Off");
    } else {
        createMode = true;
        $("#buttonToggle").html("Add Mode On");
    }
}

//This is the basic grid setup
function prepareGrid(divId, cd) {
    var grid;
    var columns = [
        {id: "ID", name: "ID", field: "clinicId", maxWidth: 30, width: 25},
        {id: "Name", name: "Name", field: "name"},
        {id: "Country", name: "Country", field: "countryName"},
        {id: "Nevirapine", name: "Nevirapine", field: "nevirapineStock"},
        {id: "Stavudine", name: "Stavudine", field: "stavudineStock"},
        {id: "Zidotabine", name: "Zidotabine", field: "zidotabineStock"}
    ];

    var options = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        forceFitColumns: true

    };
    grid = new Slick.Grid("#" + divId, cd, columns, options);
    grid.setSelectionModel(new Slick.RowSelectionModel());
    grid.onSelectedRowsChanged.subscribe(function () {
        selectedClinic = (grid.getData()[grid.getSelectedRows()]);
        setMapSelectedMarker(selectedClinic["clinicId"]);
    });
}
//TODO: this does not work yet
function setMapSelectedMarker(id) {
    //IF there is a way to click on the map, this would be the spot to add it to integrat grid and map
}

//This is the chart setup
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
                barWidth: 0.8 / chartData.ticks.length,
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

//This will setup the data for the graph
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

//Here lies the ajax calls tot the backend for CRUD operations
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

//This is a function to convert Objects to a format that can be send through the requests to backend
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
//This will display the warning for low stock clinics

function displayLowStockWarning(clinics){
	var alertOutput = "Warning! The Following Clinics are low on stock: \n";
	for(var i in clinics){
		var nev = clinics[i]["nevirapineStock"];
		var sta = clinics[i]["stavudineStock"];
		var zid = clinics[i]["zidotabineStock"];
		var clinName = clinics[i]["name"];
		var cls = "\t•"+clinName+ " is low on:";

		if(nev < 5){
			cls+= " Nevirapine;";
		}else if(sta < 5){
			cls+= " Stavudine;"
		}else if(zid < 5){
			cls+= " Zidotabine"
		}else{
			alertOutput+="";
			continue;
		}
		cls+="\n";
		alertOutput += cls;
	}
	//alert(alertOutput);
	displayedWarning = true;
}



