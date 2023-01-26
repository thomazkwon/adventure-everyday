import React from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const ArticleMap = (props) => {
  return (
    <div>
      <Map
        center={{ lat: 33.5563, lng: 126.79581 }}
        style={{ width: "100%", height: "360px" }}
      >
        <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
          <div style={{ color: "#000" }}>Hello World!</div>
        </MapMarker>
      </Map>
    </div>
  );
};

export default ArticleMap;
