const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req=request, res=response, next) => {

    const token = req.header('x-token');
    
    if( !token ){
        return res.status(401).json(
            {
                msg: "No existe token"
            }
        );
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETTOPRIVATEKEY)
        const usuarioAutenticado = await Usuario.findById( uid );
        if( !usuarioAutenticado ){
            return res.status(401).json(
                {
                    msg: "No existe usuario"
                }
            );
        }

        if( !usuarioAutenticado.estado ){
            return res.status(401).json(
                {
                    msg: "Usuario no valido - estado false"
                }
            );
        }

        req.usuarioAutenticado = usuarioAutenticado;
        
        next();
    } catch (error) {
        return res.status(401).json(
            {
                msg: "Token no valido",
                error
            }
        );
    }


    
}


module.exports = {
    validarJWT
}