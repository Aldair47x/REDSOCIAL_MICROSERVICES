const { response, request } = require('express');
const { Usuario, Mensaje, Role } = require('../models/index');






// Obtener todos los mensajes - pagina - total - populate
const getAllMessages = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, mensajes ] = await Promise.all([
        Mensaje.countDocuments(query),
        Mensaje.find(query)
        .populate('usuario', "contenido")
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        mensajes
    });
    
}

// Obtener mensaje por id
const getMessage = async(req = request, res = response) => {

    const { id } = req.params;
    const mensaje = await Mensaje.findById( id );

    res.json(mensaje);
    
}


// Crear mensaje - privado - cualquier persona con token valido
const createMessage = async(req = request, res = response) => {

    const contenido = req.body.contenido;

    const mensajeDB = await Mensaje.findOne({ contenido });

    if(mensajeDB){
        return res.status(400).json({
            msg: `El mensaje ${ mensajeDB.contenido } ya existe`
        })
    }

    // Generar la data a guardar
    
    const data = {
        contenido,
        usuario: req.usuarioAutenticado._id
    }

    

    const mensaje = new Mensaje( data );

    //Guardar DB

    await mensaje.save();

    res.status(201).json(mensaje);
    
}

// actualizar - privado - cualquier persona con token valido
const updateMessage = async(req = request, res = response) => {

    const { id } = req.params;
    const contenido = req.body.contenido;
    const mensajeDB = await Mensaje.findOne({ contenido });

    console.log(contenido);

    if(mensajeDB){
        return res.status(400).json({
            msg: `El mensaje ${ mensajeDB.contenido } ya existe`
        })
    }


    const mensaje = await Mensaje.findByIdAndUpdate(id, {contenido});
    res.json(mensaje);

}


// Borrar mensaje (estado false) - privado - cualquier persona con token valido - admin role
const deleteMessage = async(req = request, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const mensaje = await Mensaje.findByIdAndUpdate( id, { estado: false } );
    const usuarioAutenticado = req.usuarioAutenticado;


    res.json({
        mensaje,
        usuarioAutenticado
    });
    
    
}


module.exports = {
    getAllMessages,
    getMessage,
    createMessage,
    updateMessage,
    deleteMessage
}