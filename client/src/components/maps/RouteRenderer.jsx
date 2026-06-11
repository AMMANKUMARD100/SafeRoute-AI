import { Polyline, Marker } from '@react-google-maps/api';
import { useState } from 'react';

// Color map for different route types
const routeColors = {
  safest: '#22c55e',    // green
  fastest: '#3b82f6',    // blue
  balanced: '#f97316',   // orange
};

const RouteRenderer = ({ routes, selectedRouteIndex, onRouteClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Decode polyline if needed (Google returns encoded string; here we assume array of lat/lng objects)
  const decodePolyline = (encoded) => {
    if (!encoded || typeof encoded !== 'string') return [];
    // Simple decoder for Google encoded polyline
    const points = [];
    let index = 0, lat = 0, lng = 0;
    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
      lat += dlat;
      shift = 0; result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
      lng += dlng;
      points.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }
    return points;
  };

  return (
    <>
      {routes.map((route, idx) => {
        // Determine path: either array of coords or encoded polyline
        const path = Array.isArray(route.path)
          ? route.path
          : decodePolyline(route.polyline);

        if (!path.length) return null;

        const color = routeColors[route.type] || '#ec4899';
        const isSelected = idx === selectedRouteIndex;
        const isHovered = idx === hoveredIndex;

        return (
          <Polyline
            key={idx}
            path={path}
            options={{
              strokeColor: color,
              strokeOpacity: isSelected || isHovered ? 1 : 0.7,
              strokeWeight: isSelected ? 8 : isHovered ? 6 : 5,
              zIndex: isSelected ? 10 : 1,
              clickable: true,
            }}
            onClick={() => onRouteClick && onRouteClick(idx)}
            onMouseOver={() => setHoveredIndex(idx)}
            onMouseOut={() => setHoveredIndex(null)}
          />
        );
      })}

      {/* Start/End markers (optional) */}
      {routes.length > 0 && routes[0].startLocation && (
        <Marker position={routes[0].startLocation} icon={{ url: '/marker-start.svg', scaledSize: new window.google.maps.Size(30, 30) }} />
      )}
      {routes.length > 0 && routes[0].endLocation && (
        <Marker position={routes[0].endLocation} icon={{ url: '/marker-end.svg', scaledSize: new window.google.maps.Size(30, 30) }} />
      )}
    </>
  );
};

export default RouteRenderer;