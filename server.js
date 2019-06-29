
const express = require("express")

const app = express()

const http = require("http")

const server = http.createServer(app)

const io = require("socket.io")(server)

//3030 may not be available on any other server, hence if 3030 is not availabe default port will be taken
const port = process.env.port || 3030;

//Static folder to keep all static files
app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

io.on("connection", (client) => {
    console.log("Connected -----!!!")

    //along with conenction we emit our own event and suply data to that event
    client.emit("acknowledge", { message: "connection established" })

    client.on("MsgToServer", (chatterName, message) => {
        console.log(chatterName + " says : " + message);
        client.emit("MsgToClient", 'Me', message);
        client.broadcast.emit("MsgToClient", chatterName, message);
    })


})

server.listen(port, () => {
    console.log("Socket server started at port :" + port)
})