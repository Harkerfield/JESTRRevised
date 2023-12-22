import React, { useEffect, useContext } from "react";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { KML } from "ol/format";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import { Style, Text, Fill, Stroke, RegularShape } from "ol/style";
import { defaults as defaultInteractions } from "ol/interaction"; // Import default interactions
import { ConfigContext } from "../../Provider/Context.js";

import "ol/ol.css";
import "./MapComponent.css";

const labelStyle = (feature) => {
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
    image: new RegularShape({
      fill: new Fill({ color: "black" }),
      stroke: new Stroke({ color: "black", width: 2 }),
      points: 4,
      radius: 10,
      radius2: 0,
      angle: Math.PI / 4,
    }),
  });
};

const MapComponent = ({ points }) => {
  const config = useContext(ConfigContext);

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
        url: `${config.kml.airspace}`,
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
      map.setTarget(null);
    };
  }, [points]);

  return (
    <>
      <div
        id="map"
        className="map"
        style={{ height: "60vh", minWidth: "50%" }}
      ></div>
    </>
  );
};

export default MapComponent;
