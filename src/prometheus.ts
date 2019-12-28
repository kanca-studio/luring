import { Gauge } from 'prom-client';

export const gauge = new Gauge({
  name: 'service_offline_report',
  help: 'Service status report',
  labelNames: ['gid_0', 'gid_1', 'gid_2', 'gid_3', 'gid_4', 'place_id'],
});

export interface Metric {
  __name__: string;
  instance: string;
  job: string;
  gid_0: string;
  gid_1: string;
  gid_2: string;
  gid_3: string;
  gid_4: string;
  place_id: string;
}

export interface Result {
  metric: Metric;
  value: [number, number];
}

export interface Data {
  resultType: string;
  result: Result[];
}

export interface PrometheusQueryResponse {
  status: string;
  data: Data;
}
