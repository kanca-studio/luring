CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  city VARCHAR(50) NOT NULL,
  lat DECIMAL(9, 6) NOT NULL,
  lng DECIMAL(9, 6) NOT NULL,
  country VARCHAR(50) NOT NULL,
  iso2 VARCHAR(50) NOT NULL,
  admin VARCHAR(50),
  capital VARCHAR(50),
  population INTEGER,
  population_proper INTEGER
);
