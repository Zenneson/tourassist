function getNewCenter(place) {
  let newCenter = place.center;
  let maxZoom = 5.5;

  switch (place.label) {
    case "United States":
      newCenter = [-98.5795, 43];
      maxZoom = 4;
      break;
    case "Canada":
      newCenter = [-95.8203, 61.0447];
      maxZoom = 3.5;
      break;
    case "Russia":
      newCenter = [94.9619, 65];
      maxZoom = 3.2;
      break;
    case "China":
      newCenter = [103.9924, 35.504];
      maxZoom = 3.5;
      break;
    case "Brazil":
      newCenter = [-53.1562, -10.7836];
      maxZoom = 3.5;
      break;
    case "Australia":
      newCenter = [134.0362, -26.529];
      maxZoom = 3.5;
      break;
    case "India":
      newCenter = [78.6428, 22.5644];
      maxZoom = 4.2;
      break;
    case "Argentina":
      newCenter = [-65.1886, -36.1791];
      maxZoom = 3.5;
      break;
    case "Greenland":
      newCenter = [-41.875, 71.5];
      maxZoom = 3.8;
      break;
    case "Mexico":
      newCenter = [-102.5, 23.5];
      maxZoom = 4.5;
      break;
    case "Indonesia":
      newCenter = [120.5, -2.5];
      maxZoom = 4;
      break;
    case "Sweden":
      newCenter = [18.5, 62.5];
      maxZoom = 4.3;
      break;
    case "Chile":
      newCenter = [-71.5, -40.5];
      maxZoom = 4.2;
      break;
    case "Ecuador":
      newCenter = [-78.5, -2.5];
      maxZoom = 5.5;
      break;
    case "Svalbard and Jan Mayen":
      newCenter = [20, 78];
      maxZoom = 4.5;
      break;
    case "Japan":
      newCenter = [138, 37];
      maxZoom = 4.2;
      break;
    case "Spain":
      newCenter = [-3.5, 40];
      maxZoom = 4.5;
      break;
    case "Portugal":
      newCenter = [-8, 39];
      maxZoom = 5.3;
      break;
    case "France":
      newCenter = [2, 46];
      maxZoom = 4.5;
      break;
    case "Italy":
      newCenter = [12, 42];
      maxZoom = 4.5;
      break;
    case "Algeria":
      newCenter = [3, 28];
      maxZoom = 4.5;
      break;
    case "Bahamas":
      newCenter = [-77, 24];
      maxZoom = 6;
      break;
    case "Democratic Republic of the Congo":
      newCenter = [25, -3];
      maxZoom = 4;
      break;
    case "Iceland":
      newCenter = [-19, 65];
      maxZoom = 4.5;
      break;
    case "Norway":
      newCenter = [10, 65];
      maxZoom = 4.5;
      break;
    case "Faroe Islands":
      newCenter = [-7, 62];
      maxZoom = 5.5;
      break;
    case "Cuba":
      newCenter = [-80, 21];
      maxZoom = 5.5;
      break;
    case "Jamaica":
      newCenter = [-77.5, 18];
      maxZoom = 7;
      break;
    case "Grenada":
      newCenter = [-61.7, 12];
      maxZoom = 9;
      break;
    case "Barbados":
      newCenter = [-59.5, 13];
      maxZoom = 9;
      break;
    case "Saint Vincent and the Grenadines":
      newCenter = [-61.2, 13];
      maxZoom = 9;
      break;
    case "Martinique":
      newCenter = [-61, 14.5];
      maxZoom = 9;
      break;
    case "Saint Lucia":
      newCenter = [-61, 13.7];
      maxZoom = 9;
      break;
    case "Dominica":
      newCenter = [-61.4, 15.4];
      maxZoom = 9;
      break;
    case "Antigua and Barbuda":
      newCenter = [-61.7, 17];
      maxZoom = 9;
      break;
    case "Guadeloupe":
      newCenter = [-61.5, 16];
      maxZoom = 9;
      break;
    case "Montserrat":
      newCenter = [-62.2, 16.5];
      maxZoom = 9;
      break;
    case "Antigua and Barbuda":
      newCenter = [-61.1, 17];
      maxZoom = 9;
      break;
    case "Saint Kitts and Nevis":
      newCenter = [-62.7, 17];
      maxZoom = 9;
      break;
    case "U.S. Virgin Islands":
      newCenter = [-64.75, 17.85];
      maxZoom = 9;
      break;
    case "British Virgin Islands":
      newCenter = [-64.45, 18.4];
      maxZoom = 9;
      break;
    case "Trinidad and Tobago":
      newCenter = [-61.1, 11];
      maxZoom = 9;
      break;
    case "Turks and Caicos Islands":
      newCenter = [-72, 21];
      maxZoom = 8.2;
      break;
    case "Saint Martin":
      newCenter = [-63, 18];
      maxZoom = 9;
      break;
    case "Anguilla":
      newCenter = [-63.1, 18];
      maxZoom = 9;
      break;
    case "Puerto Rico":
      newCenter = [-66.5, 18.25];
      maxZoom = 8.5;
      break;
    default:
      break;
  }
  return { newCenter, maxZoom };
}
export { getNewCenter };
