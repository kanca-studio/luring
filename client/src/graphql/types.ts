export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  JSONObject: { [key: string]: any },
  JSON: any,
};



export type OfflineStatus = {
   __typename?: 'OfflineStatus',
  id: Scalars['ID'],
  value: Scalars['Int'],
  place: Place,
};

export type Place = {
   __typename?: 'Place',
  id: Scalars['ID'],
  gid_0: Scalars['String'],
  name_0: Scalars['String'],
  gid_1: Scalars['String'],
  name_1: Scalars['String'],
  gid_2: Scalars['String'],
  name_2: Scalars['String'],
  gid_3: Scalars['String'],
  name_3: Scalars['String'],
  gid_4: Scalars['String'],
  name_4: Scalars['String'],
  centerToName2: Scalars['Boolean'],
  geom: Scalars['JSONObject'],
};

export type PlaceName = {
   __typename?: 'PlaceName',
  id: Scalars['ID'],
  name: Scalars['String'],
  point: Point,
  level: Scalars['Int'],
};

export type Point = {
   __typename?: 'Point',
  lon: Scalars['Float'],
  lat: Scalars['Float'],
};

export type Query = {
   __typename?: 'Query',
  name_2Places: Array<PlaceName>,
  services: Array<Service>,
  name_2OfflineStatus: Array<OfflineStatus>,
};


export type QueryName_2OfflineStatusArgs = {
  gid_2: Scalars['ID'],
  serviceID: Scalars['ID']
};

export type Reporter = {
   __typename?: 'Reporter',
  id: Scalars['String'],
  name: Scalars['String'],
  phone: Scalars['String'],
};

export type Service = {
   __typename?: 'Service',
  id: Scalars['ID'],
  name: Scalars['String'],
  icon: Scalars['String'],
};

export enum ServiceStatus {
  Online = 'ONLINE',
  Offline = 'OFFLINE'
}

export type ServiceStatusReport = {
   __typename?: 'ServiceStatusReport',
  id: Scalars['ID'],
  reporter: Reporter,
  service: Service,
  status: ServiceStatus,
  location: Point,
  reportedAt: Scalars['Float'],
  resolving?: Maybe<ServiceStatusReport>,
};

export type Name_2OfflineStatusQueryVariables = {
  gid_2: Scalars['ID'],
  serviceID: Scalars['ID']
};


export type Name_2OfflineStatusQuery = (
  { __typename?: 'Query' }
  & { name_2OfflineStatus: Array<(
    { __typename?: 'OfflineStatus' }
    & Pick<OfflineStatus, 'id' | 'value'>
    & { place: (
      { __typename?: 'Place' }
      & Pick<Place, 'id' | 'name_4' | 'centerToName2' | 'geom'>
    ) }
  )> }
);

export type Name_2PlacesQueryVariables = {};


export type Name_2PlacesQuery = (
  { __typename?: 'Query' }
  & { name_2Places: Array<(
    { __typename?: 'PlaceName' }
    & Pick<PlaceName, 'id' | 'name'>
    & { point: (
      { __typename?: 'Point' }
      & Pick<Point, 'lat' | 'lon'>
    ) }
  )> }
);

export type ServicesQueryVariables = {};


export type ServicesQuery = (
  { __typename?: 'Query' }
  & { services: Array<(
    { __typename?: 'Service' }
    & Pick<Service, 'id' | 'name' | 'icon'>
  )> }
);
