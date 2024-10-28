/* eslint-disable global-require, no-undef */
const figlet = require('figlet')
const pkg = require('../package')
const program = require('..')

function start() {
  process.stdout.write('\n')
  process.stdout.write(`${figlet.textSync(`Base API server`, { font: 'Ogre' })}\n`)
  process.stdout.write('\n')
  process.stdout.write(`Version: ${pkg.version}, Environment: ${process.env.NODE_ENV || 'default'}\n`)
  process.stdout.write('\n')
  process.stdout.write('\n')

  program
    .start()
    .then((result) => {
      program.logger.info(`BaseApi server server started`)
      program.logger.info(`Environment ${process.env.NODE_ENV || 'default'}`)
      if (result && result.url) {
        program.logger.info(`Listening for HTTP requests at ${result.url}`)
      }
    })
    .catch((err) => {
      program.logger.error(`Failed to start BaseApi server`, err)
    })
}

start()
