const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);

const WebSocket = require('ws')
const wss = new WebSocket.Server({
    server: server
})

const bodyParser = require('body-parser')

const multer = require('multer')
const upload = multer({
    dest: 'uploads/'
})

const Mock = require('mockjs')
const mock = Mock.mock.bind(Mock)

wss.on('open', function open() {
    console.log('connected')
})

wss.on('close', function close() {
    console.log('close')
})

wss.on('connection', function connection(ws, req) {
    ws.send("connection")
    ws.on('message', function incoming(message) {
        console.log('getMessage', message)
    });

});

app.use(bodyParser.urlencoded({
    extended: true
}))
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8")
    next()
});

app.get('/api/test', (req, res) => {
    let data = mock({
        'dataSource|5': [{
            'key|+1': 1,
            'mockTitle|1': ['哑巴', 'Butter-fly', '肆无忌惮', '摩天大楼', '初学者'],
            'mockContent|1': ['你翻译不了我的声响', '数码宝贝主题曲', '摩天大楼太稀有', '像海浪撞破了山丘'],
            'mockAction|1': ['下载', '试听', '喜欢']
        }]
    })
    res.send(data)
})
//upload
app.post('/api/posts', upload.single('map'), (req, res) => {
    let file = req.file;
    file.name
    console.log(file);
    res.json({
        message: "ok"
    });
})
app.get('/api/gets/:id', upload.single('map'), (req, res) => {
    let imgid = req.params.id;
    let file = path.join(__dirname, '../../../uploads/' + imgid);
    console.log(file);
    res.download(file);

})

app.get('/', function (req, res) {
    res.send('Hello World!');
});

server.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});