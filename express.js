import express from 'express'
import path from 'path'

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const port = 3000

app.use(express.static(`${__dirname}/dist`));

app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
