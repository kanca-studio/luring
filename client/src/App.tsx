import React from 'react';
import {
  Map as ReactLeafletMap,
  TileLayer,
  GeoJSON,
  Viewport,
} from 'react-leaflet';
import './App.css';
import useServicesQuery from './graphql/queries/useServicesQuery';
import usePlacesQuery from './graphql/queries/usePlacesQuery';
import useOfflineStatusQuery from './graphql/queries/useOfflineStatusQuery';
import { parse } from 'query-string';
import { findBestMatch } from 'string-similarity';

enum Bucket {
  Empty = 0,
  Level1 = 1,
  Level2 = 2,
  Level3 = 3,
  Level4 = 4,
}

const bucketColorsMap = new Map([
  [Bucket.Empty, '#0080f2'],
  [Bucket.Level1, '#a061e4'],
  [Bucket.Level2, '#e822b2'],
  [Bucket.Level3, '#ff0067'],
  [Bucket.Level4, '#ff0000'],
]);

const getColor = (val: number) => {
  const bucket = Array.from(bucketColorsMap.keys()).find(key => key > val);
  const color = bucketColorsMap.get(bucket || Bucket.Empty);
  return color || 'transparent';
};

const Legends = () => {
  return (
    <>
      <p className="text-primary text-xs mb-1">Reports</p>
      {Array.from(bucketColorsMap.entries()).map(([bucket, color]) => (
        <div className="flex flex-1" key={bucket}>
          <div className="flex-1 la la-square mr-1" style={{ color }}></div>
          <div className="text-xs text-primary"> > {bucket}</div>
        </div>
      ))}
    </>
  );
};

const App: React.FC = () => {
  const mapOptions = React.useMemo(() => parse(window.location.search), []);
  const [viewport, setViewport] = React.useState<Viewport>({
    center: [-7.8831, 112.5334],
    zoom: 12,
  });
  const [activeService, setActiveService] = React.useState('SmkmtBhT');
  const services = useServicesQuery();
  const servicesByName = React.useMemo(
    () =>
      new Map(
        services.data?.services.map(service => [service.name, service]) || []
      ),
    [services.data]
  );
  React.useEffect(() => {
    if (!services.data || typeof mapOptions.service !== 'string') return;
    const matches = findBestMatch(
      mapOptions.service,
      Array.from(servicesByName.keys())
    );
    const serviceFromParams = servicesByName.get(matches.bestMatch.target);
    if (serviceFromParams) setActiveService(serviceFromParams.id);
  }, [services.data]);
  const places = usePlacesQuery();
  const placesMap = React.useMemo(
    () => new Map(places.data?.name_2Places.map(p => [p.id, p]) || []),
    [places.data]
  );
  const placesByName = React.useMemo(
    () =>
      new Map(
        places.data?.name_2Places.map(place => [place.name, place]) || []
      ),
    [places.data]
  );
  const [activePlace, setActivePlace] = React.useState<{
    id: string;
    name: string;
    point: { lat: number; lon: number };
  }>({
    id: 'IDN.7.2_1',
    name: 'Jakarta Pusat',
    point: {
      lat: -6.1818,
      lon: 106.8223,
    },
  });
  React.useEffect(() => {
    setViewport(v => ({
      ...v,
      center: [activePlace.point.lat, activePlace.point.lon],
    }));
  }, [activePlace]);
  React.useEffect(() => {
    if (!places.data || typeof mapOptions.place !== 'string') return;
    const matches = findBestMatch(
      mapOptions.place,
      Array.from(placesByName.keys())
    );
    const placeFromParams = placesByName.get(matches.bestMatch.target);
    if (placeFromParams) setActivePlace(placeFromParams);
  }, [places.data]);
  const offlineStatus = useOfflineStatusQuery({
    gid_2: activePlace.id,
    serviceID: activeService,
  });
  const onSelectPlace = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const place = placesMap.get(e.currentTarget.value);
      if (place) {
        setActivePlace(place);
      }
    },
    [placesMap]
  );
  const onViewportChange = React.useCallback((v: Viewport) => {
    setViewport(v);
  }, []);
  return (
    <div className="absolute right-0 left-0 top-0 bottom-0">
      <div className="absolute bottom-0 left-0 p-3 m-5 bg-accent rounded shadow z-10">
        <Legends />
      </div>
      <div className="absolute top-0 left-0 right-0 h-40 p-4 z-10">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-primary text-xl">
            <div className="la la-map-marked"></div>
          </div>
          <select
            onChange={onSelectPlace}
            value={activePlace.id}
            className="bg-accent block appearance-none w-full text-primary font-semibold py-3 px-4 pl-10 rounded leading-tight focus:outline-none shadow"
          >
            {places.data ? (
              places.data.name_2Places.map(place => (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              ))
            ) : (
              <option>Loading places...</option>
            )}
          </select>
        </div>
        <div className="mt-2 flex overflow-x-auto overflow-y-hidden flex-no-wrap no-scrollbar">
          {services.data
            ? services.data.services.map(service => (
                <div className="flex-none" key={service.id}>
                  <button
                    onClick={() => setActiveService(service.id)}
                    className={`text-xs text-primary flex justify-center font-semibold cursor-pointer py-2 px-4 mr-2 focus:outline-none rounded-full shadow ${
                      service.id === activeService
                        ? 'bg-accent-active'
                        : 'bg-accent'
                    }`}
                  >
                    <span
                      className={`text-base w-4 h-4 mr-2 la la-${service.icon}`}
                    ></span>
                    <span>{service.name}</span>
                  </button>
                </div>
              ))
            : null}
        </div>
      </div>
      <ReactLeafletMap
        viewport={viewport}
        className="v-screen h-screen z-0"
        zoomControl={false}
        onViewportChange={onViewportChange}
        id="map"
      >
        <TileLayer
          attribution='© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={`https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`}
        />
        {offlineStatus.data && !offlineStatus.loading
          ? offlineStatus.data.name_2OfflineStatus.map(stat => (
              <GeoJSON
                style={() => ({
                  color: getColor(stat.value),
                  weight: 1,
                  fillOpacity: 0.1,
                })}
                // @ts-ignore
                data={stat.place.geom}
              />
            ))
          : null}
      </ReactLeafletMap>
    </div>
  );
};

export default App;
