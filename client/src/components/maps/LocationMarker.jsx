import { Marker } from '@react-google-maps/api';

const LocationMarker = ({ position, heading = 0, pulsate = false }) => {
  if (!position) return null;

  // Custom SVG marker icon (pink glowing dot)
  const icon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: '#ec4899',
    fillOpacity: 0.9,
    strokeColor: '#fff',
    strokeWeight: 2,
    scale: pulsate ? 12 : 10,
  };

  return (
    <Marker
      position={position}
      icon={icon}
      animation={pulsate ? window.google.maps.Animation.BOUNCE : null}
    />
  );
};

export default LocationMarker;