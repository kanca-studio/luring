require('dotenv').config({});
import bot, { session } from './telegram';
import db from './db';
import { genLocationUpdate, genReportServiceUpdate, genReportOfflineUpdate } from './seeds';

describe('telegram integration', () => {
  afterAll(async () => {
    await db.end();
    session.client.end(true);
  });

  it('should be able to handle updates', async () => {
    await bot.handleUpdate(genLocationUpdate());
    await bot.handleUpdate(genReportServiceUpdate());
    await bot.handleUpdate(genReportOfflineUpdate());
  });
});
