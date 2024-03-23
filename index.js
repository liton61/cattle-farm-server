const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is Ready !')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})