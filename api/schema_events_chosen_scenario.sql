-- Vincular evento ao cenário escolhido para gestão (pagamentos/datas).
-- Execute no MySQL uma vez. Se a coluna já existir, ignore o erro.

ALTER TABLE events
ADD COLUMN chosen_scenario_id INT NULL;
