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
                barWidth: 1/chartData.ticks.length,
                order: 1,
                align:"center"
            }
        },
        xaxis: {
           //tickSize: 1,
            tickLength: 0,
            axisLabel: "Clinics",
            axisLabelUseCanvas: true,
            axisLabelFontFamily: "Verdana",
            axisLabelFontSizePixels: 18,
            axisLabelPadding: 20,
            mode: "categories",
            ticks: chartData.ticks
        },
        yaxis: {
            axisLabel: "MedicineStock",
            axisLabelUseCanvas: true,
            axisLabelFontFamily: "verdana",
            axisLabelFontSizePixels: 20,
            axisLabelPadding: 20
        },
        selection: { mode: "x" }
    };
    $.plot($("#" + divId),chartData.data,settings);
}

function loadContent() {
  //  preparePropertyBox("ms-propbox");
    prepareChart("ms-grid", mockedBarGraphData);
}
//TODO: remove this after implementation!
var mockedBarGraphData = [
     {
        "name": "Mezza",
        "id": "001",
        "country": "ZA",
        "nev": "10",
        "sta": "5",
        "zid": "8"
    },
    {
        "name": "Nine",
        "id": "002",
        "country": "UG",
        "nev": "3",
        "sta": "2",
        "zid": "11"
    },
    {
        "name": "Med",
        "id": "002",
        "country": "UG",
        "nev": "4",
        "sta": "5",
        "zid": "1"
    },
    {
        "name": "Supplies",
        "id": "002",
        "country": "UG",
        "nev": "3",
        "sta": "7",
        "zid": "20"
    }
];
function barGraphDataPreparation(sourceData) {
    if (!sourceData) return;

    var chartData = {
        ticks: [],
        data:[]
    };
    var nevirapine = [];
    var stavudine = [];
    var zidotabine = [];
    for (var i = 0; i < sourceData.length;i++){
        var clinic = sourceData[i];
        var clinName = clinic["name"];
        nevirapine.push([i,clinic["nev"]]);
        stavudine.push([i,clinic["sta"]]);
        zidotabine.push([i,clinic["zid"]]);
        chartData.ticks.push([i,clinName]);
    }
        chartData.data.push({
            data: nevirapine,
            label:"nevirapine"
        });
        chartData.data.push({
            data:stavudine,
            label:"stavudine"
        });

        chartData.data.push({
            data:zidotabine,
            label:"zidotabine"
        });

    return chartData;
}



