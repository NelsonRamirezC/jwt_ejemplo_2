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

        const token = jwt.sign({ 
            data: usuario, 
            exp: Math.floor(Date.now() / 1000) + 30
        }, SECRETO);
        req.token = token;
        next();
    } catch (error) {
        return res.status(500).json({code: 500, message: "ha fallado la autenticación."})
    }
}

module.exports = {
    generarToken
}