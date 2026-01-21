import { app } from './app.js'
import { env } from './env/index.js'

// Start the server and listen on port 3333
app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running 🚀')
  })
