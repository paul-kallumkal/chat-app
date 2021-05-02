const socket = io()

const $messageForm = document.querySelector('#message-form')
const $message = $messageForm.querySelector('input')
const $sendButton = $messageForm.querySelector('button')
const $dynamic = document.querySelector('#message-template').innerHTML
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    const $new = $messages.lastElementChild

    const height = parseInt(getComputedStyle($new).marginBottom) + $new.offsetHeight
    const visible = $messages.offsetHeight
    const total = $messages.scrollHeight
    const scrollrange = $messages.scrollTop + visible

    if(total - height <= scrollrange){
        $messages.scrollTop = total - visible + height
    }
}

document.querySelector('#message-form').addEventListener(('submit'), (e) => {
    e.preventDefault() 

    $sendButton.setAttribute('disabled','disabled')
    socket.emit('sendMessage',$message.value, (c) => {
        console.log(c)
        $sendButton.removeAttribute('disabled')
        $message.value = ''
        $message.focus()
    })
    
})

socket.on('worldMessage', (c) => {
    console.log('New message:', c)
    const html = Mustache.render($dynamic, {
        username: c.username,
        message: c.text,
        createdAt: moment(c.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})

socket.on('roomStatus', ({room, users}) => {
    const html = Mustache.render($sidebar, {
        room,
        users
    }) 
    document.querySelector('#sidebar').innerHTML=html
})

socket.emit('join', {username, room}, (error) => {
    
})