# Acquire GEFS data

## About the data

WGS84 - [EPSG:4326](http://spatialreference.org/ref/epsg/4326/)

- Bounding box
	`94,-12,142,7`

- GeoJSON
	```
	{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","crs":"EPSG:4326","coordinates":[[[94,-12],[94,7],[142,7],[142,-12],[94,-12]]]}}]}
	```

![BBox](./img/bbox.png)

**GEFS Forecast**

GEFS forecast data only available for the latest 3-days and updated every 6-hours period. Accessible via this GRIB filter: [https://nomads.ncep.noaa.gov/cgi-bin/filter_gefs_atmos_0p25s.pl?](https://nomads.ncep.noaa.gov/cgi-bin/filter_gefs_atmos_0p25s.pl?)  

If today is 4 Nov 2020, then GEFS only available from 1 - 4 Nov 2020.


## Download and subset for Indonesia via GRIB filter

### Example parameters

Forecast available every 6-hours, we will focus from f006 (start of data) until f120 (day-5)

- Release hour (`{==00==}`, `06`, `12`, `18`): `geavg.t{==00==}z`
- Forecast hour (`{==f006==}`, `f012`, `f018`, `f024`, `f030`, `f036`, `f042`, `f048`, `f054`, `f060`, `f066`, `f072`, `f078`, `f084`, `f090`, `f096`, `f102`, `f108`, `f114`, `f120`): `{==f006==}`
- Level: `surface`
- Variable: `APCP`
- Subset: Indonesia (`94`,`142`,`7`,`-12`)
- Date (YYYYMMDD): `20201103`
- Release hour (`{==00==}`, `06`, `12`, `18`): `{==00==}`

Script: 
```
https://nomads.ncep.noaa.gov/cgi-bin/filter_gefs_atmos_0p25s.pl?file=geavg.t00z.pgrb2s.0p25.f006&lev_surface=on&var_APCP=on&subregion=&leftlon=94&rightlon=142&toplat=7&bottomlat=-12&dir=%2Fgefs.20201103%2F00%2Fatmos%2Fpgrb2sp25
```

### Download process

Each time we run the download process procedure (Example: Date {==3 Nov 2020==}, release hour `{==00==}`), it means we need to download all the forecast hour from `f006` to `f120`

```
https://nomads.ncep.noaa.gov/cgi-bin/filter_gefs_atmos_0p25s.pl?file=geavg.t{==00==}z.pgrb2s.0p25.{==f006==}&lev_surface=on&var_APCP=on&subregion=&leftlon=94&rightlon=142&toplat=7&bottomlat=-12&dir=%2Fgefs.20201103%2F{==00==}%2Fatmos%2Fpgrb2sp25
```

```
https://nomads.ncep.noaa.gov/cgi-bin/filter_gefs_atmos_0p25s.pl?file=geavg.t{==00==}z.pgrb2s.0p25.{==f012==}&lev_surface=on&var_APCP=on&subregion=&leftlon=94&rightlon=142&toplat=7&bottomlat=-12&dir=%2Fgefs.20201103%2F{==00==}%2Fatmos%2Fpgrb2sp25
```

```
https://nomads.ncep.noaa.gov/cgi-bin/filter_gefs_atmos_0p25s.pl?file=geavg.t{==00==}z.pgrb2s.0p25.{==f018==}&lev_surface=on&var_APCP=on&subregion=&leftlon=94&rightlon=142&toplat=7&bottomlat=-12&dir=%2Fgefs.20201103%2F{==00==}%2Fatmos%2Fpgrb2sp25
```

```
...
```

```
...
```

```
https://nomads.ncep.noaa.gov/cgi-bin/filter_gefs_atmos_0p25s.pl?file=geavg.t{==00==}z.pgrb2s.0p25.f{==114==}&lev_surface=on&var_APCP=on&subregion=&leftlon=94&rightlon=142&toplat=7&bottomlat=-12&dir=%2Fgefs.20201103%2F{==00==}%2Fatmos%2Fpgrb2sp25
```

```
https://nomads.ncep.noaa.gov/cgi-bin/filter_gefs_atmos_0p25s.pl?file=geavg.t{==00==}z.pgrb2s.0p25.f{==120==}&lev_surface=on&var_APCP=on&subregion=&leftlon=94&rightlon=142&toplat=7&bottomlat=-12&dir=%2Fgefs.20201103%2F{==00==}%2Fatmos%2Fpgrb2sp25
```

When new forecast released (for example release hour: `06`, `12` and `18`), we need to repeat all download procedure above and adjust the script with current release hour.

### Naming convention for GEFS product

All downloaded GEFS files must be renamed using following standard.

`apcp.gefs.0p25.YYYYMMDDID.fxxx.grib2`

where

- apcp: GEFS apcp.gefs.0p25 precipitation code
- gefs: name of product
- 0p25: code for 0.25deg product
- YYYY: year
- MM: month
- DD: date
- ID: release hour
- f: forecast data
- xxx: forecast hour

Example

`apcp.gefs.0p25.2020102100.f024.grib2`


## Prepare input data (rainfall forecast) for model

### Conversion from GRIB2 to GeoTIFF

All downloaded subset GEFS are in GRIB2 format. We need to convert it to GeoTIFF, the easiest way is using GDAL: 
```
gdal_translate -of GTiff input.grib2 output.tif
```

### Resample

GEFS data available at 0.25deg ~ 27.75km/pixel spatial resolution

While GPM IMERG available at 0.1deg ~ 11.1km/pixel. So we need to resample (250%) GEFS to match with IMERG using GDAL.
```
gdal_translate -r bilinear -outsize 250% 250% input.tif output_resample.tif
```

### Clip the raster with Indonesia boundary

Then we need to crop the GeoTIFF using Indonesia boundary. GDAL can handle this task:
```
gdalwarp --config GDALWARP_IGNORE_BAD_CUTLINE YES -srcnodata -999 -dstnodata NoData -cutline idn_bnd_subset_clip_imerg_grid_a.shp -crop_to_cutline input.tif clip_output.tif
```

### Calculate accumulation 1 to 5 days rainfall forecast.

Example: pre-downloaded and renamed GEFS data: [https://on.istan.to/32v1tVY](https://on.istan.to/32v1tVY) 

Date: **3 Nov 2020**, release hour **{==00==}**

- 1-day

	`apcp.gefs.0p25.20201103{==00==}.f006` + `f012` + `f018` + `f024`

- 2-days

	`apcp.gefs.0p25.20201103{==00==}.f006` + `f012` + `f018` + `f024` + `f030` + `f036` + `f042` + `f048`

- 3-days

	`apcp.gefs.0p25.20201103{==00==}.f006`  + `f012` + `f018` + `f024` + `f030` + `f036` + `f042` + `f048` + `f054` + `f060` + `f066` + `f072`

- 4-days

	`apcp.gefs.0p25.20201103{==00==}.f006`  + `f012` + `f018` + `f024` + `f030` + `f036` + `f042` + `f048` + `f054` + `f060` + `f066` + `f072` + `f078` + `f084` + `f090` + `f096`

- 5-days

	`apcp.gefs.0p25.20201103{==00==}.f006`  + `f012` + `f018` + `f024` + `f030` + `f036` + `f042` + `f048` + `f054` + `f060` + `f066` + `f072` + `f078` + `f084` + `f090` + `f096` + `f102` + `f108` + `f114` + `f120`


