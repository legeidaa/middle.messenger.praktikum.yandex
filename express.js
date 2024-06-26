import express from 'express'
import path from 'path'
const __dirname = path.resolve();

const app = express()
const port = 3000

app.use(express.static('dist'));

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
