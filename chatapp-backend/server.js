import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import multer from 'multer'

import dotenv from 'dotenv';
dotenv.config();
//PLEASE NOTE THAT IN ORDER TO MAKE IT A REAL TIME CHAT APP PUSHER IS NEEDED WHICH DOES NOT WORK OFFLINE

// Configuring the
const app = express();
const router = express.Router();
const upload=multer({dest:'upload'});
const port = process.env.PORT || 8021;

// Mongoose model for the collection
const myModel = mongoose.model('chats', {
    message:String,
    receivername:String,
    sendername:String,
    timestamp:String,
    received:Boolean,
  });
const myUsers = mongoose.model('users', {
    name:String,
    link:String,
    numbers:Number,
    interest:String,
    organisation:String,
  });
const kanban_projects = mongoose.model('projects', {
    organisation:String,
    events:Object
  });

  const FileSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    downloadCount: {
        type: Number,
        required: true,
        default: 0
    },
})

const File = mongoose.model('file', FileSchema);
//Now we will note the Middle ware
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin",["*"]);
    res.setHeader("Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorisation");
    res.setHeader("preflightContinue", "False");
    // if (req.method === 'OPTIONS') {
    res.setHeader("Access-Control-Allow-Methods", "PUT,PATCH,GET,POST,DELETE");
    // res.json();
    // }
     next();
    });
app.use('/',router)


//Some more functions for adding files
const uploadImage = async (request, response) => {
  const fileObj = {
      path: request.file.path,
      name: request.file.originalname,
  }
  
  try {
      const file = await File.create(fileObj);
      response.status(200).json({ path: `http://localhost:8021/file/${file._id}`});
  } catch (error) {
      console.error(error.message);
      response.status(500).json({ error: error.message });
  }
}

const downloadImage = async (request, response) => {
  try {   
      const file = await File.findById(request.params.fileId);
      
      file.downloadCount++;

      await file.save();

      response.download(file.path, file.name);
  } catch (error) {
      console.error(error.message);
      response.status(500).json({ msg: error.message });
  }
}

//This is routing

router.post('/upload',upload.single('file'),uploadImage)

router.get('/file/:fileId',downloadImage);

// Get code of the chats
app.get('/chats', async (req, res) => {
    try {
      const sendername=req.query.sendername;
      const receivername=req.query.receivername;
      
      const data = await myModel.find({sendername:{$in:[sendername,receivername]},receivername:{$in:[sendername,receivername]}});
      
      res.send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving data from the database');
    }
  });
// Get code of the projects for kanban
app.get('/projects', async (req, res) => {
    try {
      // const organisation=req.body;
      const organisation=req.query.organisation;
      console.log('This is my organisation',organisation)
      const data = await kanban_projects.findOne({organisation:organisation})
      console.log(data.events)
      res.send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving data from the database');
    }
  });


//Get code of the users
app.get('/users', async (req, res) => {
    try {     
      const data = await myUsers.find();
      res.send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving data from the database');
    }
  });



// Get code of the users with parameter as name
// app.get('/users', async (req, res) => {
//     try {   
//       const name=req.query.name;  
//       const data = await myUsers.find({name:name});
//       res.send(data);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Error retrieving data from the database');
//     }
//   });
  
  //Post Code for chats
app.post('/chats', async (req, res) => {
      try {
        const dbm = req.body;
        const data = await myModel.create(dbm);
        console.log('This is the data',data)
        res.send(data);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error sending data from the database');
      }
    });
  //Post Code for user
app.post('/users', async (req, res) => {
      try {
        const dbm = req.body;
        const data = await myUsers.create(dbm);
        res.send(data);
      } catch (err) {
        
        res.status(500).send('Error sending data from the database');
      }
    });
  //Post Code for Projects
app.post('/projects', async (req, res) => {
      try {
        console.log('Server is invoked')
        const dbm = req.body; 
        console.log(dbm.organisation,'Yeeasasa---------->')
        console.log('Yessssssss',dbm.events)
        const query = { organisation:dbm.organisation};
        const update = { $set: {events:dbm.events } };
        const options={upsert:true}
        const data = await kanban_projects.findOneAndUpdate(query, update, options);
        console.log('suscess')
        res.send(data);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error sending data from the database');
      }
    });

    // File sharing 
   

    
   

  
//Now listen to the server

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    });

    //Now Connecting to the database 
const url='mongodb://localhost:27017/chatapp';
const db=mongoose.connect  (url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })  
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error(err);
    });
