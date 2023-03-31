const jwt = require('jsonwebtoken');
const {getUsuarioByEmailAndPassword } = require("../consultas.js")

const SECRETO = process.env.SECRETO || "estoesunsecreto"


const generarToken = async (req, res, next) => {

    try {
        let {email, password} = req.body
        let usuario = await getUsuarioByEmailAndPassword(email, password);

        if(!usuario){
            return res.status(401).json({code: 401, message: "Debe proporcionar un usuario válido."})
        }

        let horas = 1 //cantidad de horas que dura el token antes de expirar
        const token = jwt.sign({ 
            data: usuario, 
            exp: Math.floor(Date.now() / 1000) + horas * (60*60) 
        }, SECRETO);
        req.token = token;
        next();
    } catch (error) {
        return res.status(500).json({code: 500, message: "ha fallado la autenticación."})
    }
}


const validarToken = (req, res, next) => {
    let token;
    
    const bearerHeader = req.headers['authorization'];
    if(!bearerHeader){
        token = req.query.token;
        if(!token){
            return res.status(401).json({code:401, message:"Debe proporcionar un token."})
        }
    }else {
        token = bearerHeader.split(" ")[1]
        console.log(token)
    }

    //verificamos el token que llego

    jwt.verify(token, SECRETO, (error, data) => {
        if(error){
            console.log(error)
            return res.status(403).json({code:403, message:"Usted no tiene permisos para ingresar."})
        }else{
            req.usuario = data;
            next();
        }
    })
}

module.exports = {
    generarToken,
    validarToken 
}