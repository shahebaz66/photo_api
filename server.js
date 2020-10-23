const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
var cloudinary = require('cloudinary').v2;
var cors = require('cors')
const ejs = require('ejs');
const app = express();


app.enable('trust proxy');

//app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
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
const Store = require('./storeModel');
const { db } = require('./storeModel');
app.get('/', (req, res) => {
    res.render('home',{status:""});
});
//var cpUpload = upload.fields([{ name: 'photo', maxCount: 1 }])
cloudinary.config({ 
    cloud_name: 'dry0qotso', 
    api_key: '789945783977257', 
    api_secret: 'AqrLccgymkTKXiSYB7WkRGu5Xoo' 
  });
app.post('/addphoto', EventPhotos, async (req, res) => {
    for (var photo of req.files.photo) {
        cloudinary.uploader.upload(photo.path,async function(error, result) {
            req.body.url=result.secure_url
            //console.log(result, error)
            await Store.create(req.body)
        });
        
        
    }

    res.render('home',{status:"photo uploaded"});
});

app.post('/addvideo', EventPhotos, async (req, res) => {
    //console.log(req.body);
    for (var photo of req.files.video) {
        cloudinary.uploader.upload(photo.path,{resource_type: "video"},async function(error, result) {
            
            req.body.url = result.secure_url
        await Store.create(req.body)
        });
        
    }

    res.render('home',{status:"video uploaded"});
});

app.get('/allphoto',async (req,res)=>{
    const data=await Store.find({type:'photo'});
    res.status(200).json({data:data})
});
app.get('/allvideo',async (req,res)=>{
    const data=await Store.find({type:'video'});
    res.status(200).json({data:data})
});

app.get('/getPhoto',async (req,res)=>{
    const data=await Store.find({type:'photo'});
    res.render('post',{status:data});
});
app.get('/getVideo',async (req,res)=>{
    const data=await Store.find({type:'video'});
    res.render('video',{status:data});
});
var port=process.env.PORT||3400
app.listen(port, () => {
    console.log('connected');

})
