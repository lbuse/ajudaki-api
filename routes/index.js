'use strict'
import express from 'express'
import signIn from './signin'
import signUp from './signup'
import campaign from './campaign'

const router = express.Router({ mergeParams: true })

// Define variáveis locais para uso nas rotas
// possibilitando consultar bases de dados diferentes
// com base na url, por exemplo.
const setRequestEnv = (req, res, next) => {
  req.app.locals.tokenPrivateKey = process.env.API_TOKEN_PRIVATE_KEY
  next()
}

router.use('/signin', setRequestEnv, signIn)
router.use('/signup', setRequestEnv, signUp)
router.use('/campaigns', setRequestEnv, campaign)

router.get('*', function (req, res) {
  res.status(404).send('<h1>Rota não encontrada</h1>');
});

export default router
