const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { 
    getAllMessages, 
    getMessage, 
    updateMessage, 
    deleteMessage, 
    createMessage } = require('../controllers/mensajes');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');
const { existeMensajePorId, estadoMensajePorId } = require('../helpers/db-validators');



const router = Router();


router.get('/', [
    validarCampos
], getAllMessages);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeMensajePorId ),
    validarCampos
], getMessage );

router.post('/', [
    validarJWT,
    check('contenido', 'El contenido es obligatorio').not().isEmpty(),
    validarCampos
], createMessage);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeMensajePorId ),
    check('id').custom( estadoMensajePorId ),
    validarCampos
], updateMessage );

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeMensajePorId ),
    validarCampos
],  deleteMessage);






module.exports = router;