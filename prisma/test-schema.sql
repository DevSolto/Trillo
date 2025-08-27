CREATE TABLE usuario (
  id uuid PRIMARY KEY,
  nome varchar NOT NULL,
  funcao varchar,
  createdat timestamptz DEFAULT now(),
  updatedat timestamptz DEFAULT now()
);

CREATE TABLE associacao (
  id uuid PRIMARY KEY,
  nome varchar NOT NULL,
  cnpj varchar(14),
  cidade varchar(255),
  estado varchar(2),
  createdat timestamptz DEFAULT now(),
  updatedat timestamptz DEFAULT now()
);

CREATE TABLE status (
  id uuid PRIMARY KEY,
  nome varchar NOT NULL,
  descricao varchar,
  criadorid uuid,
  createdat timestamptz DEFAULT now(),
  updatedat timestamptz DEFAULT now()
);

CREATE TABLE tipo (
  id uuid PRIMARY KEY,
  nome varchar NOT NULL,
  descricao varchar,
  criadorid uuid,
  createdat timestamptz DEFAULT now(),
  updatedat timestamptz DEFAULT now()
);

CREATE TABLE tarefa (
  id uuid PRIMARY KEY,
  titulo varchar NOT NULL,
  descricao varchar,
  prioridade varchar,
  associacaoid uuid,
  criadorid uuid,
  responsavelid uuid,
  statusid uuid,
  tipoid uuid,
  data_inicio timestamptz,
  data_fim timestamptz,
  createdat timestamptz DEFAULT now(),
  updatedat timestamptz DEFAULT now()
);
