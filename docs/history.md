# Revision History

| No | Date   | Notes   | 
| :--- | :--- | ---------------- |
| 1 | 22 Nov 2016 | Brainstorming with Prof. Rizaldi[^1] |
| 2 | 21 Dec 2016 | Conceptual method, rainfall threshold value |
| 3 | 3 Mar 2017 | 3-days rainfall accumulation rolling daily using CHIRPS completed, ready for testing |
| 4 | 6 Jun 2017 | Rainfall threshold generated with help from Rogerio[^2] awk script |
| 5 | 8 Oct 2017 | GFS test, manual download using various method, THREDDS, OPENDAP and https |
| 6 | 23 Dec 2017 | Implemented in VAMPIRE as ArcGIS REST Services using GFS data as input, completed by Rochelle[^3] |
| 7 | 8 Jan 2018 | Remove river flow and conditions, add limitation and constraints of the model |
| 8 | 2 Feb 2018 | Belitung case, Land susceptibility extraction |
| 9 | 25 Feb 2018 | Landslide flowchart |
| 10 | 19 Mar 2018 | Test for Ciwidey and Banjarnegara, but the rainfall in both areas below threshold, so it’s better to remove the example |
| 11 | 3 Apr 2018 | First draft, ready for share |
| 12 | 6 Jun 2018 | Found historical flood extraction (HFO) using JRC GSW data via GEE, start processing for Indonesia by Year |
| 13 | 8 Aug 2018 | Mosaic HFO tiles from GEE and zonal statistics using CHIRPS and IMERG grid |
| 14 | 14 Nov 2018 | 1 district 1 equation for model maybe not suitable enough for Indonesia. Proposing to use watershed to Prof. Rizaldi |
| 15 | 21 Feb 2019 | BMKG criticized on CHIRPS performance as main input for flood module. Random check to above mentioned periods with other sat-based data |
| 16 | 13 Mar 2019 | Replicate the method using STATA done by Vira[^4], R approach will follow.
| 17 | 30 Apr 2019 | Finalized flow chart for the flood module, for sharing to PDC, C2S and DLR  |
| 18 | 3 Sep 2019 | Sharing the model update to VAM-HQ |
| 19 | 30 Mar 2020 | Update HFO Water History using latest data, re-processing by Month as more relevant |
| 20 | 1 May 2020 | Watershed for all Indonesia generated using ASTER GDEM 30, tested for max rainfall logit formula. Unfortunately not suitable |
| 21 | 18 Jun 2020 | Got feedback from Rogerio, try to test rolling sum 1 to 5 days |
| 22 | 25 Jun 2020 | Michael[^5] sent event data from AHA Centre ADInet, will test it for measuring alert quality |
| 23 | 30 Jun 2020 | Raster max and percentile using CHIRPS completed for 1 to 5 days period |
| 24 | 11 Sep 2020 | Focal linear regression between max rainfall and HFO, extract historical event from 1981 |
| 25 | 19 Sep 2020 | Found most of big flood event in 2020 not well captured using CHIRPS, lower rainfall value compared with BMKG station |
| 26 | 22 Sep 2020 | Start from all over again using IMERG Final and Late run to get rolling sum 1 to 5 days, max and threshold, focal linear regression and extracting historical event and calculate the likelihood to get final alert |
| 27 | 15 Oct 2020 | Documenting the process of extreme rainfall monitoring |
| 28 | 20 Oct 2020 | Jeffry[^6] completed flood event extraction from AHA Centre ADInet, will combine with data from BNPB and PUPR to validate the alert. Few approach has been tested, but the result still not perfect |
| 29 | 10 Nov 2020 | GEFS forecast data acquisition protocol |
| 30 | 6 Dec 2020 | Test GFS data process in EarthEngine |
| 31 | 23 Dec 2020 | Test IMERG data process in EarthEngine |
| 32 | 10 Feb 2021 | Combine GFS and IMERG into single process in GEE, Ridwan[^7] starting refine the code to be more efficient and tidy |
| 33 | 30 Mar 2021 | Surface runoff accumulation concept note and methodology completed by Diego[^8] |
| 34 | 2 Apr 2021 | Check forecast for East Nusa Tenggara on tropical depression |
| 35 | 6 Apr 2021 | Result looks promising for both near-real time and forecast |
| 36 | 10 May 2021 | Refine GEE code, simplify some inefficient process |
| 37 | 25 Jun 2021 | GEE code review on population, crop and urban area affected |
| 38 | 29 Jun 2021 | Technical documentation available at Github |
| 39 | 19 Jul 2021 | Affected population module, ui Panel and some feature completed by Ridwan. Revising crop module and dynamic text is ongoing |
| 40 | 29 Jul 2021 | Affected cropland module and dynamic text for date simulation completed |



[^1]: Prof. Rizaldi Boer. Scientific Advisor. Center for Climate Risk and Opportunity Management. Bogor Agricultural University.
[^2]: Rogerio Bonifacio. Head of Climate and Earth Observation. VAM HQ. UN World Food Programme
[^3]: Rochelle OHagan. Data Scientist. Vulnerability Analysis and Mapping Unit. UN World Food Programme - Indonesia
[^4]: Pramashavira. VAM Associate. Vulnerability Analysis and Mapping Unit. UN World Food Programme - Indonesia
[^5]: Michael Manalili. GIS Consultant. Geospatial Support Unit. EMEG HQ. UN World Food Programme
[^6]: Jeffry Pupella. VAM Associate. Vulnerability Analysis and Mapping Unit. UN World Food Programme - Indonesia
[^7]: Ridwan Mulyadi. System Developer. Vulnerability Analysis and Mapping Unit. UN World Food Programme - Indonesia
[^8]: Diego Novoa. VAM Intern. Vulnerability Analysis and Mapping Unit. UN World Food Programme - Indonesia