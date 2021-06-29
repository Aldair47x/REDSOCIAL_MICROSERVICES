const { Mensaje, Usuario } = require('../models');
const Role = require('../models/role');


const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id del usuario  no existe ${ id }`);
    }
}


const existeMensajePorId = async( id ) => {

    
    const existeMensaje = await Mensaje.findById(id);
    if ( !existeMensaje ) {
        throw new Error(`El id del mensaje no existe ${ id }`);
    }
}

const estadoMensajePorId = async( id ) => {

    
    const existeMensaje = await Mensaje.findById(id);
    console.log(existeMensaje, "hola");
    if ( !existeMensaje.estado ) {
        throw new Error(`El estado del mensaje no esta activo para el id: ${ id }`);
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeMensajePorId,
    estadoMensajePorId
}

