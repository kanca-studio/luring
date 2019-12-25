import { Pushgateway, Counter } from 'prom-client';

export const counter = new Counter({
  name: 'service_status_report',
  help: 'Service status report',
  labelNames: ['name_0', 'name_1', 'name_2', 'name_3', 'name_4', 'status'],
});

const pushgateway = new Pushgateway(process.env.PUSH_GATEWAY_URL);

export const pushMetrics = async (recursive: boolean = false) => {
  await new Promise(resolve => {
    pushgateway.push({ jobName: 'luring' }, (err: Error) => {
      if (!recursive) return resolve();
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  });
  if (recursive) return pushMetrics(true);
  return;
};
