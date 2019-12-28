import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
import { Context } from '../resolvers';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSONObject: any;
  JSON: any;
};

export type Mutation = {
  __typename?: 'Mutation';
  reportServiceStatus: ServiceStatusReport;
};

export type MutationReportServiceStatusArgs = {
  serviceID: Scalars['String'];
  status: ServiceStatus;
  location: PointInput;
};

export type OfflineStatus = {
  __typename?: 'OfflineStatus';
  id: Scalars['ID'];
  value: Scalars['Int'];
  place: Place;
};

export type Place = {
  __typename?: 'Place';
  id: Scalars['ID'];
  gid_0: Scalars['String'];
  name_0: Scalars['String'];
  gid_1: Scalars['String'];
  name_1: Scalars['String'];
  gid_2: Scalars['String'];
  name_2: Scalars['String'];
  gid_3: Scalars['String'];
  name_3: Scalars['String'];
  gid_4: Scalars['String'];
  name_4: Scalars['String'];
  geom?: Maybe<Scalars['JSONObject']>;
};

export type PlaceName = {
  __typename?: 'PlaceName';
  id: Scalars['ID'];
  name: Scalars['String'];
  level: Scalars['Int'];
};

export type Point = {
  __typename?: 'Point';
  lon: Scalars['Float'];
  lat: Scalars['Float'];
};

export type PointInput = {
  lon: Scalars['Float'];
  lat: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  serviceUptimePolygon: Array<Point>;
  name_2Places?: Maybe<Array<PlaceName>>;
  name_2OfflineStatus: Array<OfflineStatus>;
};

export type QueryServiceUptimePolygonArgs = {
  serviceID: Scalars['String'];
  status: ServiceStatus;
  viewport: Array<PointInput>;
};

export type QueryName_2OfflineStatusArgs = {
  gid_2: Scalars['ID'];
};

export type Reporter = {
  __typename?: 'Reporter';
  id: Scalars['String'];
  name: Scalars['String'];
  phone: Scalars['String'];
};

export type Service = {
  __typename?: 'Service';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export enum ServiceStatus {
  Online = 'ONLINE',
  Offline = 'OFFLINE',
}

export type ServiceStatusReport = {
  __typename?: 'ServiceStatusReport';
  id: Scalars['ID'];
  reporter: Reporter;
  service: Service;
  status: ServiceStatus;
  location: Point;
  reportedAt: Scalars['Float'];
  resolving?: Maybe<ServiceStatusReport>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Partial<Scalars['String']>>;
  ServiceStatus: ResolverTypeWrapper<Partial<ServiceStatus>>;
  PointInput: ResolverTypeWrapper<Partial<PointInput>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']>>;
  Point: ResolverTypeWrapper<Partial<Point>>;
  PlaceName: ResolverTypeWrapper<Partial<PlaceName>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>;
  OfflineStatus: ResolverTypeWrapper<Partial<OfflineStatus>>;
  Place: ResolverTypeWrapper<Partial<Place>>;
  JSONObject: ResolverTypeWrapper<Partial<Scalars['JSONObject']>>;
  Mutation: ResolverTypeWrapper<{}>;
  ServiceStatusReport: ResolverTypeWrapper<Partial<ServiceStatusReport>>;
  Reporter: ResolverTypeWrapper<Partial<Reporter>>;
  Service: ResolverTypeWrapper<Partial<Service>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
  JSON: ResolverTypeWrapper<Partial<Scalars['JSON']>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  String: Partial<Scalars['String']>;
  ServiceStatus: Partial<ServiceStatus>;
  PointInput: Partial<PointInput>;
  Float: Partial<Scalars['Float']>;
  Point: Partial<Point>;
  PlaceName: Partial<PlaceName>;
  ID: Partial<Scalars['ID']>;
  Int: Partial<Scalars['Int']>;
  OfflineStatus: Partial<OfflineStatus>;
  Place: Partial<Place>;
  JSONObject: Partial<Scalars['JSONObject']>;
  Mutation: {};
  ServiceStatusReport: Partial<ServiceStatusReport>;
  Reporter: Partial<Reporter>;
  Service: Partial<Service>;
  Boolean: Partial<Scalars['Boolean']>;
  JSON: Partial<Scalars['JSON']>;
};

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  reportServiceStatus?: Resolver<
    ResolversTypes['ServiceStatusReport'],
    ParentType,
    ContextType,
    RequireFields<
      MutationReportServiceStatusArgs,
      'serviceID' | 'status' | 'location'
    >
  >;
};

export type OfflineStatusResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['OfflineStatus'] = ResolversParentTypes['OfflineStatus']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  place?: Resolver<ResolversTypes['Place'], ParentType, ContextType>;
};

export type PlaceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Place'] = ResolversParentTypes['Place']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  gid_0?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name_0?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gid_1?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name_1?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gid_2?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name_2?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gid_3?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name_3?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gid_4?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name_4?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  geom?: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType>;
};

export type PlaceNameResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['PlaceName'] = ResolversParentTypes['PlaceName']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type PointResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Point'] = ResolversParentTypes['Point']
> = {
  lon?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  serviceUptimePolygon?: Resolver<
    Array<ResolversTypes['Point']>,
    ParentType,
    ContextType,
    RequireFields<
      QueryServiceUptimePolygonArgs,
      'serviceID' | 'status' | 'viewport'
    >
  >;
  name_2Places?: Resolver<
    Maybe<Array<ResolversTypes['PlaceName']>>,
    ParentType,
    ContextType
  >;
  name_2OfflineStatus?: Resolver<
    Array<ResolversTypes['OfflineStatus']>,
    ParentType,
    ContextType,
    RequireFields<QueryName_2OfflineStatusArgs, 'gid_2'>
  >;
};

export type ReporterResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Reporter'] = ResolversParentTypes['Reporter']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ServiceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Service'] = ResolversParentTypes['Service']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ServiceStatusReportResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ServiceStatusReport'] = ResolversParentTypes['ServiceStatusReport']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reporter?: Resolver<ResolversTypes['Reporter'], ParentType, ContextType>;
  service?: Resolver<ResolversTypes['Service'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ServiceStatus'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['Point'], ParentType, ContextType>;
  reportedAt?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  resolving?: Resolver<
    Maybe<ResolversTypes['ServiceStatusReport']>,
    ParentType,
    ContextType
  >;
};

export type Resolvers<ContextType = Context> = {
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  OfflineStatus?: OfflineStatusResolvers<ContextType>;
  Place?: PlaceResolvers<ContextType>;
  PlaceName?: PlaceNameResolvers<ContextType>;
  Point?: PointResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Reporter?: ReporterResolvers<ContextType>;
  Service?: ServiceResolvers<ContextType>;
  ServiceStatusReport?: ServiceStatusReportResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
