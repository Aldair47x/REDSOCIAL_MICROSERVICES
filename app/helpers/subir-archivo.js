const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'] , carpeta = '') => {

    return new Promise( (resolve, reject) => {

        let sampleFile;
        let uploadPath;
        
    
        
    
        sampleFile = files.archivo;
    
        const [extension] = sampleFile.name.split('.').slice(-1);
    
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extencion ${extension} no se encuentra permitida, solo las extensiones ${extensionesValidas}`);
        }
    
        const nombreTmp = `${uuidv4()}.${extension}`
    
    
        uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTmp);
    
        
    
        sampleFile.mv(uploadPath, function(err) {
          if (err) {
            console.error(err);
            return reject(err);
          }
          
          resolve(nombreTmp);
          
        });
    })


}


module.exports = {
    subirArchivo
}