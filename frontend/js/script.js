const login = document.querySelector('.login')
const loginForm = login.querySelector('.form_login')
const loginInput = login.querySelector('.login_button')

const chat = document.querySelector('.chat')
const chatForm = chat.querySelector('.form_chat')
const chatInput = chat.querySelector('.chat_button')
const chatMessage = chat.querySelector('.chat_messages')

const colors = [
    'cadetcolor',
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id: '', name: '', color: '' }

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement('div')

    div.classList.add('message-self')
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement('div')
    const span = document.createElement('span')

    div.classList.add('message-outro')

    span.classList.add('message-sender')
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const getRandomColor = () => {
    const radomIndex = Math.floor(Math.random() * colors.length)
    return colors[radomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data)

    const message =
        userId == user.id 
            ? createMessageSelfElement(content)
            : createMessageOtherElement(content, userName, userColor)

    chatMessage.appendChild(message)

    scrollScreen()
}

const handleLogin = (Event) => {
    Event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("ws://localhost:5500")
    websocket.onmessage = processMessage
}

const sendMessage = (Event) => {
    Event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}

loginForm.addEventListener('submit', handleLogin)
chatForm.addEventListener('submit', sendMessage)