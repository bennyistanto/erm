# Acquire IMERG data

## About the data

WGS84 - [EPSG:4326](http://spatialreference.org/ref/epsg/4326/)

- Bounding box
	`94,-12,142,7`

- GeoJSON
	```
	{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","crs":"EPSG:4326","coordinates":[[[94,-12],[94,7],[142,7],[142,-12],[94,-12]]]}}]}
	```

![BBox](./img/bbox.png)


Historical

| Timestep | Release | Period | Unit | Link |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| Daily | Final Run | 1 Jun 2000 - 30 Jun 2020 | mm/day | [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDF.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDF.06/) |
| Daily | Late Run | 1 Jul 2000 - now | mm/day | [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDL.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDL.06/) |

Near-real time

| Timestep | Release | Period | Unit | Link |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| 30-minutes | Final Run | 1 Jan 2020 - 30 Jun  2020 | mm/hour | [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHH.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHH.06/) |
| 30-minutes | Early Run | 1 Jul 2020 - now | mm/hour | [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHHE.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHHE.06/) |


## Download and subset for Indonesia via OpenDAP

Using `wget`, see [https://disc.gsfc.nasa.gov/data-access#mac_linux_wget](https://disc.gsfc.nasa.gov/data-access#mac_linux_wget)  

```
wget --http-user=[USERNAME] --http-password=[PASSWORD] --load-cookies ~/.urs_cookies --save-cookies ~/.urs_cookies --keep-session-cookies --no-check-certificate --auth-no-challenge=on -r --reject "index.html*" -np -e robots=off <insert complete HTTPS OPENDAP URL>
```

username: `gis.wfp.indonesia`

password: Send email to [benny.istanto@wfp.org](mailto:benny.istanto@wfp.org) to get the password


**OPENDAP URL**: for 1 Jan 2019, check the data catalog from url on the left column.
[https://gpm1.gesdisc.eosdis.nasa.gov/opendap/hyrax/GPM_L3/GPM_3IMERGHH.06/2019/001/3B-HHR.MS.MRG.3IMERG.20190101-S003000-E005959.0030.V06B.HDF5.nc4?precipitationCal[0:0][2740:3219][779:969],time,lon[2740:3219],lat[779:969]](https://gpm1.gesdisc.eosdis.nasa.gov/opendap/hyrax/GPM_L3/GPM_3IMERGHH.06/2019/001/3B-HHR.MS.MRG.3IMERG.20190101-S003000-E005959.0030.V06B.HDF5.nc4?precipitationCal[0:0][2740:3219][779:969],time,lon[2740:3219],lat[779:969])

**GPM_3IMERGHH.06** - Code of product. Notes: NASA frequently update the version of data, current version is 06. If the download failed, change into new version 07 or 08 and so on.

**2019** - year in YYYY

**001** - Date in Julian Date for 30min data

**3B-HHR.MS.MRG.3IMERG.20190101-S003000-E005959.0000.V06B.HDF5.nc4** - filename

- **3B-HHR.MS.MRG.3IMERG** - product code for 30min final run
	
- **3B-HHR-E.MS.MRG.3IMERG** - product code for 30min early run

- **20190101-S003000-E005959.0000** - Date and time information, each file has a unique information, check the pattern in data source.

- Start Date/Time: All files in GPM will be named using the start date/time of the temporal period of the data contained in the product. The field has two subfields separated by a hyphen.
	
- Start Date: **YYYYMMDD** Start Time: Begin with Capital **S** and follow with **HHMMSS** 
	
- End Time: Begin with Capital **E** and follow with **HHMMSS** Hours are presented in a 24-hour time format, with `00` indicating midnight. All times in GPM will be in Coordinated Universal Time (UTC). The half-hour sequence starts at **0000**, and increments by 30 for each half hour of the day.

- **V06B** - version of data. Frequently change

- HDF5 - Original format of the data

- nc4 - Data format after subsetting process using OPENDAP

**precipitationCal** - Selected variable to download

**[0:0][2740:3219][779:969],time,lon[2740:3219],lat[779:969]** - time and bounding-box from original to subset for Indonesia.


## Conversion NC to GeoTIFF, and clip using polygon

All downloaded subset IMERG are in netCDF format. We need to convert it to GeoTIFF, the easiest way is using GDAL: 
```
gdal_translate -of GTiff -a_srs EPSG:4326 NETCDF:"filename.nc4":precipitationCal fileoutput.tif
```

But sometimes GDAL couldn’t handle rotated poled grid from subset netCDF, we could try rioxarray based on solution from [https://gis.stackexchange.com/a/367651](https://gis.stackexchange.com/a/367651) 

Then we need to crop the GeoTIFF using Indonesia boundary. GDAL can handle this task: 
```
gdalwarp --config GDALWARP_IGNORE_BAD_CUTLINE YES -srcnodata -999 -dstnodata NoData -cutline idn_bnd_subset_clip_imerg_grid_a.shp -crop_to_cutline input.tif clip_output.tif
```


## Prepare input data (rainfall accumulation) for model

### Historical

Calculate accumulation of 1 to 5 days rainfall, daily rolling windows for both Final and Late run. 

Example: start from 1 Jun 2000<br>

- 1-day: 1 Jun, 2 Jun, 3, Jun, ...

- 2-days: 1+2 Jun, 2+3 Jun, 3+4 Jun, ...

- 3-days: 1+2+3 Jun, 2+3+4 Jun, 3+4+5 Jun, ...

- 4-days: 1+2+3+4 Jun, 2+3+4+5 Jun, 3+4+5+6 Jun, ...

- 5-days: 1+2+3+4+5 Jun, 2+3+4+5+6 Jun, 3+4+5+6+7 Jun, ...

To make it easier, every 1 - 5 days accumulation data will save as a file with the latest file name: Example, data 2+3+4 Jun 2020, will save as: **precip.imergd.20000604.3days.tif**

### Near-real time

Create rainfall accumulation for every 6-hours from 30-min data

Example: 6-hours rainfall accumulation for every date, for both Final and Early run

| Date YYYYMMDD | Time 0000 |
| ----------- | ----------- |
| 20000601 | 0000 to 0360 |
| 20000601 | 0390 to 0720 |
| 20000601 | 0750 to 1080 |
| 20000601 | 1110 to 1440 |
| 20000602 | 0000 to 0360 |
| 20000602 | 0390 to 0720 |
| 20000602 | 0750 to 1080 |
| 20000602 | 1110 to 1440 |

To make it easier, every 6-hours accumulation data will save as a file with the latest file name: Example, data **20000601** for period **0000** to **0360**, will save as: **precip.imerghh.20000601.0360.6h.tif**

Calculate 1 to 5 days rainfall, 6-hours rolling windows for both Final and Late run.

- 1-day

	`precip.20000601.0360.6h`  to  `precip.20000601.1440.6h`<br>
	`recip.20000601.0720.6h`  to  `precip.20000602.0360.6h`<br>
	`recip.20000601.1080.6h`  to  `precip.20000602.0720.6h`<br>
	`precip.20000601.1440.6h`  to  `precip.20000602.1080.6h`<br>
	`precip.20000602.0360.6h`  to  `precip.20000602.1440.6h`<br>
	…<br>

- 2-days

	`precip.20000601.0360.6h`  to  `precip.20000602.1440.6h`<br>
	`precip.20000601.0720.6h`  to  `precip.20000603.0360.6h`<br>
	`precip.20000601.1080.6h`  to  `precip.20000603.0720.6h`<br>
	`precip.20000601.1440.6h`  to  `precip.20000603.1080.6h`<br>
	`precip.20000602.0360.6h`  to  `precip.20000603.1440.6h`<br>
	…<br>

- 3-days

	`precip.20000601.0360.6h`  to  `precip.20000603.1440.6h`<br>
	`precip.20000601.0720.6h`  to  `precip.20000604.0360.6h`<br>
	`precip.20000601.1080.6h`  to  `precip.20000604.0720.6h`<br>
	`precip.20000601.1440.6h`  to  `precip.20000604.1080.6h`<br>
	`precip.20000602.0360.6h`  to  `precip.20000604.1440.6h`<br>
	…<br>

- 4-days

	`precip.20000601.0360.6h`  to  `precip.20000604.1440.6h`<br>
	`precip.20000601.0720.6h`  to  `precip.20000605.0360.6h`<br>
	`precip.20000601.1080.6h`  to  `precip.20000605.0720.6h`<br>
	`precip.20000601.1440.6h`  to  `precip.20000605.1080.6h`<br>
	`precip.20000602.0360.6h`  to  `precip.20000605.1440.6h`<br>
	…<br>

- 5-days

	`precip.20000601.0360.6h`  to  `precip.20000605.1440.6h`<br>
	`precip.20000601.0720.6h`  to  `precip.20000606.0360.6h`<br>
	`precip.20000601.1080.6h`  to  `precip.20000606.0720.6h`<br>
	`precip.20000601.1440.6h`  to  `precip.20000606.1080.6h`<br>
	`precip.20000602.0360.6h`  to  `precip.20000606.1440.6h`<br>
	…<br>

Following the standard for 6-hour naming convention, we will adjust name according the time information:

- `0360` will assign with ID: `00`
- `0720` will assign with ID: `06`
- `1080` will assign with ID: `12`
- `1440` will assign with ID: `18`

Then rainfall accumulation data (1 to 5 days) will save as a file with latest filename but substitute with ID: **precip.imerghh.YYYYMMDDID.H024.tif**

Where

- `precip`: precipitation
- `YYYY`: year
- `MM`: month
- `DD`: date
- `ID`: time information, see above
- `H`: Historical data
- `024`: 1-day rainfall
	- 2-days will be `048`
	- 3-days will be `072`
	- 4-days will be `096`
	- 5-days will be `120`

Example:<br>
1-day rainfall from `precip.20000601.0360.6h`  to  `precip.20000601.1440.6h` will save as **precip.imerghh.2000060118.H024.tif**

5-days rainfall from `precip.20000601.1080.6h`  to  `precip.20000606.0720.6h` will save as **precip.imerghh.2000060606.H120.tif**


