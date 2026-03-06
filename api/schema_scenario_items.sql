-- Tabela de valor previsto por item por cenário (comparativo).
-- Execute no MySQL se ainda não existir.
-- Sem FOREIGN KEY para evitar erro 150 (tipos/engine das tabelas referenciadas podem diferir).

CREATE TABLE IF NOT EXISTS event_scenario_items (
  scenario_id INT NOT NULL,
  financial_item_id INT NOT NULL,
  expected_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (scenario_id, financial_item_id)
);
