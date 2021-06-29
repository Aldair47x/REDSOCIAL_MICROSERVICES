const { Schema, model } = require('mongoose');

const MensajeSchema = Schema({
    contenido: {
        type: String,
        required: [true, 'El contenido es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        required: true,
        default: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});


module.exports = model( 'Mensaje', MensajeSchema );
