import { getAllE, insertE, getEById, updateE, deleteE} from "../controller/EspecialidadesController.js";
import express from 'express'

const router = express.Router()

router.get('/', getAllE)
router.post('/', insertE)

router.get('/:id', getEById)
router.put('/:id', updateE)
router.delete('/:id', deleteE)


export default router