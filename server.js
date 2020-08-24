
//Usei express p criar e configur meu servidor
const express = require("express")
const server = express()

const db= require("./db")

/* 
const ideas = [
    {
        img: "https://image.flaticon.com/icons/svg/950/950018.svg", 
        title: "Cursos de Programação",
        category: "Estudo",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
        url: "http://google.com.br"
    },

    {
        img: "https://image.flaticon.com/icons/svg/661/661929.svg", 
        title: "Exercícios",
        category: "saude",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
        url: "http://google.com.br"
    },

    {
        img: "https://image.flaticon.com/icons/svg/3048/3048374.svg", 
        title: "Meditação",
        category: "Mentalidade",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
        url: "http://google.com.br"
    },

    {
        img: "https://image.flaticon.com/icons/svg/1830/1830839.svg", 
        title: "Cozinhar",
        category: "Diversão em Família",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
        url: "http://google.com.br"
    },
] */

//Configurar arquivos estaticos (css,scripts,img)
// P/ nao precisar ficar com os arquivos na pasta raiz


server.use(express.static("public"))

//habilitar uso do req.body
server.use(express.urlencoded({  extended:true }))

//config nunjcuks

const nunjucks = require("nunjucks")
nunjucks.configure("views",{
    express: server,
    noCache: true,
})

//criei uma rota '/'
//e capturo o pedido do cliente para responder

//Regra de negócio
server.get("/",function(req, res){


    db.all(`SELECT * FROM ideas`, function(err,rows){
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        const reverseIdeas = [...rows].reverse()
    
    let lastIdeas = []
        for (let idea of reverseIdeas){
             if(lastIdeas.length < 2){
                  lastIdeas.push(idea)
             }
        }
    

    return res.render("index.html", { ideas: lastIdeas })
    })


    

})


server.get("/ideias", function(req, res){

    

    db.all(`SELECT * FROM ideas`, function(err,rows){
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }
        
        const reverseIdeas = [...rows].reverse()
    
        return res.render("ideias.html", { ideas: reverseIdeas })

    })


})

server.post("/", function(req,res){

    //inserindo dados
     const query = `
            INSERT INTO ideas(
                image,
                title,
                category,
                description,
                link
            ) VALUES (?,?,?,?,?);
            ` 


    const values = [
           req.body.image,
           req.body.title,
           req.body.category,
           req.body.description,
           req.body.link,

    ]
    db.run(query, values, function(err){
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        return res.redirect("/ideias")
    })

    
})
//liguei servidor na porta 3000
server.listen(3000)



