/*
 * Copyright (C) 2017-2020 HERE Europe B.V.
 * Licensed under Apache 2.0, see full license in LICENSE
 * SPDX-License-Identifier: Apache-2.0
 */

//cd harp.gl-example && npm start and connect to http://localhost:8080

import { GeoCoordinates } from "@here/harp-geoutils";
import { View } from "./View";

import { IFCLoader } from 'three/examples/jsm/loaders/IFCLoader';
import { MultiStageTimer } from "@here/harp-mapview";

const app = new View({
    canvas: document.getElementById("map")
});

const mapView = app.mapView;

// make map full-screen
mapView.resize(window.innerWidth, window.innerHeight);

// react on resize events from the browser.
window.addEventListener("resize", () => {
    mapView.resize(window.innerWidth, window.innerHeight);
});

// center the camera to Manchester
mapView.lookAt({ target: new GeoCoordinates(53.545, -2.128), zoomLevel: 17, tilt: 40 });


// make sure the map is rendered
mapView.update();

// Setup of IFC loader and import custom model with click event
const ifcLoader = new IFCLoader();

window.addEventListener("dblclick", (evt) => {
  ifcLoader.load("Duplex_A_20110907.ifc", (ifcmodel) => {

    ifcmodel.traverse((child) => (child.renderOrder = 10000));
    ifcmodel.renderOrder = 10000;
    ifcmodel.rotateX(Math.PI / 2);
    ifcmodel.rotateY(Math.PI / 1.7);

    //Assign the coordinates to the IFC
    const geoPosition = mapView.getGeoCoordinatesAt(evt.pageX, evt.pageY);
    ifcmodel.anchor = geoPosition;
    mapView.mapAnchors.add(ifcmodel);
  });
});

//--------------------- Domestic Energy Performance Certificates API ----------------------
var myHeaders = new Headers();
myHeaders.append("Authorization", "Your-Token");
myHeaders.append('Accept', 'application/json');

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

// get data filtered by local authority
fetch("https://epc.opendatacommunities.org/api/v1/domestic/search?local-authority=E08000003", requestOptions)
  .then(response => response.text())
  .then(function(result) { 
    console.log(result);
    const data = JSON.parse(result);
    // data.rows.forEach(function(element) { 
    //   console.log(element["energy-consumption-current"]);
    //   let energy = element["energy-consumption-current"];
    //   document.getElementById("energy-consumption").innerHTML = "Current energy consumption: " + energy;
    // });
    let energy = data.rows[0]["energy-consumption-current"];
    document.getElementById("energy-consumption").innerHTML = "Current energy consumption: " + energy;
    console.log(energy);
  })
  .catch(error => console.log('error', error));

//Pop-up window
const modal = document.querySelector('#my-modal');
const modalBtn = document.querySelector('#modal-btn');
const closeBtn = document.querySelector('.close');

// Events
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

// Open
function openModal() {
  modal.style.display = 'block';
}

// Close
function closeModal() {
  modal.style.display = 'none';
}

// Close If Outside Click
function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}

