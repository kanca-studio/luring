import Faker from 'faker';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { Resolvers, Place } from './generated/graphql';
import { JwtPayload } from './auth';
import { Pool } from 'pg';
import Axios from 'axios';
import sql from 'sql-tag';
import { PrometheusQueryResponse } from './prometheus';

export type Context = {
  visitor: JwtPayload;
  db: Pool;
};

const resolvers: Resolvers<Context> = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  OfflineStatus: {
    place: async ({ id }: { id: string }, _, { db }) => {
      const QUERY = sql`
        SELECT
          ogc_fid as id, name_1, name_2, name_3, name_4, gid_1, gid_2, gid_3, gid_4, ST_AsGeoJSON(wkb_geometry) as geom
        FROM places
        WHERE ogc_fid=${id}
      `;
      const { rows } = await db.query<Place>(QUERY);
      const place = rows[0];
      if (!place) throw new Error(`Place with id of ${id} doesn't exist`);
      return { ...place, geom: JSON.parse(place.geom) };
    },
  },
  Query: {
    name_2Places: async (_, __, { db }) => {
      const QUERY = sql`
        SELECT DISTINCT gid_2, name_2 
        FROM places`;
      const { rows } = await db.query<{ gid_2: string; name_2: string }>(QUERY);
      return rows.map(r => ({
        id: r.gid_2,
        name: r.name_2,
        level: 2,
      }));
    },
    services: async (_, __, { db }) => {
      const QUERY = sql`SELECT id, name FROM service`;
      const { rows } = await db.query<{ id: string; name: string }>(QUERY);
      return rows;
    },
    name_2OfflineStatus: async (_, { gid_2, serviceID }) => {
      const now = new Date();
      now.setSeconds(0);
      now.setMilliseconds(0);
      const time = now.toISOString();
      const resp = await Axios.get<PrometheusQueryResponse>(
        process.env.PROMETHEUS_API_URL + '/v1/query',
        {
          params: {
            query: `service_offline_report{gid_2="${gid_2}", service_id="${serviceID}"}`,
            time,
          },
        }
      );
      return resp.data.data.result.map(r => ({
        id: r.metric.place_id,
        value: r.value[1],
      }));
    },
  },
};

export default resolvers;
