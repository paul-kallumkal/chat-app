const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const messages = require('./utils/messages')
const users = require('./utils/users')

const app = express()  
const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT
const pubdir = path.join(__dirname,'../public')

app.use(express.static(pubdir))

io.on('connection', (socket) =>{

    socket.on('join', ({username, room}, callback) => {

        const {user, error} = users.add({id:socket.id, username,room})
        if(error) { 
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('worldMessage', messages.generateMessage("System",'Welcome!')) 
        socket.broadcast.to(user.room).emit('worldMessage', messages.generateMessage("System", `${user.username} has joined`))
        io.to(user.room).emit('roomStatus',{
            room: user.room,
            users: users.roomUsers(user.room)
        })

        callback()
    })
    
    
    socket.on('sendMessage', (c,confirm) => { 
        const user = users.getUser(socket.id)
        if(!user){
            return confirm('Error')
        }

        if(new Filter().isProfane(c)){
            return confirm('Your message was not sent. Profanity filter is active!')
        }

        io.to(user.room).emit('worldMessage', messages.generateMessage(user.username,c)) 
        return confirm('Message delivered')
    })
 
    socket.on('disconnect', () => {
        const user = users.remove(socket.id)

        if(user)
        {
            io.to(user.room).emit('worldMessage', messages.generateMessage("System",`${user.username} has left`))
            io.to(user.room).emit('roomStatus',{
                room: user.room,
                users: users.roomUsers(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log('server up on port', port)
})
