import { useRef, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBox = ({ onPlaceSelected, placeholder = 'Enter location...', className = '' }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    let pollId = null;
    let mounted = true;

    const initAutocomplete = () => {
      if (!mounted || !inputRef.current) return false;
      if (!window.google || !window.google.maps || !window.google.maps.places) return false;

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { componentRestrictions: { country: 'in' } } // Restrict to India
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.geometry) {
          onPlaceSelected({
            address: place.formatted_address,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            placeId: place.place_id,
          });
        }
      });

      return true;
    };

    // Try to initialize immediately, otherwise poll briefly until the library is available
    if (!initAutocomplete()) {
      pollId = setInterval(() => {
        if (initAutocomplete() && pollId) {
          clearInterval(pollId);
          pollId = null;
        }
      }, 250);
    }

    return () => {
      mounted = false;
      if (pollId) clearInterval(pollId);
      if (autocompleteRef.current && typeof autocompleteRef.current.unbindAll === 'function') {
        try { autocompleteRef.current.unbindAll(); } catch (e) { /* ignore */ }
      }
    };
  }, [onPlaceSelected]);

  return (
    <div className={`relative ${className}`}>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all"
      />
    </div>
  );
};

export default SearchBox;