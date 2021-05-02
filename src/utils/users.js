const users = []

const add = ({id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return{
            error: 'Username and room are required!'
        }
    }

    const existing = users.find((user) => {
        return user.room === room & user.username === username
    })

    if(existing) {
        return{
            error: 'Username has already been used'
        }
    }

    const user = {id , username, room}
    users.push(user)
    return { user }
}

const remove = (id) => {
    const index = users.findIndex((user) => user.id == id)

    if (index !== -1) {
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id == id)
}

const roomUsers = (room) => {
    return users.filter((user) => user.room == room)
}

module.exports = {
    add,
    remove,
    getUser,
    roomUsers
}