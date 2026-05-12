-- ============================================================
-- Módulo: Pesquisas de Satisfação
-- ============================================================

-- Pesquisas vinculadas a eventos
CREATE TABLE IF NOT EXISTS satisfaction_surveys (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  event_id        INT          NOT NULL,
  title           VARCHAR(255) NOT NULL,
  description     TEXT         DEFAULT NULL,
  slug            VARCHAR(255) NOT NULL UNIQUE,
  hero_image_url  TEXT         DEFAULT NULL,
  status          ENUM('rascunho','publicada','encerrada') NOT NULL DEFAULT 'rascunho',
  created_by      INT          DEFAULT NULL,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ss_event (event_id),
  INDEX idx_ss_status (status),
  INDEX idx_ss_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Perguntas da pesquisa
CREATE TABLE IF NOT EXISTS satisfaction_survey_questions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  survey_id    INT          NOT NULL,
  text         TEXT         NOT NULL,
  type         ENUM('nota','texto','multipla_escolha','sim_nao','nps') NOT NULL DEFAULT 'nota',
  options      TEXT         DEFAULT NULL,   -- JSON array para multipla_escolha
  required     TINYINT(1)   NOT NULL DEFAULT 1,
  display_order INT          NOT NULL DEFAULT 0,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ssq_survey (survey_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cada envio (um respondente = um registro)
CREATE TABLE IF NOT EXISTS satisfaction_survey_responses (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  survey_id   INT      NOT NULL,
  respondent_token VARCHAR(64) DEFAULT NULL,
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ssr_survey (survey_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Respostas por pergunta dentro de um envio
CREATE TABLE IF NOT EXISTS satisfaction_survey_answers (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  response_id  INT  NOT NULL,
  question_id  INT  NOT NULL,
  answer       TEXT DEFAULT NULL,
  INDEX idx_ssa_response (response_id),
  INDEX idx_ssa_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
