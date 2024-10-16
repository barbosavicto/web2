const http = require('http');
const fs = require('fs');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();

const server = http.createServer(function (req, res) {
    const q = url.parse(req.url, true);
    const nomearquivo = "." + q.pathname;

    if (nomearquivo === "./") {
        fs.readFile("formulario.html", function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end("404 Arquivo não encontrado!");
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        });
    } else if (nomearquivo === "./formulario.html") {
        fs.readFile(nomearquivo, function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end("404 Arquivo não encontrado!");
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        });
    } else if (nomearquivo === "./registra") {
        let nome = q.query.nome;
        let tipo_prato = q.query.tipo_prato;
        let valor = q.query.valor;

        let db = new sqlite3.Database('./db/restaurante.db', (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Conectou com o banco de dados!');
        });

        db.run(`INSERT INTO restaurante(nome, tipo_prato, valor) VALUES(?, ?, ?)`, [nome, tipo_prato, valor], function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`Registro feito com sucesso no id ${this.lastID}`);
        });

        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Fechou a conexão com o banco de dados!');
        });

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write("<p>Registro efetuado com sucesso!</p>");
        res.write("<p><a href='/'>Voltar</a></p>");
        return res.end();
    } else if (nomearquivo === "./ver_restaurante") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write("<html><head><meta charset='UTF-8'><title>Usuários</title></head><body>");
        res.write("<h1>Usuários Cadastrados</h1>");

        let db = new sqlite3.Database('./banco.db/restaurante.sql', (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Conectou com o banco de dados!');
        });

        db.all(`SELECT * FROM restaurante`, [], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            res.write("<table border='1'>");
            res.write("<tr><th>Nome</th><th>Tipo Prato</th><th>Valor</th></tr>");
            rows.forEach((row) => {
                res.write(`<tr><td>${row.nome}</td><td>${row.tipo_prato}</td><td>${row.valor}</td></tr>`);
            });
            res.write("</table>");
            res.write("<p><a href='/'>Voltar</a></p>");
            res.write("</body></html>");
            return res.end();
        });

        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Fechou a conexão com o banco de dados!');
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end("404 Página não encontrada!");
    }
});

server.listen(8080, () => {
    console.log("O servidor foi iniciado na porta 8080");
});
