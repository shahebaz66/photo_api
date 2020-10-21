const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const ejs = require('ejs')
const app = express();


app.enable('trust proxy');

//app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(express.static(`${__dirname}/public`));

app.set('view engine', 'ejs');


//app.use(morgan('dev'));

var multer = require('multer');
var upload = multer({ dest: 'public/info/' })


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/info');
    },
    filename: function (req, file, cb) {
        if (file.fieldname == "video") {
            cb(null, `${Date.now()}.mp4`);
        } else {
            cb(null, `${Date.now()}.jpeg`);
        }

    }
});
var upload1 = multer({
    storage: storage,

    limits: {
        fieldSize: 25 * 1024 * 1024
    }
});

var EventPhotos = upload1.fields([
    {
        name: 'photo'

    },
    {
        name: 'video'

    }
]);
const Store = require('./storeModel')
app.get('/', (req, res) => {
    res.render('home')
});
//var cpUpload = upload.fields([{ name: 'photo', maxCount: 1 }])
app.post('/addphoto', EventPhotos, async (req, res) => {
    for (var photo of req.files.photo) {
        req.body.url = `https://photomeme.herokuapp.com/info/${photo.filename}`
        await Store.create(req.body)
    }

    res.redirect('/')
});

app.post('/addvideo', EventPhotos, async (req, res) => {
    for (var photo of req.files.video) {
        req.body.url = `https://photomeme.herokuapp.com/info/${photo.filename}`
        await Store.create(req.body)
    }

    res.redirect('/')
});
app.listen('3400', () => {
    console.log('connected');

})