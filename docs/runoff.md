# Surface Runoff Accumulation

**This research and development is still ongoing!**

Development of the concept analysis is done by Diego NOVOA, a WFP Intern for the period Oct 2020 - Mar 2021.

## Introduction

The method described here is to simulate runoff generation and overland flow from hydrometeorological events. For this, a combination of the Curve Number method developed by the Soil Conservation Service (SCS) to estimate the portion of rainfall that becomes runoff (USDA, 1986) and a GIS-based approach for overland flow proposed by (Ozcelik & Gorokhovich, 2020). A variety of satellite-based products is used as inputs for the method. 

The Curve Number method provides a widely used simplified procedure to estimate runoff volume. It can be used to calculate peak discharge, hydrographs, and storage volume in reservoirs. The model's simplicity has proven useful, especially for ungauged areas, because its inputs are usually available (Yang Hong et al., 2007), making it the most popular method for estimating surface runoff (Y. Hong & Adler, 2008). An initial attempt at getting global CN numbers from satellite observations and its runoff by Y. Hong & Adler (2008) is used as the base to develop the method for Indonesia. 

Moreover, there are various available flood models, both commercial and public, with different applications and accuracy depending on the model types and input data. Many are usually based on the hydrology of rivers (Ozcelik & Gorokhovich, 2020). However, simplified alternatives are also usually proposed when not many data is available, computer resources are limited, or when the scale is too large (Bulti & Abebe, 2020), as is Indonesia's case. The model proposed by Ozcelik, is a raster-based discretized and distributed approach for overland flow that can be used in areas where flood boundaries and boundaries conditions cannot be clearly defined, like coastal areas. 

Empirical and conceptual approaches have the advantage of not needing too many input data, which is ideal for ungauged areas. Such methods lack some spatiotemporal resolution compared to more physically-based approaches, particularly when they are lumped. However, they are more economical in computer resources and input data needed, giving real-time modelling and forecasting possibilities. The model described in this document was developed using R, and is attached. 

