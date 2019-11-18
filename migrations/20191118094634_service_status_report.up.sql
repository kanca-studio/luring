CREATE TABLE IF NOT EXISTS service_status_report (
    id UUID PRIMARY KEY,
    service_status VARCHAR(20) NOT NULL,
    reported_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reporter_id UUID NOT NULL REFERENCES reporter(id),
    service_id varchar(15) NOT NULL REFERENCES service(id),
    resolving_report_id UUID REFERENCES service_status_report(id)
);

SELECT
    AddGeometryColumn(
        'service_status_report',
        'location',
        4326,
        'POINT',
        2
    );