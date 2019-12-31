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
      return {
        ...place,
        centerToName2: place.name_2 === place.name_3,
        geom: JSON.parse(place.geom),
      };
    },
  },
  Query: {
    name_2Places: async (_, __, { db }) => {
      const QUERY = sql`
        SELECT p.gid_2, p.name_2, MIN(c.lat) as lat, MIN(c.lng) as lng
        FROM places p, cities c
        WHERE p.name_2 = c.city
        GROUP BY gid_2, name_2
        ORDER BY name_2`;
      const { rows } = await db.query<{
        gid_2: string;
        name_2: string;
        lat: number;
        lng: number;
      }>(QUERY);
      return rows.map(r => ({
        id: r.gid_2,
        name: r.name_2,
        level: 2,
        point: { lat: r.lat, lon: r.lng },
      }));
    },
    services: async (_, __, { db }) => {
      const QUERY = sql`SELECT id, name, icon FROM service`;
      const { rows } = await db.query<{
        id: string;
        name: string;
        icon: string;
      }>(QUERY);
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
