CREATE TABLE tipos_pratos (
    id INTEGER PRIMARY KEY
AUTOINCREMENT,
    tipo TEXT NOT NULL
);
CREATE TABLE pratos(
     id INTEGER PRIMARY KEY
AUTOINCREMENT,
    nome text NOT NULL,
    tipo_prato TEXT,
    valor REAL NOT NULL
);