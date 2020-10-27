const express = require('express')
const {uuid, isUuid} = require('uuidv4')
const app = express()
const cors = require('cors')

app.use(cors())


app.use(express.json())

const repositories = []

function LogRequest (request,response,next){
    const {method,title} = request
    console.log(`METHOD:${method}`)
    return next()
}

function validateId(request,response,next){
    const {id} = request.params

    if(!isUuid(id)){
        return response.status(400).json({error:"INVALID ID"})
    }
    return next()
}

app.get('/repositories',LogRequest,(request, response) =>{
   return response.json(repositories)
})

app.post('/repositories',LogRequest,(request, response) =>{
    const {title, url,techs,likes} = request.body //request.body corpo do jason
    const repository = {id:uuid(),
    title,
    url,
    techs,
    likes:0
    }
    repositories.push(repository)

    return response.json(repository)
    
})

app.put('/repositories/:id',validateId,(request, response,next) =>{
    const {title, url, techs,likes} = request.body;
    const {id} = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id )

    if (repositoryIndex < 0 ) return response.status(400).json({Error: "The repository wasn't found"})

    const NewRepo = {
        title,
        url,
        techs,
        likes:repositories[repositoryIndex].likes
    }
    repositories[repositoryIndex] = NewRepo

    response.json(NewRepo)
    next()
})

app.delete('/repositories/:id',(request, response) =>{
    const {id} = request.params

    const repositoryIndex = repositories.findIndex(repo => repo === id )
    
    repositories.splice(repositoryIndex,1)
    return response.status(204).send()
})

app.post('repositories/:id/likes',(request,response,next) =>{
    const {id} = request.params

    const repositoryIndex = repositories.findIndex(repo => repo === id )
    if (repositoryIndex < 0 ) return response.status(400).json({Error: "The repository wasn't found"})

    repositories[repositoryIndex].likes +=1

    return response.json(repositories[repositoryIndex])

})
    
app.listen(3333, () => {
    console.log('BackEnd Started !')
})
 
module.exports = app