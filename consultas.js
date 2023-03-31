const {Pool }= require('pg');
const bcrypt = require('bcrypt');

const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "node",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_DATABASE|| "autenticacion_db",
    port: process.env.DB_PORT || 5432
}

const pool = new Pool(config);

const registroUsuario = async(nombre, email, password) => {
    const salt = await bcrypt.genSalt(10)
    const cryptedPassword = await bcrypt.hash(password, salt) 

    let consulta = "INSERT INTO usuarios(nombre, email, password) VALUES($1, $2, $3)"
    let resultado = await pool.query(consulta, [nombre, email, cryptedPassword]) 
    return resultado.rows[0]
}

const getUsuarioByEmailAndPassword = (email, password) => {
    return new Promise(async (resolve, reject) => {

        let consulta = "SELECT id, nombre, email, avatar, password from USUARIOS WHERE email = $1";
    let resultado = await  pool.query(consulta, [email])
    let usuario = resultado.rows[0]
    if(usuario){
        const isValid = await bcrypt.compare(password, usuario.password);
        if(isValid){
            delete usuario.password;
            console.log(usuario)
            resolve(usuario);
        }else{
            reject("Contraseña no coincide");
        }
    }else {
        reject("Usuario no existe");
    }

    })
}


module.exports= {
    registroUsuario,
    getUsuarioByEmailAndPassword 
}