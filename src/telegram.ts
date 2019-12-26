import Telegraf, { ContextMessageUpdate, Markup } from 'telegraf';
import RedisSession from 'telegraf-session-redis';
import sql from 'sql-tag';
import db from './db';
import { Reporter, Point, ServiceStatus } from './generated/graphql';
import uuid from 'uuid';
import { gauge } from './prometheus';
import {
  genLocationUpdate,
  genReportServiceUpdate,
  genReportOfflineUpdate,
} from './seeds';

const shouldAbort = () =>
  process.env.NODE_ENV === 'test' ||
  process.env.GENERATE_RANDOM_UPDATES === '1';

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
    if (shouldAbort) return; // don't send anything during test
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
  if (shouldAbort) return; // don't send anything during test
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
  const reportId = uuid.v4();
  const INSERT_QUERY = sql`INSERT INTO service_status_report (id, service_status, reporter_id, service_id, location) VALUES (${reportId}, ${
    ctx.message.text
  }, ${
    reporter.id
  }, ${serviceID}, ST_GeomFromText(${`POINT(${location.lon} ${location.lat})`}, 4326))`;
  await db.query(INSERT_QUERY);
  const { rows: reportRows } = await db.query<{
    name_0: string;
    name_1: string;
    name_2: string;
    name_3: string;
    name_4: string;
    service_name: string;
    service_status: string;
    place_id: number;
    report_id: string;
  }>(
    sql`
      SELECT
        p.name_0, p.name_1, p.name_2, p.name_3, p.name_4, p.ogc_fid as place_id, ssr.service_status, ssr.id AS report_id, s.name AS service_name
      FROM
        places AS p, service_status_report AS ssr, service AS s
      WHERE
        ST_Contains(p.wkb_geometry, ssr.location) AND
        ssr.service_id=s.id AND
        ssr.id=${reportId}
    `
  );
  const report = reportRows[0];
  if (!report) return;
  const labeledGauge = gauge.labels(
    report.name_0,
    report.name_1,
    report.name_2,
    report.name_3,
    report.name_4
  );
  if (report.service_status === 'Offline') labeledGauge.inc(1);
  else labeledGauge.dec(1);

  if (shouldAbort) return; // don't send anything during test

  ctx.reply(
    `You reported that ${report.service_name} is currently ${ctx.message.text} at your location, thank you`,
    // @ts-ignore removeKeyboard should accept true
    Markup.removeKeyboard(true).extra()
  );
});

bot.hears('Abort Report', async ctx => {
  ctx.session.conversation = undefined;
  if (shouldAbort) return; // don't send anything during test
  ctx.reply(
    'Report aborted, thank you',
    // @ts-ignore removeKeyboard should accept true
    Markup.removeKeyboard(true).extra()
  );
});

const genRandomUpdate = async () => {
  await bot.handleUpdate(genLocationUpdate());
  await bot.handleUpdate(genReportServiceUpdate());
  await bot.handleUpdate(genReportOfflineUpdate());
  await new Promise(resolve => {
    setTimeout(() => resolve(), 1000);
  });
  return genRandomUpdate();
};

if (process.env.GENERATE_RANDOM_UPDATES === '1') {
  genRandomUpdate();
}

export default bot;
