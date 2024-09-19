const http = require('http')
const app = require('./app')

// Fonction pour normaliser le port sur lequel le serveur va écouter
const normalizePort = (val) => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

// Définit le port d'écoute du serveur, soit depuis la variable d'environnement PORT, soit par défaut 4000
const port = normalizePort(process.env.PORT || '4000')
app.set('port', port) // Stocke le port dans l'application Express

// Fonction pour gérer les erreurs du serveur
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error // Si l'erreur n'est pas liée à l'écoute du serveur, la lance de nouveau
  }
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' nécessite des privilèges élevés.')
      process.exit(1) // Quitte le processus avec un code d'erreur
      break
    case 'EADDRINUSE':
      console.error(bind + ' est déjà utilisé.')
      process.exit(1) // Quitte le processus avec un code d'erreur
      break
    default:
      throw error // Pour les autres types d'erreurs, les lance de nouveau
  }
}

const server = http.createServer(app)

server.on('error', errorHandler)

server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Écoute sur ' + bind) // Affiche sur quel port ou pipe le serveur écoute
})

server.listen(port)
