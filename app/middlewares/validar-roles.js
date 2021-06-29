const { request, response } = require('express');


const esAdminRole = async (req=request, res=response, next) => {
    
    if( !req.usuarioAutenticado ){
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        })
    }

    const { rol, nombre } = req.usuarioAutenticado;
    if( rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `El ${nombre} no tiene rol administrador`
        })
    }
    next()
}


module.exports = {
    esAdminRole
}