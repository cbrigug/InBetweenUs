import { GoogleMap, LatLngBounds } from '@capacitor/google-maps';
import { useEffect, useRef } from 'react';
import { Coordinates } from '../pages/Results';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { environment } from '../../environment.dev';

const API_KEY = environment.REACT_APP_GOOGLE_API_KEY;

interface MapProps {
  center: Coordinates;
  personA: Coordinates;
  personB: Coordinates;
}

const Map: React.FC<MapProps> = ({ center, personA, personB }) => {
  const mapRef = useRef<HTMLElement>();
  let newMap: GoogleMap;

  async function createMap() {
    if (!mapRef.current) return;

    newMap = await GoogleMap.create({
      id: 'map',
      element: mapRef.current,
      apiKey: API_KEY,
      config: {
        center: {
          lat: center.latitude,
          lng: center.longitude
        },
        zoom: 15,
        disableDefaultUI: true,
      }
    })
  }

  async function addMarkers() {
    await newMap.addMarker({
      coordinate: {
        lat: personA.latitude,
        lng: personA.longitude
      },
      opacity: 0.85,
    })
    await newMap.addMarker({
      coordinate: {
        lat: personB.latitude,
        lng: personB.longitude
      },
      opacity: 0.85,
    })
    await newMap.addMarker({
      coordinate: {
        lat: center.latitude,
        lng: center.longitude
      }
    })
  }

  async function fitBounds() {
    await newMap.fitBounds({
      northeast: {
        lat: Math.max(personA.latitude, personB.latitude),
        lng: Math.max(personA.longitude, personB.longitude)
      },
      southwest: {
        lat: Math.min(personA.latitude, personB.latitude),
        lng: Math.min(personA.longitude, personB.longitude)
      },
      center: {
        lat: center.latitude,
        lng: center.longitude
      },
      contains: function (point: LatLng): Promise<boolean> {
        throw new Error('Function not implemented.');
      },
      extend: function (point: LatLng): Promise<LatLngBounds> {
        throw new Error('Function not implemented.');
      }
    });
  }

  useEffect(() => {
    createMap().then(() => {
      addMarkers();
      fitBounds();
    });
  }, [center]);

  return (
    <div className="component-wrapper">
      <capacitor-google-map ref={mapRef} style={{
        display: 'inline-block',
        width: 325,
        height: 300,
        borderRadius: 10,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)'
      }}></capacitor-google-map>
    </div>
  )
}

export default Map;