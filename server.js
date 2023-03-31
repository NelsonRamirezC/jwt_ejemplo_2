const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const {registroUsuario} = require("./consultas.js")
const { generarToken, validarToken } = require("./middlewares/jwt.js")


const app = express();


const hbs = create({
	partialsDir: [
		"views/partials/",
	],
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));


//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/public", express.static("public"))
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"))

//VISTAS
app.get("/", (req, res) => {
    res.render("home")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/registro", (req, res) => {
    res.render("registro")
})

app.get("/secreto", validarToken, (req, res) => {
    res.render("secreto")
})


//ENDPOINTS

app.post("/api/registro", async (req, res) => {
    try {
        let {nombre, email, password } = req.body;
        await registroUsuario(nombre, email, password)
        res.status(201).json({code: 201, message:"Usuario registrado con éxito."})
    } catch (error) {
        res.status(500).json({code: 500, message:"Ha fallado el intento de registro."})
    }
})

app.post("/api/login", generarToken, async (req, res) =>{
    res.status(200).json({code: 200, token: req.token})
})

app.listen(process.env.PORT || 3000, () => console.log("http://localhost:3000"))