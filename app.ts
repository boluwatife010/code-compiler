import express from 'express'
import bodyParser from 'body-parser'
import compileRouter from './src/routes/compileroute'
import cors from 'cors'

const server = express()
server.use(cors())
server.use(bodyParser.json())
server.use('/api', compileRouter)
server.listen(5000, () => console.log('Server is running at port 5000.'))