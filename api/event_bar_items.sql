-- Tabela de itens do bar por evento (estoque e vendas)
-- Execute este script no banco antes de usar a API bar_items.php

CREATE TABLE IF NOT EXISTS event_bar_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'outros',
  unit VARCHAR(50) DEFAULT 'un',
  quantity_stock DECIMAL(12,2) NOT NULL DEFAULT 0,
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  unit_cost DECIMAL(12,2) NULL,
  quantity_sold DECIMAL(12,2) NOT NULL DEFAULT 0,
  min_stock DECIMAL(12,2) NULL,
  closed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_event_id (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
