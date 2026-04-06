const express = require('express');
const routes = require('./routes');
const cors=require('cors')
const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',  // your Vite frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,               // enable if using cookies/auth headers
};
    
// CORS must be registered before routes
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', routes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});