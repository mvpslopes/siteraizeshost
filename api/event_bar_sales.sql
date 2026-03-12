-- Lançamentos de vendas do bar por evento (uma venda = um registro)
-- Execute este script no banco antes de usar a API bar_sales.php
-- Estoque atual do produto = quantity_stock (em event_bar_items) - SUM(quantity) das vendas do item

CREATE TABLE IF NOT EXISTS event_bar_sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  bar_item_id INT NOT NULL,
  quantity DECIMAL(12,2) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  sold_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_event_id (event_id),
  INDEX idx_bar_item_id (bar_item_id),
  INDEX idx_sold_at (sold_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
