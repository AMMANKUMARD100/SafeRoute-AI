import { useState, useEffect } from 'react';
import { MapContainer, LocationMarker, RouteRenderer } from '../components/maps';
import { SOSButton, CheckInButton, NightModeToggle } from '../components/safety';
import { useLocation } from '../context/LocationContext';

const LiveTracking = () => {
  const { location } = useLocation();
  const [tripId] = useState('trip_123'); // from params or active trip
  const [routePath] = useState([]); // decoded polyline

  useEffect(() => {
    // Fetch active trip and route from API, then setRoutePath
  }, [tripId]);

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex items-center justify-between p-4 bg-gray-950/80 backdrop-blur-md border-b border-white/10">
        <h2 className="text-xl font-semibold text-white">Live Tracking</h2>
        <div className="flex gap-2">
          <CheckInButton />
          <NightModeToggle />
        </div>
      </div>
      <div className="flex-1 relative">
        <MapContainer center={location || { lat: 19.076, lng: 72.8777 }} zoom={15}>
          <LocationMarker position={location} pulsate />
          {routePath.length > 0 && <RouteRenderer routes={[{ path: routePath, type: 'safest' }]} />}
        </MapContainer>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <SOSButton />
      </div>
    </div>
  );
};

export default LiveTracking;