var express = require('express');
var bodyParser = require('body-parser');
var {dbUser} = require('../database-mongo/users.js');
var {dbEvents}= require('../database-mongo/events.js');


var app = express();
app.use(express.json())
app.use(express.static(__dirname + '/../react-client/dist'));

app.post('/login',(req, res)=> {
  if(req.body.userName==='admin'&&req.body.password==='admin'){
    res.send('admin')
  }
  else{
  dbUser.findOneUser(req.body.userName,(err,user)=>{
    if(err){
      console.log(err)
    }
    else{
      if(!user){
        console.log('user not exist!')
      }
      else {
        if(user.password !== req.body.password){
          console.log('password dont match')
        }
        else{
          res.send(user)
        }
      }
      }
    })
  }
});
app.post('/signUp', (req, res)=> {
  dbUser.findOneUser(req.body.userName,(err,user)=>{
    if(err){
      console.log(err)
    }
    else{
      if(user){
        res.send('user exist!')
      }
      else{
        dbUser.insertUser(req.body,function(err) {
          if(err) {
            console.log(console.err)
          } else {
            res.send('user added!')
          }
        });
      }
    }
  })
});
app.put('/newEvent',(req,res)=>{
  dbEvents.insertFlatsharing(req.body,function(err) {
    if(err) {
      console.log(console.err)
    } else {
      res.send('event added!')
    }
  })
})
app.get('/flatsharingData',(req,res)=>{
  dbEvents.selectAllFlatsharing((err,events)=>{
    if(err){
      console.log(err)
    }
    else {
      res.send(events)
    }
  })
})
app.post('/search',(req,res)=>{
  dbEvents.selectSomeFlatsharing({'city':req.body.City,'gender':req.body.gender,'price':{ $lte: req.body.maxPrice }},(err,events)=>{
    if(err){
      console.log(err)
    }
    else {
      res.send(events)
    }
  })
})
app.patch('/addComment/:_id',(req,res)=>{
  dbEvents.addComment({_id:req.params._id},req.body.comment,(err,result)=>{
   if(err){
     console.log(err)
   }
   else res.send(result)
 })
 })
 app.put("/profil/:_id",(req,res)=>{
  // console.log('param:',req.params._id)
  // console.log('user data:', req.body)
  dbUser.updateOneUser({_id:req.params._id},req.body,function(err) {
    if(err) {
      console.log("upd error ", err)
    } else {
      res.send('user updated!')
    }
  })
})



app.put('/newCarpoolingEvent',(req,res)=>{
  dbEvents.insertCarpooling(req.body,function(err) {
    if(err) {
      console.log(console.err)
    } else {
      res.send('event added!')
    }
  })
})
app.get('/carpoolingData',(req,res)=>{
  dbEvents.selectAllCarpooling((err,events)=>{
    if(err){
      console.log(err)
    }
    else {
      res.send(events)
    }
  })
})
app.post('/searchCarpooling',(req,res)=>{
  console.log(req.body)
  dbEvents.selectSomeCarpooling({'from':req.body.from,'to':req.body.to,'date':req.body.date },(err,events)=>{
    if(err){
      console.log(err)
    }
    else {
      console.log('eventss:',events)
      res.send(events)
    }
  })
})
app.patch('/addCarpoolingComment/:_id',(req,res)=>{
  dbEvents.addCommentCarpooling({_id:req.params._id},req.body.comment,(err,result)=>{
   if(err){
     console.log(err)
   }
   else res.send(result)
 })
 })
app.listen(3000, function() {
  console.log('listening on port 3000!');
});

