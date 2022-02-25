# Frequently Asked Questions

**What is ERM?**
: ERM is an experimental tool developed by the United Nations [World Food Programme](https://www.wfp.org/countries/indonesia) in Indonesia written in [Google Earth Engine](https://earthengine.google.com) (GEE) platform to monitor extreme rainfall that could trigger a flood, and the impact to population and cropland.
: ERM module is part of [VAMPIRE](http://prism-dev.wfp.or.id:3001) (now called PRISM) hazard features, a platform developed by WFP to support adaptive social protection in Indonesia.

**What is the main input for ERM?**
: GPM IMERG for near real-time rainfall monitoring and NOAA GFS for rainfall forecast.
: JRC Global Surface Water to develop historical flood occurrence data by months.
: JRC Global Human Settlement Layer for calculating population affected.
: MODIS Annual Land Cover for calculating cropland affected.

**What makes ERM unique compared to the competitors?**
: ERM has a simple output (yes or no / flood or no flood).
: Analysis of critical rainfall (threshold) is conducted by pixels by months, in area with spatial resolution 0.1deg x 0.1deg ~ 10km x 10km.

**What can ERM do?**
: ERM are able to inform where is the estimated location of extreme rainfall and its impact to population and cropland in the last 5-days and forecast up to 5-days ahead based on selected date.
: Rainfall with extreme categories are well detected through ERM.

**What is ERM limitation:**
: ERM is an experimental application, sometimes the results are accurate (flood detected) and sometimes inaccurate (flood undetected). Sorry about that!
: Many factors cause the results to be inaccurate, one of them is the rainfall forecast data quality. Other factor is below.

**What ERM can not do?**
: ERM only able monitor or predict flood caused by extreme rainfall in a location where extreme rainfall occurred. And unable to calculate flood caused by runoff accumulation from other areas.

**What is difference between near real-time (NRT) and forecast (FCT)**
: NRT inform about the latest condition, 1 to 5 days in the past as of selected date. While the FCT inform the situation that will happen in the 1 - 5 days ahead as of selected date.

**How to read ERM output?**
: Every computation/single process on ERM will produce 4 outputs: (1) rainfall accumulation, (2) rainfall exceeding the threshold, (3) Likelihood of flooding and (4) flood alert. All are available for both near real-time and forecast.
: Rainfall accumulation is the total rainfall for day(s) of simulation selected as of the selected date. The classification value is following the legend on sidebar.
: Rainfall exceeding the threshold categorized into 4 class: (1) ![#ffffcc](https://via.placeholder.com/15/ffffcc/000000?text=+) Moderate, exceeding percentile 50. (2) ![#a1dab4](https://via.placeholder.com/15/a1dab4/000000?text=+) Heavy, exceeding percentile 80. (3) ![#41b6c4](https://via.placeholder.com/15/41b6c4/000000?text=+) Intense, exceeding percentile 90. (4) ![#225ea8](https://via.placeholder.com/15/225ea8/000000?text=+) Extreme, exceeding percentile 96. See [The Threshold](../eit/#the-threshold)
: Likelihood of flooding is based in Historical Flood Occurrence data, generated using JRC Global Surface Water and combine with maximum rainfall by months. See [Focal Linear Regression](../rof/#focal-linear-regression). Categorized into 3 class: (1) ![#f7fcb9](https://via.placeholder.com/15/f7fcb9/000000?text=+) Low, has probability of flooding less than 60%. (2) ![#addd8e](https://via.placeholder.com/15/addd8e/000000?text=+) Moderate, has probability of flooding between 60-80%. (3) ![#31a354](https://via.placeholder.com/15/31a354/000000?text=+) High, has probability of flooding greater than 80% or we can say this area are frequently flooded.
: Flood alert visualized into 4 categories: Green, Yellow, Orange and Red. See below explanation.

**What do the colors on flood alert represent?**
: ![#97D700](https://via.placeholder.com/15/97D700/000000?text=+) Green, is a condition when one of the following conditions is met: 

	- Rainfall exceeding percentile 50 (Moderate rainfall) and the likelihood is less than 60% (Low).<br>
	- Rainfall exceeding percentile 50 (Moderate rainfall) and the likelihood is 60-80% (Moderate).<br>
	- Rainfall exceeding percentile 80 (Heavy rainfall) and the likelihood is less than 60% (Low).<br>

: ![#FFEDA0](https://via.placeholder.com/15/FFEDA0/000000?text=+) Yellow, is categorized into 3 class (**Alert class 1**, **2** and **3**) and a condition when one of the following conditions is met: 

	- (**Alert 1**) Rainfall exceeding percentile 50 (Moderate rainfall) and the likelihood is greater than 80% (High).<br>
	- (**Alert 2**) Rainfall exceeding percentile 80 (Heavy rainfall) and the likelihood is 60-80% (Moderate).<br>
	- (**Alert 3**) Rainfall exceeding percentile 90 (Intense rainfall) and the likelihood is less than 60% (Low).<br>

: ![#FEB24C](https://via.placeholder.com/15/FEB24C/000000?text=+) Orange, is categorized into 3 class (**Alert class 4**, **5** and **6**) and a condition when one of the following conditions is met: 

	- (**Alert 4**) Rainfall exceeding percentile 80 (Heavy rainfall) and the likelihood is greater than 80% (High).<br> 
	- (**Alert 5**) Rainfall exceeding percentile 90 (Intense rainfall) and the likelihood is 60-80% (Moderate).<br> 
	- (**Alert 6**) Rainfall exceeding percentile 96 (Extreme rainfall) and the likelihood is less than 60% (Low).<br>

: ![#F03B20](https://via.placeholder.com/15/F03B20/000000?text=+) Red, is categorized into 3 class (**Alert class 7**, **8** and **9**) and a condition when one of the following conditions is met:

	- (**Alert 7**) Rainfall exceeding percentile 90 (Intense rainfall) and the likelihood is greater than 80% (High).<br> 
	- (**Alert 8**) Rainfall exceeding percentile 96 (Extreme rainfall) and the likelihood is 60-80% (Moderate).<br> 
	- (**Alert 9**) Rainfall exceeding percentile 96 (Extreme rainfall) and the likelihood is greater than 80% (High).<br>

: If an areas experience a Green alert, we assume won't have any significant impact.
: ERM use Alert 1 to 9, and included in the impact calculation.
: See [Matrix for final alert](../rof/#matrix-for-final-alert)

**How to read impact calculation?**
: Both impact analysis using population and cropland are categorized into 3 class: 

	- ![#FFEDA0](https://via.placeholder.com/15/FFEDA0/000000?text=+) Yellow (Low), 
	- ![#FEB24C](https://via.placeholder.com/15/FEB24C/000000?text=+) Orange (Moderate) and 
	- ![#F03B20](https://via.placeholder.com/15/F03B20/000000?text=+) Red (High impact). 

	These 3 class are consistence with flood alert class.

**Is ERM mobile friendly?**
: No, ERM not optimized for mobile devices. Please use your computer or laptop to access it.

**What is ERM future plan?**
: See development plan in the left sidebar.