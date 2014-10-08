//TODO: create a module of type main here, so that you can use global json with all clinic details
function loadContent() {
    //Do the initial

    var clinicData = JSON.parse(getClinicData());

    if (!clinicData) {
        alert("No data Received");
    }
   // prepareChart("ms-grid", clinicData);
    //prepareGrid(clinicData);
    //prepareMap(clinicData);
    openDialogBox();
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
        var button = $("<button id='btn-dialog' type=submit>Testlink" + clinic.name + "</button>").click(function () {

           /* //var updatedclinic = {
               var clinicId= $("#propbox-clinicId-" + clinic.clinicId).val();
              var name = $("#propbox-name-" + clinic.clinicId).val();
                //"countryId": $("#propbox-countryId-" + clinic.clinicId).val(),
                //"nevirapineStock": $("#propbox-Nevirapine-" + clinic.clinicId).val(),
               var  stavudineStock = $("#propbox-Stavudine-" + clinic.clinicId).val();
               /* "zidotabineStock": $("#propbox-Zidotabine-" + clinic.clinicId).val()
                //"lattitude":$("#propbox-name-" + clinic.clinicId).val(),
                //"longitude":$("#propbox-name-" + clinic.clinicId).val()
           // };

            //updateClinic(updatedclinic);*/
            openDialogBox(form);
        });

        var field = function (id, label, value) {
            var f = "<div style='padding: 2px 0 2px 0'>" +
                "<label style='width: 120px;display: inline-block;'>" + label + "</label>" +
                "<input id='propbox-" + id + "' type='text' style='width: 204px;' value='" + value + "'/>" +
                "</div>";
            return f;
        };
        var form = $("<div id='form-update' style='height: 600px'>");
        form.append("<h1>Clinic: " + clinic.name + "</h1>");
       // form.append("<form id='update-form'>");
        form.append(field("clinicId-" + clinic.clinicId, "Clinic ID:", clinic.clinicId));
        form.append(field("name-" + clinic.clinicId, "Name:", clinic.name));
        form.append(field("countryId-" + clinic.clinicId, "Country:", clinic.countryId));
        form.append(field("Nevirapine-" + clinic.clinicId, "Nevirapine:", clinic.nevirapineStock));
        form.append(field("Stavudine-" + clinic.clinicId, "Stavudine:", clinic.stavudineStock));
        form.append(field("Zidotabine-" + clinic.clinicId, "Zidotabine:", clinic.countryId));
        form.append("</div>");
        //form.append(button)[0];
        openDialogBox(form.append(button)[0]);


        L.marker([clinic.lattitude, clinic.longitude], L.Icon({iconUrl: '/images/marker-icon.png'})).addTo(map)
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
        url: "/clinicData",
        async: false
    }).responseText;
}
function openDialogBox() {
    $(function() {
        $( "#ms-grid" ).dialog({
            autoOpen: false
        });
        $( "#top-button" ).click(function() {
            $( "#dialog-1" ).dialog( "open" );
        });
    });

    $(function() {
        var dialog, form,

        // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
            emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            name = $( "#name" ),
            email = $( "#email" ),
            password = $( "#password" ),
            allFields = $( [] ).add( name ).add( email ).add( password ),
            tips = $( ".validateTips" );

        function updateTips( t ) {
            tips
                .text( t )
                .addClass( "ui-state-highlight" );
            setTimeout(function() {
                tips.removeClass( "ui-state-highlight", 1500 );
            }, 500 );
        }

        function checkLength( o, n, min, max ) {
            if ( o.val().length > max || o.val().length < min ) {
                o.addClass( "ui-state-error" );
                updateTips( "Length of " + n + " must be between " +
                    min + " and " + max + "." );
                return false;
            } else {
                return true;
            }
        }

        function checkRegexp( o, regexp, n ) {
            if ( !( regexp.test( o.val() ) ) ) {
                o.addClass( "ui-state-error" );
                updateTips( n );
                return false;
            } else {
                return true;
            }
        }

        function addUser() {
            var valid = true;
            allFields.removeClass( "ui-state-error" );

            valid = valid && checkLength( name, "username", 3, 16 );
            valid = valid && checkLength( email, "email", 6, 80 );
            valid = valid && checkLength( password, "password", 5, 16 );

            valid = valid && checkRegexp( name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
            valid = valid && checkRegexp( email, emailRegex, "eg. ui@jquery.com" );
            valid = valid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );

            if ( valid ) {
                $( "#users tbody" ).append( "<tr>" +
                    "<td>" + name.val() + "</td>" +
                    "<td>" + email.val() + "</td>" +
                    "<td>" + password.val() + "</td>" +
                    "</tr>" );
                dialog.dialog( "close" );
            }
            return valid;
        }

        dialog = $( "#dialog-form" ).dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            buttons: {
                "Create an account": addUser,
                Cancel: function() {
                    dialog.dialog( "close" );
                }
            },
            close: function() {
                form[ 0 ].reset();
                allFields.removeClass( "ui-state-error" );
            }
        });

        form = dialog.find( "form" ).on( "submit", function( event ) {
            event.preventDefault();
            addUser();
        });

        $( "#create-user" ).button().on( "click", function() {
            dialog.dialog( "open" );
        });
    });
}




$(document).ready(loadContent());



