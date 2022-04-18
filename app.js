'use strict'
import compression from 'compression'
import express from 'express'
import routes from './routes'
// import helmet from 'helmet'

const app = express()

// server config
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
// app.use(helmet())
// app.use(helmet.permittedCrossDomainPolicies())
// app.use(helmet.referrerPolicy({ policy: 'same-origin' }))

// router
app.use('/', routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500).json(err)
  // res.render('error')
})

export default app
