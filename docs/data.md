# Data

## Best options data for extreme rainfall monitoring

Currently there are 2 data that are suitable for rainfall monitoring and forecasting.

### Rainfall monitoring (near real-time)

**NASA GPM** (Global Precipitation Measurement - [http://pmm.nasa.gov/GPM/](http://pmm.nasa.gov/GPM/)) IMERG (Integrated Multi-satellite Retrievals for GPM) products.

**IMERG Version 06 Data**

1. IMERG is a single integrated code system for near-real and post-real time.
2. IMERG is adjusted to Gprecip monthly climatology zonally to achieve a bias profile that is considered reasonable.
3. Multiple runs for different user requirements for latency and accuracy

	1. “Early” – 4 hour (example application: flash flooding)
	2. “Late” – 14 hour. (crop forecasting)
	3. “Final” – 3 months (research)

4. TEMPORAL COVERAGE: from 1 Jun 2000 to nowadays
5. TEMPORAL RESOLUTION: 30 minutes, daily and monthly (final only)
6. SPATIAL COVERAGE: 60° N – 60° S
7. SPATIAL RESOLUTION: 0,1° x 0,1°
8. VARIABLE: precipitationCal
9. FORMAT: netCDF (nc4), Reference: [https://www.unidata.ucar.edu/software/netcdf/](https://www.unidata.ucar.edu/software/netcdf/) 
10. NAMING CONVENTION:

	1. Half-hourly - GPM_3IMERGHH 06
	2. Daily - GPM_3IMERGD 06
	3. Monthly - GPM_3IMERGM 06

	Latency:

	1. E - Early run
	2. L - Late run
	3. F - Final run (only for daily data) 

	Example: Half-hourly Early Run ~ GPM_3IMERGHHE 06

11. DOWNLOAD:

	1. 30-min Final Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHH.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHH.06/) 
	2. 30-min Early Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHHE.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHHE.06/)
	3. 30-min Late Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHHL.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHHL.06/) 
	4. Daily Final Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDF.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDF.06/) 
	5. Daily Early Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDE.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDE.06/) 
	6. Daily Late Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDL.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDL.06/) 

12. HOW-TO-DOWNLOAD AND AUTHORIZATION

	1. Link [https://disc.gsfc.nasa.gov/data-access](https://disc.gsfc.nasa.gov/data-access) 


### Rainfall forecasting

**NOAA - NCEP GEFS** (Global Ensemble Forecast System - [https://www.ncdc.noaa.gov/data-access/model-data/model-datasets/global-ensemble-forecast-system-gefs](https://www.ncdc.noaa.gov/data-access/model-data/model-datasets/global-ensemble-forecast-system-gefs)) deterministic weather prediction model.

**GEFS Ensemble 0.25 deg**

1. The Global Ensemble Forecast System (GEFS) is a weather forecast model produced by the National Centers for Environmental Prediction (NCEP). 
2. The GEFS dataset consists of selected model outputs as gridded forecast variables. The 384-hour forecasts, with 3-hour forecast interval, are made at 6-hour temporal resolution (i.e. updated four times daily).
3. TEMPORAL COVERAGE: from 15 Jan 2015 to nowadays (new version of GFS)
4. TEMPORAL RESOLUTION: 3h, 6h, 12h, 18h, 24h upto 16 days
5. SPATIAL COVERAGE: 90° N – 90° S
6. SPATIAL RESOLUTION: 0,25° x 0,25°
7. VARIABLE: Total Precipitation (APCP), Reference: [https://www.nco.ncep.noaa.gov/pmb/products/gens/gespr.t00z.pgrb2s.0p25.f003.shtml](https://www.nco.ncep.noaa.gov/pmb/products/gens/gespr.t00z.pgrb2s.0p25.f003.shtml)
8. FORMAT: GRIB2 (grib2), Reference: [https://wmoomm.sharepoint.com/:b:/s/wmocpdb/EUmnLNAM9WdMr1S7GRMl_G8BFqp-B1Qie-k-vMwmrG22GQ?e=cEd2Vk](https://wmoomm.sharepoint.com/:b:/s/wmocpdb/EUmnLNAM9WdMr1S7GRMl_G8BFqp-B1Qie-k-vMwmrG22GQ?e=cEd2Vk) 
9. DATA ACCESS

	1. AWS: `aws s3 ls s3://noaa-gefs-pds/ --no-sign-request`
	2. Reference: [https://registry.opendata.aws/noaa-gefs/](https://registry.opendata.aws/noaa-gefs/) 
	3. GRIB Filter: [https://nomads.ncep.noaa.gov/cgi-bin/filter_gefs_atmos_0p25s.pl?](https://nomads.ncep.noaa.gov/cgi-bin/filter_gefs_atmos_0p25s.pl?)


## Water History

### Global Surface Water - JRC

This dataset contains maps of the location and temporal distribution of surface water from 1984 to 2020 and provides statistics on the extent and change of those water surfaces. For more information see the associated journal article: High-resolution mapping of global surface water and its long-term changes (Nature, 2016) and the online Data Users Guide.

These data were generated using 4,453,989 scenes from Landsat 5, 7, and 8 acquired between 16 March 1984 and 31 December 2020. Each pixel was individually classified into water / non-water using an expert system and the results were collated into a monthly history for the entire time period and two epochs (1984-1999, 2000-2020) for change detection.

This Monthly History collection holds the entire history of water detection on a month-by-month basis. The collection contains 442 images, one for each month between March 1984 and December 2020.

This data used to define [historical flood occurrence](../rof/#historical-flood-occurrence)

Reference: [https://developers.google.com/earth-engine/datasets/catalog/JRC_GSW1_3_MonthlyHistory](https://developers.google.com/earth-engine/datasets/catalog/JRC_GSW1_3_MonthlyHistory)

## Population, a proxy for impact analysis

Global mapping of population is rapidly growing in recent years. They are available at detailed spatial scales. The analysis is based on satellite or other geospatial data layers. Population data are necessary for the analysis of impacts of population growth, monitor population changes, and intervention planning.

### Global Human Settlement Layer - JRC

The Global Human Settlement (GHS) - [http://ghsl.jrc.ec.europa.eu](http://ghsl.jrc.ec.europa.eu) - framework produces global spatial information about the human presence on the planet over time. This in the form of built up maps, population density maps and settlement maps. This information is generated with evidence-based analytics and knowledge using new spatial data mining technologies. The framework uses heterogeneous data including global archives of fine-scale satellite imagery, census data, and volunteered geographic information. The data is processed fully automatically and generates analytics and knowledge reporting objectively and systematically about the presence of population and built-up infrastructures.

The main datasets are offered for download as open and free data. The GHS P2016 suite consists of multitemporal products, that offers an insight into the human presence in the past: 1975, 1990, 2000, and 2014. There are three main type of products: built-up (GHS-BUILT), population (GHS-POP), city model (GHS-SMOD). The grid data are distributed as raster files in TIF format. The ZIP files contain raster files together with pyramids (i.e., TIF and OVR files). 

**About the data**

| Characteristic  | Description  |
|---|---|
| Function  | a proxy for impact analysis  |
| Variable  | Total population  |
| Geographic coverage  | Global  |
| Spatial resolution  | 250 meter/pixel  |
| Temporal resolution  | 1975, 1990, 2000, 2014, 2016  |
| Format  | GeoTIFF  |
| Unit  | Population counts at 250m resolution  |
| Source  | [https://ghsl.jrc.ec.europa.eu/download.php](https://ghsl.jrc.ec.europa.eu/download.php)  |
| Reference  | [https://ghsl.jrc.ec.europa.eu](https://ghsl.jrc.ec.europa.eu)  |

## Cropland, a proxy for impact analysis

Land cover maps represent spatial information on different types (classes) of physical coverage of the Earth's surface, e.g. forests, grasslands, croplands, lakes, wetlands. Dynamic land cover maps include transitions of land cover classes over time and hence captures land cover changes. Land use maps contain spatial information on the arrangements, activities and inputs people undertake in a certain land cover type to produce, change or maintain it.

### MODIS Cropland

The MCD12Q1 V6 product provides global land cover types at yearly intervals (2001-2016) derived from six different classification schemes. It is derived using supervised classifications of MODIS Terra and Aqua reflectance data. The supervised classifications then undergo additional post-processing that incorporate prior knowledge and ancillary information to further refine specific classes.

The MODIS Land Cover Type product is a global land cover classification data layer produced annually from 2001 through 2019 (as of this writing). For each year there are five land cover schemes, developed by different research groups.  Data are distributed by the USGS at 500m resolution in standard MODIS grid tiles. These tiles use the sinusoidal projection and  cover approximately 1200 x 1200 km (10° x 10° at the equator). The following USGS site has detailed meta data and download access: [https://lpdaac.usgs.gov/dataset_discovery/modis/modis_products_table/mcd12q1](https://lpdaac.usgs.gov/dataset_discovery/modis/modis_products_table/mcd12q1)

It is derived using supervised classifications of MODIS Terra and Aqua reflectance data. The supervised classifications then undergo additional post-processing that incorporate prior knowledge and ancillary information to further refine specific classes.

The MODIS Terra + Aqua Land Cover Type Yearly L3 Global 500 m SIN Grid product incorporates the following five different land cover classification schemes, each derived through a supervised decision-tree classification method:
    Land Cover Type 1: IGBP global vegetation classification scheme
    Land Cover Type 2: University of Maryland (UMD) scheme
    Land Cover Type 3: MODIS-derived LAI/fPAR scheme
    Land Cover Type 4: MODIS-derived Net Primary Production (NPP) scheme
    Land Cover Type 5: Plant Functional Type (PFT) scheme

**About the data**

| Characteristic  | Description  |
|---|---|
| Function  | a proxy for impact analysis  |
| Variable  | Land cover  |
| Geographic coverage  | Global  |
| Spatial resolution  | 500 meter/pixel  |
| Temporal resolution  | Annual, 2001 - 2019  |
| Format  | GeoTIFF  |
| Unit  | Land cover at 500m resolution  |
| Source  | [https://e4ftl01.cr.usgs.gov/MOTA/MCD12Q1.006/](https://e4ftl01.cr.usgs.gov/MOTA/MCD12Q1.006/)  |
| Reference  | [https://lpdaac.usgs.gov/products/mcd12q1v006/](https://lpdaac.usgs.gov/products/mcd12q1v006/)  |