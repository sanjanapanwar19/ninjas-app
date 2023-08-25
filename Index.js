const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Friend = require("./FriendStructure");
const nodemailer = require('nodemailer');
const cors = require('cors');
const { prototype } = require('nodemailer/lib/dkim');
require("dotenv").config();

//mongodb+srv://Sanjanapanwar:sanjanapanwar%4019@cluster0.bminxen.mongodb.net/FriendDatabase?retryWrites=true&w=majority


const port = process.env.PORT || 4000;

app.use(cors({
      origin : "http://localhost:5000","http://mern-task-app.onrender.com",
      methods : "GET,HEAD,PUT,POST,DELETE"
}));

app.use(bodyParser.json());

const connectDB = async ()=>{
 try{
  const connection = mongoose.connect("mongodb+srv://Sanjanapanwar:sanjanapanwar%4019@cluster0.bminxen.mongodb.net/FriendDatabase?retryWrites=true&w=majority",
  {
          useNewUrlParser: true,
          useUnifiedTopology: true
  })
     console.log("connected");
 }catch(err){
        console.log("err");
 }
}
connectDB();

//MIDDLE USED IN POS API TO PREVENT USERS HAVING AGE LESS THAN 18
const checkAge = (req,res,next)=>{
      // console.log(req);
      // console.log(req.body);
      const data = req.body;
      const age = data.age;
      if(age>18){
            next();
      }else{
            res.json("Age must be greater than 18");
      }
};

// app.get("/",(request,response)=>{
//         console.log("Hello World !!");
//         response.send("Hello World Again");
// });


// const dummyFriend = [{id:"1",name:"devansh",age:25},
//                      {id:"2",name:"anshul",age:26},
//                      {id:"3",name:"himanshu",age:27},
//                      {id:"4",name:"abdulla",age:28}
//  ];
// console.log(dummyFriend);


//GETTING ALL FRIEND
// app.get("/getAllFriends",(request,response)=>{
//         response.json(dummyFriend);
// });




// app.get("/getFriendsFromDB",(request,response)=>{
//         Friend.find({}).then((friends)=>{
//                 console.log(friends);
//                 response.json(friends);
//                 console.log("success");
//         }).catch((err=>{
//                 console.log(err);
//         }))
// });




//GET FRIENDS BY ID
// app.get('/getFriendById/:id',(request,response)=>{
//         // console.log(request);
//        const id = request.params.id;
//        const friend = dummyFriend.filter((item)=>item.id==id);
//        console.log(friend);
//        if(id>dummyFriend.length)
//           response.send("not have such friend");
//         else  
//         response.send(friend);

// });



app.get("/getFriendsFromDB",async(request,response)=>{
         console.log("Calling Fetch");
      try{
            const friends = await Friend.find();
            console.log("Friends",friends);
           if(friends.length===0){
               //return response.status(400).json("No User Found");
             }
            response.status(200).json(friends);
      }catch(err){
            console.log("Error ",err);
      }
    });


// app.post('/addFriend',(request,response)=>{
//     console.log(request.body);
//     const newData = request.body
//      dummyFriend.push(newData);
// //      console.log(dummyFriend);
// //      response.status(200).json(dummyFriend);
// response.send("Data added sucessfully hit the getAllfriend api and see it");
// });

app.post('/addFriends',checkAge,async(request,response)=>{
     const data = request.body;
     console.log(data);
     try{
      const isExists = await Friend.findOne({email:data.email});
      // console.log("find one method is returning this =>",isExists);
      if(isExists){
           response.status(400).json("user alreay exists")
      }else{
            const newFriend = new Friend(data);
            await newFriend.save();
            response.status(201).json(newFriend);
      }
     }catch(err){
        console.log(err);
     }
});







//update an existing document using an id 
app.put('/update/:id',async(request,response)=>{
  const _id = request.params.id;
  const data = request.body;
  try{
      const user =await Friend.findByIdAndUpdate(
            {_id},
            {$set:data},
            {new:true}
    );
  if(!user){
       return response.status(404).json("user not found");
  }
   response.status(200).json(user);
   
  }catch(error){
      console.log("error",error);
  }
});


app.delete('/deleteById/:id',async(request,response)=>{
      const _id = request.params.id;
      try{
         const user = await Friend.findByIdAndDelete({_id});
         if(!user){
            return response.status(404).json("user not found");
      }
            response.status(200).json(user);
      }catch(error){
            console.log(error);
      }
})





//SENDING EMAIL VIA NODEMAILER USING GET REQUEST
app.get('/sendMail',(request,response)=>{
      var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'Sanjanapanwar2002@gmail.com',
              pass: 'ijszgswhaypwlbti'
            }
          });
          var mailOptions = {
            from: 'Sanjanapanwar2002@gmail.com',
            to: 'ranisinghpanwar2002@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'Hello my name is sanjana panwar'
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });          
})




app.listen(port,()=>{
        console.log(`server is running on port ${port}`);
})