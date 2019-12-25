require('dotenv').config({});
import Faker from 'faker';
import bot, { session } from './telegram';
import db from './db';
import { pushMetrics } from './prometheus';

const getRandomLocation = (prefix: string) =>
  parseFloat(
    prefix +
      Array.from(Array(5).keys())
        .map(() => Faker.random.number(9))
        .join('')
  );

describe('telegram integration', () => {
  const locationUpdate = {
    update_id: 299167370,
    message: {
      message_id: 136,
      from: {
        id: 120418636,
        is_bot: false,
        first_name: 'Rizki',
        last_name: 'Romadhoni',
        username: 'rrmdn1',
        language_code: 'en',
      },
      chat: {
        id: 120418636,
        first_name: 'Rizki',
        last_name: 'Romadhoni',
        username: 'rrmdn1',
        type: 'private',
      },
      date: 1574493932,
      reply_to_message: {
        message_id: 135,
        from: {
          id: 840045632,
          is_bot: true,
          first_name: 'luring',
          username: 'LuringBot',
        },
        chat: {
          id: 120418636,
          first_name: 'Rizki',
          last_name: 'Romadhoni',
          username: 'rrmdn1',
          type: 'private',
        },
        date: 1574493929,
        text: 'Where are you now?',
      },
      location: {
        latitude: getRandomLocation('-7.8'),
        longitude: getRandomLocation('112.5'),
      },
    },
  };

  const reportServiceUpdate = {
    update_id: 299167371,
    callback_query: {
      id: '517194104705092141',
      from: {
        id: 120418636,
        is_bot: false,
        first_name: 'Rizki',
        last_name: 'Romadhoni',
        username: 'rrmdn1',
        language_code: 'en',
      },
      message: {
        message_id: 137,
        from: {
          id: 840045632,
          is_bot: true,
          first_name: 'luring',
          username: 'LuringBot',
        },
        chat: {
          id: 120418636,
          first_name: 'Rizki',
          last_name: 'Romadhoni',
          username: 'rrmdn1',
          type: 'private',
        },
        date: 1574493933,
        text: 'Which service do you want to report?',
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'PDAM', callback_data: 'service-SmkmtBhT' },
              { text: 'PLN', callback_data: 'service-243LuSST' },
              { text: 'Indihome', callback_data: 'service-IPbGxZBz' },
              { text: 'First Media', callback_data: 'service-glVzWtHr' },
              { text: 'MNC', callback_data: 'service-fRIvn-d5G' },
            ],
          ],
        },
      },
      chat_instance: '-8328593660300049431',
      data: 'service-243LuSST',
    },
  };

  const reportOfflineUpdate = {
    update_id: 299167372,
    message: {
      message_id: 139,
      from: {
        id: 120418636,
        is_bot: false,
        first_name: 'Rizki',
        last_name: 'Romadhoni',
        username: 'rrmdn1',
        language_code: 'en',
      },
      chat: {
        id: 120418636,
        first_name: 'Rizki',
        last_name: 'Romadhoni',
        username: 'rrmdn1',
        type: 'private',
      },
      date: 1574493939,
      text: 'Offline',
    },
  };

  afterAll(async () => {
    await pushMetrics();
    await db.end();
    session.client.end(true);
  });

  it('should be able to handle updates', async () => {
    await bot.handleUpdate(locationUpdate);
    await bot.handleUpdate(reportServiceUpdate);
    await bot.handleUpdate(reportOfflineUpdate);
  });
});
