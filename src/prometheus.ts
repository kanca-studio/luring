import { Gauge } from 'prom-client';

export const gauge = new Gauge({
  name: 'service_offline_report',
  help: 'Service status report',
  labelNames: ['name_0', 'name_1', 'name_2', 'name_3', 'name_4'],
});
