const path = require('path');
const fs  = require('fs');


const { response,request } = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');
const { Usuario } = require('../models');





const cargarArchivo = async (req = request, res = response) => {

    if (!req.files.archivo || !req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return;
    }

    try {

        const nombreArchivo = await subirArchivo(req.files)

        res.json({
            nombreArchivo
        })

    } catch (msg) {
        res.status(400).json({
            msg
        });
    }

}

const actualizarImagen = async (req = request, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    if( !usuario ){
        return res.status(400).json({
            msg: "No existe el usuario actualizar imagen"
        })
    }

    if ( !req.files || Object.keys(req.files).length === 0 || req.files == null ) {
        res.status(400).send('No files were uploaded.');
        return;
    }

    try {
        //limpiar imágenes previas 
        if( usuario.img ) {
            const pathImagen = path.join(__dirname, '../uploads', 'usuarios', usuario.img)
            if( fs.existsSync(pathImagen)){
                fs.unlinkSync( pathImagen );
            }
        }

        const nombreArchivo = await subirArchivo(req.files, undefined, "usuarios")

        usuario.img = nombreArchivo;

        await usuario.save();

        res.json({
            msg: "Imagen creada " + nombreArchivo
        });


    } catch (error) {
        console.error(error);
        res.status(400).json({
            error
        });
    }

}

module.exports = {
    cargarArchivo,
    actualizarImagen
}