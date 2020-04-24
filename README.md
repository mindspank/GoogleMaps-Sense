# This project is deprecated
Google has started to enfore API keys which makes internal solutions un-usable.
If you have a Premier license with Google feel free to use this project as a base.

# GoogleMaps-Sense  
Plot geo data using Google Maps in Qlik Sense  

## Getting Started  
Load some geo data using Qlik Sense, make sure to use the GeoMakePoint() function in the load script when loading your data.  
  
## Settings  
  
### Data  
**Dimension:** Your dimension that contains a coordinate pair.  
**First measure:** Allows you to specify a cusom calculation for the cluster values.  
**Second measure:** Popup contents, supports HTML markup. Note: Needs a first measure, use a dummy =1 if you don't need a custom calculation.  
  
  
### General Map Settings  
**How do you want to plot your data?:** Switch between Cluster and Marker mode.  
**Base map style:** Switch style of the base map.  
**Max Zoom Level (0-18):** Define how far you want to allow the Google Map to be able to zoom. Useful to control how far in the map should zoom on selectionss.  
  
### Cluster Settings  
**Use one cluster style:** Use a single cluster icon, the yellow circle.  
**Stop clustering at Zoom Level (0-18):** Don't cluster markers below this zoom level.
