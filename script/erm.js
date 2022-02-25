///////////////////////////////////////////////////////////////////////////////////////////////////
// ERM - Extreme Rainfall Monitoring: will it trigger a flood? 
//
// ERM in GEE are able to inform where is the estimated location of extreme rainfall in the last
// 5-days (Near Real Time - NRT) and upto 5-days ahead (Forecast - FCT) based on selected date.
// NRT data available starting from 1 Jun 2000, while FCT data available from 1 Jul 2015.
//
// Some of the input is prepared via different platform: ArcGIS Pro, R Statistics, and Excel.
// ERM module is part of VAMPIRE (https://vampire.idn.wfp.org) hazard features
// The code was compiled from various source (GEE help, GEE Groups, StackExchange)
//
// Author:
// Benny Istanto | Earth Observation and Climate Analyst | benny.istanto@wfp.org
// Ridwan Mulyadi | System Developer | ridwan.mulyadi@wfp.org
// Vulnerability Analysis and Mapping (VAM) unit, UN World Food Programme - Indonesia
///////////////////////////////////////////////////////////////////////////////////////////////////




// GLOBAL VARIABLE (Basemap, Color, Static Data, Mask and others)
//---
// ui Map and Panel configuration
var mainMap = ui.Map();
var uiComponents = {};

// MAP STYLE
//--
// Grey style from https://developers.google.com/maps/documentation/javascript/examples/style-selector
function mapStyle() {
  return [
    {
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{ color: "#bdbdbd" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#eeeeee" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#dadada" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{ color: "#eeeeee" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#c9c9c9" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
  ];
}

// Grey basemap
mainMap.style().set('cursor', 'crosshair');
mainMap.setOptions('Grey', { Grey: mapStyle() });

// SYMBOLOGY
// Visualization palette, Color-codes based on Color-Brewer https://colorbrewer2.org/
// Standard symbology for rainfall
var visRainfall = {
  min: 1, max: 100, opacity: 0.7, palette: [
    'cccccc', 'f9f3d5', 'dce2a8', 'a8c58d', '77a87d', 'ace8f8',
    '4cafd9', '1d5ede', '001bc0', '9131f1', 'e983f3', 'f6c7ec'
  ]
};
// Standard symbology for extreme rainfall class
var visExtreme = {
  min: 1, max: 4, opacity: 0.7, palette: [
    'ffffcc', 'a1dab4', '41b6c4', '225ea8'
  ]
};
// Standard symbology for likelihood of flooding
var visLikelihood = {
  min: 1, max: 3, opacity: 0.7, palette: [
    'f7fcb9', 'addd8e', '31a354'
  ]
};
// Standard symbology for extreme rainfall triggering flood alert class
var visFlood = {
  min: 0, max: 9, opacity: 0.7, palette: [
    '97D700', 'FFEDA0', 'FFEDA0', 'FFEDA0', 'FEB24C', 'FEB24C',
    'FEB24C', 'F03B20', 'F03B20', 'F03B20'
  ]
};
// Standard symbology for population exposed
var visPopulation = {
  min: 0, max: 50.0, opacity: 0.7,
  palette: ['yellow', 'orange', 'red'],
};

// Define an SLD style of discrete intervals to apply to the image.
// Notes: SLD visualisation will make the data rendered as RGB during point inspector into a pixel.
var visRainfallSLD =
  '<RasterSymbolizer>' +
  '<ColorMap  type="ramp" extended="false" >' +
  '<ColorMapEntry color="#ffffff" opacity="0.0" quantity="1" label="No Rain" />' +
  '<ColorMapEntry color="#cccccc" opacity="0.7" quantity="3" label="1-3" />' +
  '<ColorMapEntry color="#f9f3d5" opacity="0.7" quantity="10" label="4-10" />' +
  '<ColorMapEntry color="#dce2a8" opacity="0.7" quantity="20" label="11-20" />' +
  '<ColorMapEntry color="#a8c58d" opacity="0.7" quantity="30" label="21-30" />' +
  '<ColorMapEntry color="#77a87d" opacity="0.7" quantity="40" label="31-40" />' +
  '<ColorMapEntry color="#ace8f8" opacity="0.7" quantity="60" label="41-60" />' +
  '<ColorMapEntry color="#4cafd9" opacity="0.7" quantity="80" label="61-80" />' +
  '<ColorMapEntry color="#1d5ede" opacity="0.7" quantity="100" label="81-100" />' +
  '<ColorMapEntry color="#001bc0" opacity="0.7" quantity="120" label="101-120" />' +
  '<ColorMapEntry color="#9131f1" opacity="0.7" quantity="150" label="121-150" />' +
  '<ColorMapEntry color="#e983f3" opacity="0.7" quantity="200" label="151-200" />' +
  '<ColorMapEntry color="#f6c7ec" opacity="0.7" quantity="1000" label="&gt; 200" />' +
  '</ColorMap>' +
  '</RasterSymbolizer>';



// MAIN INPUT
//---
// Masking image
function maskImage(image) {
  var imergMask = ee.Image('users/bennyistanto/datasets/raster/extremerainfall/mask/idn_bnd_imerg_subset');
  return image.updateMask(imergMask);
}
var idnMask = ee.Image('users/bennyistanto/datasets/raster/extremerainfall/mask/idn_bnd_imerg_subset');

// Near Real Time data
// Import NASA GPM IMERG 30 minute data and calculate accumulation for 1day.
var imerg = ee.ImageCollection("NASA/GPM_L3/IMERG_V06");
// Get IMERG projection information
var IMERGprojection = ee.Image(imerg.first()).projection();

// Forecast data
// Import GFS data - https://developers.google.com/earth-engine/datasets/catalog/NOAA_GFS0P25
var gfs = ee.ImageCollection('NOAA/GFS0P25');

// Population grid
// Import Global Human Settlement Popluation Density layer (GHSL) data. Resolution: 250. Number of people per cell is given.
// https://developers.google.com/earth-engine/datasets/catalog/JRC_GHSL_P2016_POP_GPW_GLOBE_V1#bands
var ghsl_raw = maskImage(ee.Image(ee.ImageCollection("JRC/GHSL/P2016/POP_GPW_GLOBE_V1").first()).select('population_count'));
var ghsl = ghsl_raw.updateMask(ghsl_raw.gt(0));
// Get GHSL projection information
var GHSLprojection = ghsl.projection();

// MODIS Global Annual Land Cover 500m - year 2019, filter image collection by the most up-to-date MODIS Land Cover product
// Import Crop extent data - https://developers.google.com/earth-engine/datasets/catalog/MODIS_006_MCD12Q1#bands
// LC_Type1 using Annual International Geosphere-Biosphere Programme (IGBP) classification
var mcd12q1_raw = ee.Image('MODIS/006/MCD12Q1/2019_01_01').select("LC_Type1");
var mcd12q1 = mcd12q1_raw.updateMask(mcd12q1_raw.gt(0));
// Get MODIS projection information
var MODISprojection = mcd12q1_raw.projection();



// FUNCTION
//---
// Get Threshold Image
function getThresholdImage(p, numday) {
  var q = {
    'P50': 'q0500_2yr', // Percentile 50, 2-year return period
    'P80': 'q0800_5yr', // Percentile 80, 5-year return period
    'P90': 'q0900_10yr', // Percentile 90, 10-year return period
    'P96': 'q0960_25yr' // Percentile 96, 25-year return period
  }[p];
  var path = 'users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_'
    + numday + 'day_precipthreshold_'
    + q + '_imerg_wfp';
  return ee.Image(path);
}

// Get Slope Image
// File and location for Day1 and January: "users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day1_01_jan_slope_imerg"
function getSlopeImage(month, numday) {
  var m = ['',
    '01_jan', '02_feb', '03_mar', '04_apr', '05_may', '06_jun',
    '07_jul', '08_aug', '09_sep', '10_oct', '11_nov', '12_dec'
  ][month];
  var path = 'users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day'
    + numday + '_' + m + '_slope_imerg';
  return ee.Image(path);
}

// Get Intercept Image
// File and location for Day1 and January: "users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day1_01_jan_intercept_imerg"
function getInterceptImage(month, numday) {
  var m = ['',
    '01_jan', '02_feb', '03_mar', '04_apr', '05_may', '06_jun',
    '07_jul', '08_aug', '09_sep', '10_oct', '11_nov', '12_dec'
  ][month];
  var path = 'users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day'
    + numday + '_' + m + '_intercept_imerg';
  return ee.Image(path);
}

// Get near real-time data (IMERG Image)
function getImergImage(dt, numday) {
  // 24 ~ 1day. To get previous data I used negative value
  var hours = -24 * numday;

  return imerg // ee.ImageCollection('NASA/GPM_L3/IMERG_V06')
    .select('precipitationCal')
    .filterDate(dt.advance(hours, 'hour'), dt)
    .map(maskImage)
    .sum().float();
}

// Get forecast data (GFS Image)
function getGfsImage(dt, numday) {
  // Grab forecast data for hours 6,12,18,24 (Day1) 30,36,42,48 (Day2) 54,60,66,72 (Day3) 
  // 78,84,90,96 (Day4) 102,108,114 and 120 (Day5) 
  var hours = [];
  for (var i = 0; i < numday; i++) {
    for (var j = 0; j < 4; j++) {
      var h = (i * 24) + ((j + 1) * 6);
      hours.push(h);
    }
  }

  return gfs // ee.ImageCollection('NOAA/GFS0P25')
    .select('total_precipitation_surface')
    .filterDate(dt, dt.advance(6, 'hour'))
    .filter(ee.Filter.inList('forecast_hours', hours))
    .map(maskImage)
    .sum()
    // .resample('bicubic') // One of 'bilinear' or 'bicubic'
    .reproject({
      crs: IMERGprojection.atScale(11131.949079327358)
    });
}


// EXTREME RAINFALL ANALYSIS
//----
// Get images for rainfall accumulation, extreme rainfall, probability and the alert
// Base image can be from IMERG or GFS
function getRainfallExtremeImage(params) {
  var dt = params.date;
  var numday = params.numday;
  var imgBase = params.imgBase;
  var rainfallColumn = params.rainfallColumn;
  // Get month information to match data for Threshold, Slope and Intercept
  var month = dt.get('month').getInfo();

  // Get data for Threshold, Slope and Intercept based on date
  // Threshold
  var P50 = getThresholdImage('P50', numday); // Percentile 50, 2-year return period
  var P80 = getThresholdImage('P80', numday); // Percentile 80, 5-year return period
  var P90 = getThresholdImage('P90', numday); // Percentile 90, 10-year return period
  var P96 = getThresholdImage('P96', numday); // Percentile 96, 25-year return period
  // Slope
  var imgSlope = getSlopeImage(month, numday);
  // Intercept
  var imgIntercept = getInterceptImage(month, numday);

  // Mosaic rainfall with threshold images
  var imgImpactSrc = imgBase
    .addBands(P50)
    .addBands(P80)
    .addBands(P90)
    .addBands(P96);

  // Extract a pixel of rainfall exceeding the threshold, called as impact
  var imgImpact = imgImpactSrc.expression(
    'impact = R>P96?4:(R>P90?3:(R>P80?2:(R>P50?1:R*0)))', {
    'R': imgImpactSrc.select(rainfallColumn),
    'P50': imgImpactSrc.select('b1'),
    'P80': imgImpactSrc.select('b1_1'),
    'P90': imgImpactSrc.select('b1_2'),
    'P96': imgImpactSrc.select('b1_3'),
  });

  // Mosaic rainfall with slope and intercepts images
  var imgProbSrc = imgBase
    .addBands(imgSlope)
    .addBands(imgIntercept);

  // Calculate the likelihood a pixel of rainfall will trigger a flood or not
  var imgProbBase = imgProbSrc.expression(
    'prob_base = 1/(1+(e **(-((S*R)+I))))', {
    'e': Math.E,
    'R': imgProbSrc.select(rainfallColumn),
    'S': imgProbSrc.select('b1'),
    'I': imgProbSrc.select('b1_1'),
  });

  // Classify the likelihood: Low 0 - 0.6, Moderate 0.6 - 0.8, High 0.8 - 1
  var imgProb = imgProbBase.expression(
    'prob = V<0.6?0:(V<0.8?1:(V<=1?2:0*V))', {
    'V': imgProbBase.select('prob_base')
  });

  // Mosaic impact and likelihood image
  var imgReSrc = imgImpact
    .addBands(imgProb);

  // Calculate extreme rainfall-triggering flood (ERTF)
  var imgReBase = imgReSrc.expression(
    'ertf = (x*3) + y + 1', {
    'x': imgReSrc.select('impact'),
    'y': imgReSrc.select('prob'),
  });

  // ERTF matrix 3x4, came from impact and likelihood
  var imgRe = imgReBase.remap([
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
    10, 11, 12,
    13, 14, 15], [
    -1, -1, -1,
    0, 0, 1,
    0, 2, 4,
    3, 5, 7,
    6, 8, 9
  ]
  );

  // Re class matrix into 3 class
  var imgReClass = imgReBase.remap([
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
    10, 11, 12,
    13, 14, 15], [
    -1, -1, -1,
    0, 0, 1,
    0, 1, 2,
    1, 2, 3,
    2, 3, 3
  ]);

  // Final product from single run
  return {
    're': imgRe.updateMask(imgRe.gte(0)),
    'reClass': imgReClass.updateMask(imgReClass.gte(0)),
    'rainfall': imgBase.updateMask(imgBase.gt(0)),
    'impact': imgImpact.updateMask(imgImpact.gt(0)),
    'prob': imgProb.updateMask(imgProb.gt(0))
  };
}



// RENDERING
//---
// Render map based on DateSlider onChange
function render() {
  // Date Slider
  var dt = ee.Date(uiComponents.dateSlider.getValue()[0]);
  // Day of simulation combobox
  var _numday = uiComponents.daySelect.getValue();
  if (!_numday) {
    return;
  }

  // wait counter for affected pops and crops
  uiComponents.loadingCounter = 0;

  // Day of simulation
  var numday = {
    '1 day': 1,
    '2 days': 2,
    '3 days': 3,
    '4 days': 4,
    '5 days': 5
  }[_numday];

  // Disable Render button
  uiComponents.renderButton.setDisabled(true);
  uiComponents.NRTaffectedDate.widgets().reset([
    ui.Label({ // Label for date validity in near real time simulation
      value: 'Potential impact for the last ' + numday + ' day(s), as of ' + dt.format('yyyy-MM-dd').getInfo(),
      style: {color: 'blue'}
    })
  ]);
  // Loading information after executing render button
  uiComponents.NRTaffectedPops.widgets().reset([
    ui.Label({ value: 'Loading...' })
  ]);
  uiComponents.NRTaffectedCrops.widgets().reset([
    ui.Label({ value: 'Loading...' })
  ]);
  uiComponents.FCTaffectedDate.widgets().reset([
    ui.Label({ // Label for date validity in forecasst simulation
      value: 'Potential impact for ' + numday + ' day(s) ahead, issued on ' + dt.format('yyyy-MM-dd').getInfo(),
      style: {color: 'blue'}
    })
  ]);
  // Loading information after executing render button
  uiComponents.FCTaffectedPops.widgets().reset([
    ui.Label({ value: 'Loading...' })
  ]);
  uiComponents.FCTaffectedCrops.widgets().reset([
    ui.Label({ value: 'Loading...' })
  ]);

  // Get all layer result
  // Near Real Time Result
  var imageNRT = getRainfallExtremeImage({
    date: dt,
    numday: numday,
    imgBase: getImergImage(dt, numday),
    rainfallColumn: 'precipitationCal'
  });
  // Forecast Result
  var imageFCT = getRainfallExtremeImage({
    date: dt,
    numday: numday,
    imgBase: getGfsImage(dt, numday),
    rainfallColumn: 'total_precipitation_surface'
  });

  // Load layer result as map
  mainMap.layers().reset();
  mainMap.addLayer(imageFCT.re, visFlood, 'Forecast - Flood Alert', true);
  mainMap.addLayer(imageNRT.re, visFlood, 'Near Real-Time - Flood Alert', true);
  mainMap.addLayer(imageFCT.prob, visLikelihood, 'Forecast - Likelihood of Flooding', false);
  mainMap.addLayer(imageNRT.prob, visLikelihood, 'Near Real-Time - Likelihood of Flooding', false);
  mainMap.addLayer(imageFCT.impact, visExtreme, 'Forecast - Rainfall exceeding Threshold', false);
  mainMap.addLayer(imageNRT.impact, visExtreme, 'Near Real-Time - Rainfall exceeding Threshold', false);
  mainMap.addLayer(imageFCT.rainfall.sldStyle(visRainfallSLD), {}, 'Forecast - Rainfall', false);
  mainMap.addLayer(imageNRT.rainfall.sldStyle(visRainfallSLD), {}, 'Near Real-Time - Rainfall', false);

  // Rendering population information
  renderPopulationInfo(imageNRT.reClass, uiComponents.NRTaffectedPops);
  renderPopulationInfo(imageFCT.reClass, uiComponents.FCTaffectedPops);
  
  // Rendering crop information
  renderCropInfo(imageNRT.reClass, uiComponents.NRTaffectedCrops);
  renderCropInfo(imageFCT.reClass, uiComponents.FCTaffectedCrops);
}



// IMPACT ANALYSIS
//---
// AFFECTED POPULATION
// Show Affected Population on Panel
function renderPopulationInfo(imgReClass, targetUi) {
  // Mosaic population layer and flood alert layer
  var imgCombSrc = ghsl.addBands(imgReClass);
  var stats = {};
  var reClasses = [];
  for (var i = 1; i < 4; i++) {
    reClasses.push(i);
  }
  // Extract each alert then combine with population data
  var counter = 0;
  reClasses.map(function (reClass) {
    var imgComb = imgCombSrc.expression(
      'p * (v == c? 1:0)', {
      'p': imgCombSrc.select('population_count'),
      'v': imgCombSrc.select('remapped'),
      'c': reClass
    });
    // Get number of pop affected value for each class
    var stat = imgComb.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: imgReClass.geometry(),
      scale: 250,
      maxPixels: 1e9
    });
    stat.evaluate(function (s) {
      stats[reClass] = s.population_count;
      counter += 1;
      if (counter === reClasses.length) {
        renderLegend();
      }
    });
  });
  uiComponents.loadingCounter += 1;
  // Rendering legend for impact analysis
  function renderLegend() {
    var widgets = [
      ['FFEDA0', 1], // Yellow
      ['FEB24C', 2], // Orange
      ['F03B20', 3] // Red
    ].map(function (p) {
      var color = p[0];
      var level = p[1];
      // Dynamic text
      var label = 'Alert ' + level + ': ' +
        parseInt(stats[level]).toLocaleString();
      return uiComponents.makeLegendBox(color, label);
    });
    targetUi.widgets().reset(widgets);
    uiComponents.loadingCounter -= 1;
    if (uiComponents.loadingCounter === 0) {
      uiComponents.renderButton.setDisabled(false);
    }
  }
}

// AFFECTED CROPLAND
// Show Affected Crop on Panel
function renderCropInfo(imgReClass, targetUi) {
  // Get cropland class, value 12 and 14. Check https://developers.google.com/earth-engine/datasets/catalog/MODIS_006_MCD12Q1#bands
  var cropmask = mcd12q1.eq(12).or(mcd12q1.eq(14));
  var cropland = mcd12q1.divide(mcd12q1).updateMask(cropmask);

  // Mosaic cropland layer and flood alert layer
  var imgCombSrc = cropland.addBands(imgReClass);
  var stats = {};
  var reClasses = [];
  for (var i = 1; i < 4; i++) {
    reClasses.push(i);
  }
  // Extract each alert then combine with cropland data
  var counter = 0;
  reClasses.map(function (reClass) {
    var imgComb = imgCombSrc.expression(
      'p * (v == c? 1:0)', {
      'p': imgCombSrc.select('LC_Type1'),
      'v': imgCombSrc.select('remapped'),
      'c': reClass
    });
    // Get hectares
    var Cropland_PixelArea = imgComb
      .multiply(ee.Image.pixelArea()).divide(10000).round();
    // Get number of pop affected value for each class
    var stat = Cropland_PixelArea.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: imgReClass.geometry(),
      scale: 500,
      maxPixels: 1e9
    });
    stat.evaluate(function (s) {
      stats[reClass] = s.LC_Type1;
      counter += 1;
      if (counter === reClasses.length) {
        renderLegend();
      }
    });
  });
  uiComponents.loadingCounter += 1;
  function renderLegend() {
    // Rendering legend for impact analysis
    var widgets = [
      ['FFEDA0', 1], // Yellow
      ['FEB24C', 2], // Orange
      ['F03B20', 3] // Red
    ].map(function (p) {
      var color = p[0];
      var level = p[1];
      // Dynamic text
      var label = 'Alert ' + level + ': ' +
        parseInt(stats[level]).toLocaleString();
      return uiComponents.makeLegendBox(color, label);
    });
    targetUi.widgets().reset(widgets);
    uiComponents.loadingCounter -= 1;
    if (uiComponents.loadingCounter === 0) {
      uiComponents.renderButton.setDisabled(false);
    }
  }
}

// USER INTERFACE
//---
// Initialize UI Components
function initializeUIComponents() {
  // Clear all process
  ui.root.clear();
  var mobileStyle = false;

  // ui.Select widget
  uiComponents.daySelect = ui.Select({
    // Number of simulation day
    items: ['1 day', '2 days', '3 days', '4 days', '5 days'],
    placeholder: 'Select number of days'
  });

  // Setting date
  var today = ee.Date(new Date());
  var startDate = ee.Date('2019-07-01'); // First GFS data 1 Jul 2015

  // ui.DateSlider widget
  uiComponents.dateSlider = ui.DateSlider({
    start: startDate,
    end: today.advance(1, 'day'),
    value: today,
    period: 1, // the unit is day
    style: { width: '300px', padding: '10px', position: 'bottom-left' }
  });

  // Add render button to ui
  uiComponents.renderButton = ui.Button({
    label: 'Render',
    onClick: render
  });
  
  // Add download button to ui
  uiComponents.downloadButton = ui.Button({
    label: 'Download Data',
    onClick: downloadMap
  });

  // Warning if the parameters is not completed
  uiComponents.NRTaffectedDate = ui.Panel({
    style: {
      fontWeight: 'bold'
    },
    widgets: [
      ui.Label({
        value: '!!! Select date and number of day then press Render button'
      })
    ]
  });

  uiComponents.NRTaffectedPops = ui.Panel({
    style: {
      fontWeight: 'bold'
    },
    widgets: [
      ui.Label({
        value: '!!! Select date and number of day then press Render button'
      })
    ]
  });

  uiComponents.NRTaffectedCrops = ui.Panel({
    style: {
      fontWeight: 'bold'
    },
    widgets: [
      ui.Label({
        value: '!!! Select date and number of day then press Render button'
      })
    ]
  });

  // Warning if the parameters is not completed
  uiComponents.FCTaffectedDate = ui.Panel({
    style: {
      fontWeight: 'bold'
    },
    widgets: [
      ui.Label({
        value: '!!! Select date and number of day then press Render button'
      })
    ]
  });

  uiComponents.FCTaffectedPops = ui.Panel({
    style: {
      fontWeight: 'bold'
    },
    widgets: [
      ui.Label({
        value: '!!! Select date and number of day then press Render button'
      })
    ]
  });

  uiComponents.FCTaffectedCrops = ui.Panel({
    style: {
      fontWeight: 'bold'
    },
    widgets: [
      ui.Label({
        value: '!!! Select date and number of day then press Render button'
      })
    ]
  });

  // Legend in a Panel
  uiComponents.makeLegendBox = function (color, label) {
    var colorBox = ui.Label({
      style: {
        backgroundColor: '#' + color,
        padding: mobileStyle ? '10px' : '8px',
        margin: '0 0 4px 0',
        border: 'solid 0.5px',
      }
    });
    var description = ui.Label({
      value: label,
      style: { margin: '0 0 4px 6px', fontSize: mobileStyle ? '16px' : '12px' },
    });
    return ui.Panel({
      widgets: [colorBox, description],
      style: { padding: '0 0 4px 6px' },
      layout: ui.Panel.Layout.Flow('horizontal')
    });
  };

  // Paragraph intro in top of Panel
  var intro = ui.Panel({
    widgets: [
      // Title
      ui.Label({
        value: 'Extreme rainfall monitoring, will it trigger a flood?',
        style: {
          fontWeight: 'bold',
          fontSize: mobileStyle ? '22px' : '20px',
          margin: '10px 5px',
        }
      }),

      // Intro
      ui.Label({
        value: 'ERM is an app that are able to inform where is the estimated location of extreme rainfall ' +
          'in the last 5-days (Near Real Time) and up to 5-days ahead (Forecast) based on selected date. ' +
          'To learn more about what inside the application, please visit below link:',
        style: {
          fontSize: mobileStyle ? '18px' : '14px',
        }
      }),
      ui.Label({
        value: 'https://wfpidn.github.io/ERM',
        style: {
          fontSize: mobileStyle ? '18px' : '14px',
        }
      }).setUrl('https://wfpidn.github.io/ERM'),
      ui.Label({
        value: 'The computation is over when you see number of affected population below for both near real-time ' +
          'and forecasat, and the Render button enable. Every computation required at least a minute to complete ' +
          'all the process. PLEASE BE PATIENT! ',
        style: {
          color: 'red',
          fontSize: mobileStyle ? '18px' : '14px',
        }
      }),
      ui.Label({
        value: '_________________________________________________',
        style: {
          fontSize: mobileStyle ? '18px' : '14px',
        }
      })
    ]
  });

  // Affected label - near real-time
  var NRTaffectedPanel = ui.Panel({
    widgets: [
      ui.Label({
        value: 'Near Real-Time',
        style: {
          fontWeight: 'bold',
          fontSize: mobileStyle ? '18px' : '16px',
          // margin: '10px 5px'
        }
      }),
    ]
  });

  // Date information - near real-time
  var NRTaffectedDatePanel = ui.Panel({
    widgets: [
      ui.Label({
        value: '',
        style: {
          color: 'blue',
          fontSize: mobileStyle ? '14px' : '12px',
          // margin: '10px 5px'
        }
      }),
      uiComponents.NRTaffectedDate
    ]
  });

  var NRTaffectedPopPanel = ui.Panel({
    widgets: [
      ui.Label({
        value: 'Population affected',
        style: {
          // fontWeight: 'bold',
          fontSize: mobileStyle ? '16px' : '14px',
          margin: '10px 5px'
        }
      }),
      uiComponents.NRTaffectedPops
    ]
  });

  var NRTaffectedCropPanel = ui.Panel({
    widgets: [
      ui.Label({
        value: 'Cropland affected (Hectares)',
        style: {
          // fontWeight: 'bold',
          fontSize: mobileStyle ? '16px' : '14px',
          margin: '10px 5px'
        }
      }),
      uiComponents.NRTaffectedCrops
    ]
  });


  // Affected label - near real-time
  var FCTaffectedPanel = ui.Panel({
    widgets: [
      ui.Label({
        value: 'Forecast',
        style: {
          fontWeight: 'bold',
          fontSize: mobileStyle ? '18px' : '16px',
          // margin: '10px 5px'
        }
      }),
    ]
  });

  // Date information - forecast
  var FCTaffectedDatePanel = ui.Panel({
    widgets: [
      ui.Label({
        value: '',
        style: {
          color: 'blue',
          fontSize: mobileStyle ? '14px' : '12px',
          // margin: '10px 5px'
        }
      }),
      uiComponents.FCTaffectedDate
    ]
  });

  var FCTaffectedPopPanel = ui.Panel({
    widgets: [
      ui.Label({
        value: 'Population affected',
        style: {
          // fontWeight: 'bold',
          fontSize: mobileStyle ? '16px' : '14px',
          margin: '10px 5px'
        }
      }),
      uiComponents.FCTaffectedPops
    ]
  });

  var FCTaffectedCropPanel = ui.Panel({
    widgets: [
      ui.Label({
        value: 'Crop affected (Hectares)',
        style: {
          // fontWeight: 'bold',
          fontSize: mobileStyle ? '16px' : '14px',
          margin: '10px 5px'
        }
      }),
      uiComponents.FCTaffectedCrops
    ]
  });
  
  // Legend information for all layers
  var legendintro = ui.Panel({
    widgets: [
      // Line divider
      ui.Label({
        value: '_________________________________________________',
        style: {
          fontWeight: 'bold',
          fontSize: mobileStyle ? '18px' : '14px',
          margin: '10px 5px',
        }
      }),

      // Legend label
      ui.Label({
        value: 'Legend ',
        style: {
          fontWeight: 'bold',
          fontSize: mobileStyle ? '22px' : '20px',
          margin: '10px 5px',
        }
      })
    ]
  });
  
  // Make a legend, style, color, boxes in a panel
  function makeLegend(title, boxes) {
    return ui.Panel({
      widgets: [
        ui.Label({
          value: title,
          style: {
            fontSize: mobileStyle ? '18px' : '16px',
            margin: '10px 5px'
          }
        }),
        ui.Panel({
          style: {
            fontSize: '10px',
            margin: '0 0 10px 12px',
            padding: '0'
          },
          widgets: boxes.map(function (b) {
            var color = b[0];
            var label = b[1];
            return uiComponents.makeLegendBox(color, label);
          })
        })
      ]
    });
  }

  // Color codes
  var legendRainfall = makeLegend('Rainfall', [
    ['ffffff', 'No Rain ~ No color'],
    ['cccccc', '1 - 3 milimeters'],
    ['f9f3d5', '4 - 10'],
    ['dce2a8', '11 - 20'],
    ['a8c58d', '21 - 30'],
    ['77a87d', '31 - 40'],
    ['ace8f8', '41 - 60'],
    ['4cafd9', '61 - 80'],
    ['1d5ede', '81 - 100'],
    ['001bc0', '101 - 120'],
    ['9131f1', '121 - 150'],
    ['e983f3', '151 - 200'],
    ['f6c7ec', '> 200']
  ]);

  var legendCategory = makeLegend('Rainfall Category', [
    ['ffffcc', 'Moderate'],
    ['a1dab4', 'Heavy'],
    ['41b6c4', 'Intense'],
    ['225ea8', 'Extreme']
  ]);

  var legendProbability = makeLegend('Likelihood', [
    ['f7fcb9', 'Low'],
    ['addd8e', 'Moderate'],
    ['31a354', 'High']
  ]);

  var legendAlert = makeLegend('Flood Alert', [
    ['97D700', 'Green'],
    ['ffeda0', 'Yellow (Category 1 - 3)'],
    ['FEB24C', 'Orange (Category 4 - 6)'],
    ['F03B20', 'Red (Category 7 - 9)']
  ]);

  var mainPanel = ui.Panel({
    widgets: [
      intro,
      NRTaffectedPanel,
      NRTaffectedDatePanel,
      NRTaffectedPopPanel,
      NRTaffectedCropPanel,
      FCTaffectedPanel,
      FCTaffectedDatePanel,
      FCTaffectedPopPanel,
      FCTaffectedCropPanel,
      legendintro,
      ui.Panel({
        layout: ui.Panel.Layout.flow('horizontal'),
        widgets: [
          ui.Panel({
            widgets: [
              legendRainfall,
            ]
          }),
          ui.Panel({
            widgets: [
              legendCategory,
              legendProbability,
              legendAlert
            ]
          })
        ]
      })
    ],
    style: { width: '350px', padding: '8px' }
  });

  ui.root.widgets().reset([
    mainPanel, mainMap
  ]);
  ui.root.setLayout(ui.Panel.Layout.flow('horizontal'));
  mainMap.setControlVisibility(true);
  mainMap.setCenter(118.2, -2.5, 5.4);
  mainMap.add(ui.Panel({
    widgets: [
      uiComponents.daySelect,
      uiComponents.renderButton,
      uiComponents.downloadButton,
    ],
    layout: ui.Panel.Layout.Flow('horizontal'),
    style: { position: 'bottom-left' }
  }));
  mainMap.add(uiComponents.dateSlider);
}

initializeUIComponents();



// DATA DOWNLOADS
//---
// Download all layer output to Google Drive
function downloadMap() {

  var _numday = uiComponents.daySelect.getValue();
  if (!_numday) {
    return;
  }

  // Day of simulation
  var numday = {
    '1 day': 1,
    '2 days': 2,
    '3 days': 3,
    '4 days': 4,
    '5 days': 5
  }[_numday];

  // As the download request probably takes some time, we need to warn the user,
  // so they not repeating click the download button
  alert("If you see this message, the download request is started! Please go to Tasks, wait until the download list appear. Click RUN for each data you want to download");

  // Downloading data
  // Export the result to Google Drive
  var download_date = ee.Date(uiComponents.dateSlider.getValue()[0]);
  var dt = download_date;

  // Near Real Time Result
  var imageNRT = getRainfallExtremeImage({
    date: dt,
    numday: numday,
    imgBase: getImergImage(dt, numday),
    rainfallColumn: 'precipitationCal'
  });
  // Forecast Result
  var imageFCT = getRainfallExtremeImage({
    date: dt,
    numday: numday,
    imgBase: getGfsImage(dt, numday),
    rainfallColumn: 'total_precipitation_surface'
  });

  // Near Real-Time Precipitation
  Export.image.toDrive({
    image: imageNRT.rainfall,
    description: 'NRT_Precipitation_last_' + numday + 'day_as_of_' + download_date.format('yyyy-MM-dd').getInfo(),
    scale: IMERGprojection.nominalScale(),
    maxPixels: 1e12
  });

  // Forecast Precipitation
  Export.image.toDrive({
    image: imageFCT.rainfall,
    description: 'FCT_Precipitation_' + numday + 'day_ahead_issued_on_' + download_date.format('yyyy-MM-dd').getInfo(),
    scale: IMERGprojection.nominalScale(),
    maxPixels: 1e12
  });

  // Near Real-Time Extreme Precipitation (exceeding the threshold)
  Export.image.toDrive({
    image: imageNRT.impact,
    description: 'NRT_ExtremePrecip_last_' + numday + 'day_as_of_' + download_date.format('yyyy-MM-dd').getInfo(),
    scale: IMERGprojection.nominalScale(),
    maxPixels: 1e12
  });

  // Forecast Extreme Precipitation (exceeding the threshold)
  Export.image.toDrive({
    image: imageFCT.impact,
    description: 'FCT_ExtremePrecip_' + numday + 'day_ahead_issued_on_' + download_date.format('yyyy-MM-dd').getInfo(),
    scale: IMERGprojection.nominalScale(),
    maxPixels: 1e12
  });

  // Near Real-Time Likelihood of Pixel will be Inundated
  Export.image.toDrive({
    image: imageNRT.prob,
    description: 'NRT_Likelihood_last_' + numday + 'day_as_of_' + download_date.format('yyyy-MM-dd').getInfo(),
    scale: IMERGprojection.nominalScale(),
    maxPixels: 1e12
  });

  // Forecast Likelihood of Pixel will be Inundated
  Export.image.toDrive({
    image: imageFCT.prob,
    description: 'FCT_Likelihood_' + numday + 'day_ahead_issued_on_' + download_date.format('yyyy-MM-dd').getInfo(),
    scale: IMERGprojection.nominalScale(),
    maxPixels: 1e12
  });

  // Near Real-Time Extreme Rainfall-triggering Flood
  Export.image.toDrive({
    image: imageNRT.re,
    description: 'NRT_FloodAlert_last_' + numday + 'day_as_of_' + download_date.format('yyyy-MM-dd').getInfo(),
    scale: IMERGprojection.nominalScale(),
    maxPixels: 1e12
  });

  // Forecast Extreme Rainfall-triggering Flood
  Export.image.toDrive({
    image: imageFCT.re,
    description: 'FCT_FloodAlert_' + numday + 'day_ahead_issued_on_' + download_date.format('yyyy-MM-dd').getInfo(),
    scale: IMERGprojection.nominalScale(),
    maxPixels: 1e12
  });

  print('Data Downloaded!', download_date);
}


// END OF SCRIPT