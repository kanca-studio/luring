# Offline Service Uptime Monitoring

My plumbing does not work, I wonder if anyone else in the neighborhood has the same problem.
Electricity goes out, I wonder how far should I go to find a coffee shop that is not affected by the blackout.

This is a simple app that helps the neighborhood to spread offline service status.
You'll know where to go, service owners should know what and where to fix, we'll know how good services are maintained, everyone will be happy.

## Roadmap

- [ ] Provide a way to report a service status, chatbot, twitter bot.
- [ ] Provide a webpage that displays affected areas on the map.
- [ ] Service uptime metrics

## Development

### Prerequisites
1. [Docker compose](https://docs.docker.com/compose/install/)
2. [golang-migrate](https://github.com/golang-migrate/migrate/tree/master/cmd/migrate)
3. Latest NodeJS

### Running
1. Copy `.env.example` to `.env`, modify variables if necessary
2. Run local database `$ docker-compose up -d`
3. Run migrations `$ migrate -path migrations -database "postgres://laporin:rahasia@localhost:5432/laporin_db?sslmode=disable" up`
4. Run the app `$ yarn dev`
5. GraphQL & Playground will be available at http://localhost:4000/graphql

### Unit Tests
TBD
