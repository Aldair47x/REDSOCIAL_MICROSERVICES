const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const {generarJWT} = require('../helpers/JWT');
const { googleVerify } = require('../helpers/google-verify');






const login = async(req = request, res = response) => {

    const {correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        // Si el usuario está activo

        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario no se encuentra activo - estado'
            })
        }

        // Verificar la contraseña

        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // Generar el JWT

        generarJWT( usuario.id ).then((result) => {
            res.status(200).json({
                msg: 'Usuario identificado correctamente',
                result,
                usuario
            })
        }).catch((err) => {
            res.status(400).json({
                msg: 'Usuario no identificado correctamente',
                err
            })
            
        });

        


    } catch (e){
        console.error(e);
        return res.status(500).json({
            msgError: e
        })
    }
    
}

const google = async (req = request, res = response) => {

    const { id_token } = req.body;
    
    
    try {
        
        
        const {correo, img, nombre} = await googleVerify( id_token );
    
        let usuario = await Usuario.findOne( { correo })

        if(!usuario){
            const data = {
                nombre,
                correo,
                img,
                password: ':P',
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();

        }



        if(!usuario.estado){
            res.status(401).json({
                msg: 'Usuario no autorizado',
            })
        }

        const token = await generarJWT( usuario.id )
        
        res.status(200).json({
            msg: 'Google - signIn',
            token
        
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Token de google no es valido',
            error
        
        })
    }


}

module.exports = {
    login,
    google
}