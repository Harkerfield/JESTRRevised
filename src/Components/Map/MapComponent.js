import React, { useEffect, useContext, useState } from "react";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { KML } from "ol/format";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import { Style, Text, Fill, Stroke, Icon } from "ol/style";
import { defaults as defaultInteractions } from "ol/interaction"; // Import default interactions
import { ConfigContext } from "../../Provider/Context.js";

import "ol/ol.css";
import "./MapComponent.css";

// Function to get SVG icon as a data URL
const getSvgDataUrl = (svgString) => {
  const encodedSvg = encodeURIComponent(svgString)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml;utf8,${encodedSvg}`;
};

const labelStyle = (feature) => {
  // Define your SVG string here
  const svgString = `<svg width="13.229mm" height="11.457mm" version="1.1" viewBox="0 0 13.229 11.457" xmlns="http://www.w3.org/2000/svg" xmlnsCc="http://creativecommons.org/ns#" xmlnsDc="http://purl.org/dc/elements/1.1/" xmlnsRdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <metadata>
    <rdfRDF>
      <ccWork rdfAbout="">
        <dcFormat>image/svg+xml</dcFormat>
        <dcType rdfResource="http://purl.org/dc/dcmitype/StillImage"/>
        <dcTitle/>
      </ccWork>
    </rdfRDF>
  </metadata>
  <g transform="translate(71.774 -138.39)">
    <path d="m-71.043 149.42 5.8837-10.191 5.8837 10.191z" fill="none" stroke="#f00" stroke-width=".84393"/>
  </g>
</svg>`;

  return new Style({
    geometry: feature.getGeometry(),
    text: new Text({
      text: feature.get("Title"),
      fill: new Fill({ color: "black" }),
      stroke: new Stroke({ color: "white", width: 3 }),
      offsetX: 10,
      offsetY: 20,
      scale: 1,
    }),
    image: new Icon({
      src: getSvgDataUrl(svgString),
      scale: 1,
      // You can adjust anchor, opacity, rotation, etc. as needed
    }),
  });
};

const MapComponent = ({ points }) => {
  const config = useContext(ConfigContext);
  const [showZoomInstruction, setShowZoomInstruction] = useState(false); // State for showing zoom instructions

  points = points ? points : [];

  useEffect(() => {
    const worldImageryMap = new TileLayer({
      source: new XYZ({
        url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        projection: "EPSG:3857",
      }),
    });

    const airspaceLayer = new VectorLayer({
      name: "airspace",
      source: new VectorSource({
        url: `${config.apiBaseUrl}${config.folderLocation}/${config.kml.airspace}`,
        format: new KML(),
      }),
    });

    const map = new Map({
      layers: [worldImageryMap, airspaceLayer], // Initialize with both layers
      interactions: defaultInteractions({ mouseWheelZoom: false }),
      target: "map",
      view: new View({
        center: fromLonLat([-146.44166473513687, 64.31714411488758]),
        zoom: 8,
        maxZoom: 18,
      }),
    });

    // Custom mouse wheel event handler
    map.getViewport().addEventListener("wheel", (event) => {
      if (event.shiftKey) {
        event.preventDefault();
        const view = map.getView();
        const zoom = view.getZoom();
        const delta = event.deltaY > 0 ? -1 : 1;
        const newZoom = zoom + delta;

        // Convert the mouse pointer location to coordinate
        const pixel = map.getEventPixel(event);
        const coordinate = map.getCoordinateFromPixel(pixel);

        // Animate the view to zoom to the mouse pointer
        view.animate({
          center: coordinate,
          zoom: newZoom,
          duration: 250,
        });

        setShowZoomInstruction(false);
      } else {
        setShowZoomInstruction(true);
        setTimeout(() => setShowZoomInstruction(false), 3000);
      }
    });

    // Convert JSON points to OpenLayers Features and add them to the map
    const pointFeatures = points.map((point) => {
      const feature = new Feature({
        geometry: new Point(
          fromLonLat([point.pointLocationLon, point.pointLocationLat]),
        ),
        name: point.Title,
      });
      return feature;
    });

    const vectorSource = new VectorSource({ features: pointFeatures });

    const pointLayer = new VectorLayer({
      source: vectorSource,
      style: labelStyle, // Use the style function here
      declutter: true, // Enable decluttering
    });

    map.addLayer(pointLayer);

    const size = map.getSize();
    if (points.length !== 0) {
      map.getView().fit(vectorSource.getExtent(), {
        padding: [30, 30, 30, 30],
        constrainResolution: false,
      });
    } else {
      map
        .getView()
        .centerOn(
          fromLonLat([-146.44166473513687, 64.31714411488758]),
          size,
          [570, 500],
        );
    }

    return () => {
      // Cleanup on component unmount
      map.getViewport().removeEventListener("wheel", this);
      map.setTarget(null);
    };
  }, [points]);

  return (
    <>
      <div id="map" className="map" style={{ height: "60vh", minWidth: "50%" }}>
        {showZoomInstruction && (
          <div className="zoom-instruction">
            <div>Use "Shift" + "Mouse Wheel" to zoom.</div>
            <div>Or, "Shift" + "Left Click" to zoom to a sector.</div>
            <div>Fly, Fight, Win</div>
          </div>
        )}
      </div>
    </>
  );
};

export default MapComponent;
