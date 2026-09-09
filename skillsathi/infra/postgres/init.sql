-- infra/postgres/init.sql
-- Optional: seed some schemes for demo
CREATE TABLE IF NOT EXISTS schemes (
  id serial PRIMARY KEY,
  code text UNIQUE,
  title text,
  description text,
  eligibility text,
  source_url text
);

INSERT INTO schemes (code, title, description) VALUES
('PMKVY-1', 'PMKVY Short Term Training', 'Short term skill training', '10th pass', 'https://pmkvyofficial'),
('NAPS-1', 'NAPS Apprenticeship', 'Apprenticeship program', '8th pass', 'https://naps.gov.in')
ON CONFLICT DO NOTHING;
