const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const collection = require("./mongo")
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const cors = require("cors")


let currentMode = 'manual';

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())


wss.on('connection', (ws) => {
    // Gửi chế độ hiện tại đến client mới
    ws.send(JSON.stringify({ type: 'mode', mode: currentMode }));
  
    // Nghe các tin nhắn từ client
    ws.on('message', (message) => {
      const data = JSON.parse(message);
      if (data.type === 'mode') {
        // Cập nhật chế độ hiện tại và phát sóng nó đến tất cả các client
        currentMode = data.mode;
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'mode', mode: currentMode }));
          }
        });
      }
    });
  });

app.get("/",cors(),(req,res)=>{

})

app.post("/",async(req,res)=>{

    // thêm biến khai báo vào document ở đây
    const {servo1} = req.body
    const {servo2} = req.body
    const {servo3} = req.body
    const {servo4} = req.body
    const {mode} = req.body
    

    const data={
        // thêm khai báo vào document ở đây
        servo1:servo1,
        servo2:servo2,
        servo3:servo3,
        servo4:servo4,
        mode:mode,
    }

    await collection.insertMany([data])


})

app.listen(8000,()=>{
    console.log("port connected")
})


