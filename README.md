# Offline Service Uptime Monitoring

My plumbing does not work, I wonder if anyone else in the neighborhood has the same problem.
Electricity goes out, I wonder how far should I go to find a coffee shop that is not affected by the blackout.

This is a simple app that helps the neighborhood to spread offline service status.
You'll know where to go, service owners should know what and where to fix, we'll know how good services are maintained, everyone will be happy.

Only serving Indonesia at the moment.

## Roadmap

- [ ] Provide a way to report a service status, chatbot, twitter bot.
- [ ] Provide a webpage that displays affected areas on the map.
- [ ] Service uptime metrics

## Development

### Prerequisites

1. [Docker compose](https://docs.docker.com/compose/install/)
2. [golang-migrate](https://github.com/golang-migrate/migrate/tree/master/cmd/migrate)
3. Latest NodeJS
4. Download required geojson [here](https://mega.nz/#!2UBiSCyC!AbK-0yJdWuoKmLmcOzi_7nUofgbk1pWTb7--NGFqGx4) (~515MB)
5. [GDAL](https://gdal.org/download.html) to import required GeoJSON to PostGIS
6. **psql** cli

### Running

1. Copy `.env.example` to `.env`, modify variables if necessary
2. Run a [localtunnel](https://www.npmjs.com/package/localtunnel) (`$ lt -p 4000`) then set API_URL on the .env file with the url given by localtunnel.
3. Run local database `$ docker-compose up -d`
4. Import GeoJSON to `places` table via GDAL's ogr2ogr cli `$ ogr2ogr -f "PostgreSQL" PG:"dbname=laporin_db user=laporin password=rahasia host=localhost port=5432" "~/path/to/gadm36_IDN_4.json" -nln places`
5. Run migrations `$ migrate -path migrations -database "postgres://laporin:rahasia@localhost:5432/laporin_db?sslmode=disable" up`
6. Import cities database; login via **psql** then run `\copy cities (city,lat,lng,country,iso2,admin,capital,population,population_proper) FROM './migrations/id-cities.csv' CSV HEADER;`
7. Run the app `$ yarn dev`
8. GraphQL & Playground will be available at http://localhost:4000/graphql

### Tests

Run `yarn test`
