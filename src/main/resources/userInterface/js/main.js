//Some Global variables needed to control some state of components
function loadChart() {

    var data = JSON.parse(getClinicData());
    if (!data) {
        alert("No data Received");
    }
    prepareChart("ms-chart", data);
}

function loadMap() {

    var data = JSON.parse(getClinicData());
    if (!data) {
        alert("No data Received");
    }
    prepareMap("ms-map", data);
}

function loadGrid() {

    var data = JSON.parse(getClinicData());
    if (!data) {
        alert("No data Received");
    }
    prepareGrid("table-data", data);
    displayLowStockWarning(data);
}

//This checks if the Clinic object has stock levels less than 5
function lowStockClinic(clinic) {
    return clinic["stavudineStock"] < 5 || clinic["zidotabineStock"] < 5 || clinic["nevirapineStock"] < 5;
}

//This will do the setup for my map component
function prepareMap(divId, cd) {

    //The map is set to the middle point of africa
    var map = L.map(divId).setView([-3.0, 23.0], 3);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'examples.map-i875mjb7'
    }).addTo(map);
    //Here we plot the markers on the map according to the stock level
    for (var i = 0; i < cd.length; i++) {
        var clinic = cd[i];

        var icon = L.icon({
            iconUrl: 'js/images/marker-icon-green.png',
            shadowUrl: 'js/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [11, 41],
            popupAnchor: [0, -42],
            shadowSize: [41, 41],
            shadowAnchor: [11, 41]
        });

        if (lowStockClinic(clinic) === true) {
            icon = L.icon({
                iconUrl: 'js/images/marker-icon-red.png',
                shadowUrl: 'js/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [11, 41],
                popupAnchor: [0, -42],
                shadowSize: [41, 41],
                shadowAnchor: [11, 41]
            });
        }

        var popupText = "<h4>Name: " + clinic["clinicName"] + " </h4>" +
            "Nevirapine: " + clinic["nevirapineStock"] + "<br/>" +
            "Stavudine: " + clinic["stavudineStock"] + "<br/> " +
            "Zidotabine: " + clinic["zidotabineStock"];

        var marker = L.marker([clinic["latitude"], clinic["longitude"]], {
            icon: icon
        });

        marker.bindPopup(popupText);
        marker.addTo(map);
        marker.on('mouseover', marker.openPopup.bind(marker));
        marker.on('mouseout', marker.closePopup.bind(marker));

    }
}

//This is the basic grid setup
function prepareGrid(divId, cd) {

    var btnUpdate = $("#btn-update-clinic");
    var btnDelete = $("#btn-delete-clinic");
    btnUpdate.attr('disabled', 'disabled');
    btnDelete.attr('disabled', 'disabled');
    var dataTable = $("#" + divId);
    dataTable.bootstrapTable({
        height: 450,
        search: true,
        showColumns: true,
        clickToSelect: true,
        striped: true,
        toolbar: '#table-toolbar',
        columns: [
            {
                field: 'state',
                radio: true
            },
            {
                field: 'clinicId',
                title: 'Clinic ID'
            },
            {
                field: 'clinicName',
                title: 'Clinic Name'

            },
            {
                field: 'countryName',
                title: 'Country'

            },
            {
                field: 'nevirapineStock',
                title: 'Nevirapine'
            },
            {
                field: 'stavudineStock',
                title: 'Stavudine'
            },
            {
                field: 'zidotabineStock',
                title: 'Zidotabine'
            },
            {
                field: 'latitude',
                title: 'Latitude'
            },
            {
                field: 'longitude',
                title: 'Longitude'
            }
        ]
    });

    dataTable.bootstrapTable('load', cd);
    dataTable.bootstrapTable({}).on('all.bs.table', function (e, name, args) {
        btnUpdate.removeAttr('disabled');
        btnDelete.removeAttr('disabled');
    });
    var getSelectedClinic = function () {
        var selectedClinic = JSON.stringify(dataTable.bootstrapTable('getSelections'));
        if (JSON.parse(selectedClinic).length === 0) {
            alert("Please select a clinic first");
            return undefined;
        } else {
            return JSON.parse(selectedClinic);
        }
    };

    var refreshTable = function () {
        var refresh = JSON.parse(getClinicData());
        dataTable.bootstrapTable('load', refresh);
        btnUpdate.attr('disabled', 'disabled');
        btnDelete.attr('disabled', 'disabled');
    };

    btnUpdate.click(function () {
        var clinic = getSelectedClinic()[0];
        if (clinic) {
            $("#button-update").show();
            $("#button-create").hide();
            $("#clinicName").val(clinic["clinicName"]);
            $("#countryName").val(clinic["countryName"]);
            $("#nev").val(clinic["nevirapineStock"]);
            $("#sta").val(clinic["stavudineStock"]);
            $("#zid").val(clinic["zidotabineStock"]);
            $("#lat").val(clinic["latitude"]);
            $("#lon").val(clinic["longitude"]);
            $("#button-update").click(function () {
                var updatedClinic = $("#create-form").serialize();
                updatedClinic += "&clinicId=" + clinic["clinicId"];
                $("#button-update").hide();
                $("#button-create").show();
                updateClinic(updatedClinic);
            });
        }
        $("#create-modal").hide();
    });
    //Set the CRUD operations here, where the relevant button is pressed
    $("#btn-delete-clinic").click(function () {
        var clinicId = getSelectedClinic()[0]["clinicId"];
        if (clinicId) {
            deleteClinic(clinicId);
            refreshTable();
        }

    });

    $("#btn-low-stock").click(function () {
        var lsClinics = JSON.parse(getLowStockClinics());
        dataTable.bootstrapTable('load', lsClinics);
    });

    $("#btn-all-clinics").click(function () {
        var allClinics = JSON.parse(getClinicData());
        dataTable.bootstrapTable('load', allClinics);
    });

    $("#button-create").click(function () {
        var clinic = $("#create-form").serialize();
        createClinic(clinic);
    });
    //Set up the modal map for the selection lat lon values
    var lat = $("#lat");
    var lon = $("#lon");

    var map = L.map('map').setView([-3.0, 23.0], 3);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'examples.map-i875mjb7'
    }).addTo(map);

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent(e.latlng.lat + " , " + e.latlng.lng)
            .openOn(map);

        lat.val(e.latlng.lat);
        lon.val(e.latlng.lng);
    }

    map.on('click', onMapClick);

    $('#mapModal').on('show.bs.modal', function () {
        setTimeout(function () {
            map.invalidateSize();
        }, 300);
    });
    //Validation on the input update/create form
    $('#create-form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            clinicName: {
                validators: {
                    notEmpty: {
                        message: 'The username is required'
                    }
                }
            },
            countryName: {
                validators: {
                    notEmpty: {
                        message: 'The country name is required'
                    }
                }
            },
            nevirapineStock: {
                validators: {
                    notEmpty: {
                        message: 'The stock value is required'
                    },
                    numeric: {
                        message: 'Must be a number'
                    }
                }
            },
            stavudineStock: {
                validators: {
                    notEmpty: {
                        message: 'The stock value required'
                    },
                    numeric: {
                        message: 'Must be a number'
                    }
                }
            },
            zidotabineStock: {
                validators: {
                    notEmpty: {
                        message: 'The stock value required'
                    },
                    numeric: {
                        message: 'Must be a number'
                    }
                }
            },
            latitude: {
                validators: {
                    notEmpty: {
                        message: 'The latitude is required'
                    }
                }
            },
            longitude: {
                validators: {
                    notEmpty: {
                        message: 'The latitude is required'
                    }
                }
            }
        }
    });
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
                barWidth: 0.9 / chartData.ticks.length,
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
            axisLabelFontSizePixels: 20,
            axisLabelPadding: 20,
            mode: "categories",
            ticks: chartData.ticks
        },
        yaxis: {
            axisLabel: "Medicine Stock",
            axisLabelUseCanvas: true,
            axisLabelFontFamily: "verdana",
            axisLabelFontSizePixels: 20,
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
        var clinName = clinic["clinicName"];
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

//This will display the warning for low stock clinics

function displayLowStockWarning(clinics) {
    var alertOutput = "Warning! The Following Clinics are low on stock: \n";
    for (var i in clinics) {
        var nev = clinics[i]["nevirapineStock"];
        var sta = clinics[i]["stavudineStock"];
        var zid = clinics[i]["zidotabineStock"];
        var clinName = clinics[i]["clinicName"];
        var cls = "\t•" + clinName + " is low on:";
        var flag = 0;
        if (nev < 5) {
            cls += " Nevirapine;";
            flag++;
        }
        if (sta < 5) {
            cls += " Stavudine;"
            flag++;
        }
        if (zid < 5) {
            cls += " Zidotabine"
            flag++;
        }
        if (flag == 0) {
            alertOutput += "";
            continue;
        }
        cls += "\n";
        alertOutput += cls;
    }
    alert(alertOutput);
}




