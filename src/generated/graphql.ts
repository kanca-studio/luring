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
  centerToName2: Scalars['Boolean'];
  geom: Scalars['JSONObject'];
};

export type PlaceName = {
  __typename?: 'PlaceName';
  id: Scalars['ID'];
  name: Scalars['String'];
  point: Point;
  level: Scalars['Int'];
};

export type Point = {
  __typename?: 'Point';
  lon: Scalars['Float'];
  lat: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  name_2Places: Array<PlaceName>;
  services: Array<Service>;
  name_2OfflineStatus: Array<OfflineStatus>;
};

export type QueryName_2OfflineStatusArgs = {
  gid_2: Scalars['ID'];
  serviceID: Scalars['ID'];
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
  icon: Scalars['String'];
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
  PlaceName: ResolverTypeWrapper<Partial<PlaceName>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']>>;
  Point: ResolverTypeWrapper<Partial<Point>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>;
  Service: ResolverTypeWrapper<Partial<Service>>;
  OfflineStatus: ResolverTypeWrapper<Partial<OfflineStatus>>;
  Place: ResolverTypeWrapper<Partial<Place>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
  JSONObject: ResolverTypeWrapper<Partial<Scalars['JSONObject']>>;
  JSON: ResolverTypeWrapper<Partial<Scalars['JSON']>>;
  ServiceStatus: ResolverTypeWrapper<Partial<ServiceStatus>>;
  Reporter: ResolverTypeWrapper<Partial<Reporter>>;
  ServiceStatusReport: ResolverTypeWrapper<Partial<ServiceStatusReport>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  PlaceName: Partial<PlaceName>;
  ID: Partial<Scalars['ID']>;
  String: Partial<Scalars['String']>;
  Point: Partial<Point>;
  Float: Partial<Scalars['Float']>;
  Int: Partial<Scalars['Int']>;
  Service: Partial<Service>;
  OfflineStatus: Partial<OfflineStatus>;
  Place: Partial<Place>;
  Boolean: Partial<Scalars['Boolean']>;
  JSONObject: Partial<Scalars['JSONObject']>;
  JSON: Partial<Scalars['JSON']>;
  ServiceStatus: Partial<ServiceStatus>;
  Reporter: Partial<Reporter>;
  ServiceStatusReport: Partial<ServiceStatusReport>;
};

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

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
  centerToName2?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  geom?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
};

export type PlaceNameResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['PlaceName'] = ResolversParentTypes['PlaceName']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  point?: Resolver<ResolversTypes['Point'], ParentType, ContextType>;
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
  name_2Places?: Resolver<
    Array<ResolversTypes['PlaceName']>,
    ParentType,
    ContextType
  >;
  services?: Resolver<
    Array<ResolversTypes['Service']>,
    ParentType,
    ContextType
  >;
  name_2OfflineStatus?: Resolver<
    Array<ResolversTypes['OfflineStatus']>,
    ParentType,
    ContextType,
    RequireFields<QueryName_2OfflineStatusArgs, 'gid_2' | 'serviceID'>
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
  icon?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
