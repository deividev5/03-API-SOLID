import {app} from './app.js';

// Start the server and listen on port 3333
app.listen({
    host: '0.0.0.0',
    port: 3333,
}).then(() => {
    console.log('HTTP server running 🚀');
})