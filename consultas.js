const {Pool }= require('pg');


const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "node",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_DATABASE|| "autenticacion_db",
    port: process.env.DB_PORT || 5432
}

const pool = new Pool(config);

const registroUsuario = async(nombre, email, password) => {
    let consulta = "INSERT INTO usuarios(nombre, email, password) VALUES($1, $2, $3)"
    let resultado = await pool.query(consulta, [nombre, email, password]) 
    return resultado.rows[0]
}

const getUsuarioByEmailAndPassword = async (email, password) => {
    let consulta = "SELECT id, nombre, email, avatar from USUARIOS WHERE email = $1 AND password = $2";
    let resultado = await  pool.query(consulta, [email, password])
    return resultado.rows[0]
}


module.exports= {
    registroUsuario,
    getUsuarioByEmailAndPassword 
}