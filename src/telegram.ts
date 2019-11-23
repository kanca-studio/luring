import Telegraf, { ContextMessageUpdate, Markup } from 'telegraf';
import RedisSession from 'telegraf-session-redis';
import sql from 'sql-tag';
import db from './db';
import { Reporter, Point, ServiceStatus } from './generated/graphql';
import uuid from 'uuid';

export const session = new RedisSession({
  store: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

enum ConversationContextKinds {
  Report = 'Report',
  Resolve = 'Resolve',
}

type ReportConversationContext = {
  kind: ConversationContextKinds.Report;
  location?: Point;
  serviceID?: string;
  status?: ServiceStatus;
};

type ResolveConversationContext = {
  kind: ConversationContextKinds.Resolve;
  reportID: string;
};

type ConversationContext =
  | ReportConversationContext
  | ResolveConversationContext;

const bot = new Telegraf<
  ContextMessageUpdate & {
    session: {
      conversation?: ConversationContext;
    };
  }
>(process.env.TELEGRAM_TOKEN);

const getReporter = async (ctx: ContextMessageUpdate): Promise<Reporter> => {
  const GET_QUERY = sql`SELECT * FROM reporter WHERE telegram_id=${ctx.from.id}`;
  const { rows } = await db.query<Reporter>(GET_QUERY);
  const reporter = rows[0];
  if (reporter) return reporter;
  const INSERT_QUERY = sql`INSERT INTO reporter(id, telegram_id, name) VALUES (${uuid.v4()}, ${
    ctx.from.id
  }, ${ctx.from.first_name})`;
  await db.query(INSERT_QUERY);
  return getReporter(ctx);
};

bot.use(session.middleware());

bot.command('report', async ctx => {
  if (!ctx.session.conversation)
    ctx.session.conversation = { kind: ConversationContextKinds.Report };

  if (process.env.NODE_ENV === 'test') return; // don't send anything during test
  ctx.reply(
    'Where are you now?',
    Markup.keyboard([Markup.locationRequestButton('Send current location')])
      .resize()
      .extra()
  );
});

bot.on('location', async ctx => {
  if (!ctx.session.conversation)
    ctx.session.conversation = { kind: ConversationContextKinds.Report };
  if (ctx.session.conversation.kind === ConversationContextKinds.Report) {
    ctx.session.conversation.location = {
      lat: ctx.message.location.latitude,
      lon: ctx.message.location.longitude,
    };
    const { rows } = await db.query<{ id: string; name: string }>(
      sql`SELECT id, name FROM service LIMIT 5`
    );
    if (process.env.NODE_ENV === 'test') return; // don't send anything during test
    ctx.reply(
      'Which service do you want to report?',
      Markup.inlineKeyboard(
        rows.map(row => Markup.callbackButton(row.name, `service-${row.id}`))
      )
        .resize()
        .extra()
    );
  }
});

bot.action(/service-*/i, async ctx => {
  const serviceID = ctx.callbackQuery.data.replace('service-', '');
  if (!ctx.session.conversation) return;
  if (ctx.session.conversation.kind === ConversationContextKinds.Report) {
    ctx.session.conversation.serviceID = serviceID;
  }
  const { rows } = await db.query<{ id: string; name: string }>(
    sql`SELECT id, name FROM service LIMIT 5`
  );
  if (process.env.NODE_ENV === 'test') return; // don't send anything during test
  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup(
    Markup.inlineKeyboard(
      rows.map(row =>
        Markup.callbackButton(
          serviceID === row.id ? `✅ ${row.name}` : row.name,
          `service-${row.id}`
        )
      )
    )
  );
  ctx.reply(
    'Is it offline?',
    Markup.keyboard([
      Markup.callbackButton('Offline', 'Offline'),
      Markup.callbackButton('Online', 'Online'),
      Markup.callbackButton('Abort Report', 'Abort Report'),
    ])
      .resize()
      .extra()
  );
});

bot.hears(['Offline', 'Online'], async ctx => {
  const reporter = await getReporter(ctx);
  if (
    !ctx.session.conversation ||
    ctx.session.conversation.kind !== ConversationContextKinds.Report
  )
    return;
  const { location, serviceID } = ctx.session.conversation;
  if (!location || !serviceID) return;
  const INSERT_QUERY = sql`INSERT INTO service_status_report (id, service_status, reporter_id, service_id, location) VALUES (${uuid.v4()}, ${
    ctx.message.text
  }, ${
    reporter.id
  }, ${serviceID}, ST_GeomFromText(${`POINT(${location.lon} ${location.lat})`}, 4326))`;
  await db.query(INSERT_QUERY);
  const { rows } = await db.query<{ name: string }>(
    sql`SELECT name FROM service WHERE id=${serviceID}`
  );
  const service = rows[0];
  if (!service) return;
  if (process.env.NODE_ENV === 'test') return; // don't send anything during test
  ctx.reply(
    `You reported that ${service.name} is currently ${ctx.message.text} at your location, thank you`,
    // @ts-ignore removeKeyboard should accept true
    Markup.removeKeyboard(true).extra()
  );
});

bot.hears('Abort Report', async ctx => {
  ctx.session.conversation = undefined;
  if (process.env.NODE_ENV === 'test') return; // don't send anything during test
  ctx.reply(
    'Report aborted, thank you',
    // @ts-ignore removeKeyboard should accept true
    Markup.removeKeyboard(true).extra()
  );
});

export default bot;
