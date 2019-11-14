import { GraphQLResolveInfo } from 'graphql';
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
};

export type QueryServiceUptimePolygonArgs = {
  serviceID: Scalars['String'];
  status: ServiceStatus;
  viewport: Array<PointInput>;
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
  String: ResolverTypeWrapper<Scalars['String']>;
  ServiceStatus: ServiceStatus;
  PointInput: PointInput;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Point: ResolverTypeWrapper<Point>;
  Mutation: ResolverTypeWrapper<{}>;
  ServiceStatusReport: ResolverTypeWrapper<ServiceStatusReport>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Reporter: ResolverTypeWrapper<Reporter>;
  Service: ResolverTypeWrapper<Service>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  String: Scalars['String'];
  ServiceStatus: ServiceStatus;
  PointInput: PointInput;
  Float: Scalars['Float'];
  Point: Point;
  Mutation: {};
  ServiceStatusReport: ServiceStatusReport;
  ID: Scalars['ID'];
  Reporter: Reporter;
  Service: Service;
  Boolean: Scalars['Boolean'];
};

export type MutationResolvers<
  ContextType = any,
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

export type PointResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Point'] = ResolversParentTypes['Point']
> = {
  lon?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
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
};

export type ReporterResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Reporter'] = ResolversParentTypes['Reporter']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ServiceResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Service'] = ResolversParentTypes['Service']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ServiceStatusReportResolvers<
  ContextType = any,
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

export type Resolvers<ContextType = any> = {
  Mutation?: MutationResolvers<ContextType>;
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
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
