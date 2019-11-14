import Faker from 'faker';
import { Resolvers } from './generated/graphql';
import { JwtPayload } from './auth';

type Context = {
  visitor: JwtPayload;
};

const resolvers: Resolvers<Context> = {
  Reporter: {
    id: () => Faker.random.uuid(),
    name: () => Faker.name.findName(),
    phone: () => Faker.phone.phoneNumber(),
  },
  Service: {
    id: () => Faker.random.uuid(),
    name: () => Faker.company.companyName(),
  },
  Query: {
    serviceUptimePolygon: () =>
      Array.from(Array(10).keys()).map(() => ({
        lat: parseFloat(Faker.address.latitude()),
        lon: parseFloat(Faker.address.longitude()),
      })),
  },
  Mutation: {
    reportServiceStatus: (_, args) => ({
      id: Faker.random.uuid(),
      location: args.location,
      reporter: {
        id: Faker.random.uuid(),
        name: Faker.name.findName(),
        phone: Faker.phone.phoneNumber(),
      },
      reportedAt: new Date().valueOf(),
      service: {
        id: args.serviceID,
        name: Faker.company.companyName(),
      },
      status: args.status,
    }),
  },
};

export default resolvers;
