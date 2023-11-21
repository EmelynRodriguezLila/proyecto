//AQUI VAN LAS RUTAS DE BUSQUUEDA localhost:3000/api/v1/episodios
const {Router} = require('express');
const { listallB, deleteEpi, ListOnly, addEpi, updateEpi} = require ('../controllers/users')


const router = Router();

router.get('/',listallB);
router.get('/:id',ListOnly);
router.put('/',addEpi);
router.patch('/:id',updateEpi)
router.delete('/:id',deleteEpi);


module.exports= router;