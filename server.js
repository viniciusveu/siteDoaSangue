
// Configurando o servidor
const express = require("express")
const server = express()

// Configurar o servidor para apresentar arquivos extras
server.use(express.static('public'))

// Habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

// Configurar a conexão com o BD
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5433,
    database: 'doe'
})

// Configurando o template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})

// Configurar a apresentação da pagina
server.get("/", (req, res) => {
    db.query("SELECT * FROM donors", (err, result) => {
        if (err) return res.send("Erro no banco de dados.")

        const donors = result.rows
        res.render("./index.html", { donors })
    })
})

server.post("/", (req, res) => {   //Mudar se precisar
    // pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios! ")
    }
    
    // colocar os valores dentro do banco de dados
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`
    db.query(query, [name, email, blood], (err) => {
        if (err) return res.send("erro no banco de dados.") // fluxo de erro
        return res.redirect("/")   // fluxo ideal
    })

 })

// Ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, () => {
    console.log("Servidor iniciado com nodemon.")
})

