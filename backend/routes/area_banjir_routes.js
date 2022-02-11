//create routes from models models/maps_model.js
// import { io } from "socket.io-client";
const express = require('express');
const router = express.Router();

const areaBanjirModel = require('../models/area_banjir_model');
const io = require("socket.io-client");
const socket = io("http://localhost:3001/");
//create post area banjir
router.post('/', async (req, res) => {
  // console.log(req.body);
  try{
    const new_area_banjir = new areaBanjirModel({
      kordinat: req.body.kordinat,
      nama_kecamatan: req.body.kecamatan,
      _id_kelurahan: req.body.kelurahan,
      minimal_tinggi: req.body.minimal_tinggi,
      maksimal_tinggi: req.body.maksimal_tinggi,
    });
    await new_area_banjir.save();
    //emmit to client
    socket.emit('tambah_banjir', {
      kecamatan: req.body.kecamatan,
    });
    res.send({status : true, data : new_area_banjir});
  }catch(err){
    res.status(500).send(err);
  }
})

//get all area banjir
router.get('/', async (req, res) => {
  try{
    const all_area_banjir = await areaBanjirModel.find();
    res.send({status : true, data : all_area_banjir});
  }catch(err){
    res.status(500).send(err);
  }
})

//get area banjir by id
router.get('/detail', async (req, res) => {
  try{
    // check if id is found
    const area_banjir = await areaBanjirModel.findById(req.query.id);
    if(!area_banjir){
      res.status(404).send({status : false, message : 'area banjir not found'});
      return;
    }
    res.send({status : true, data : area_banjir});
  }catch(err){
    res.status(500).send(err);
  }
})

//put area banjir by id
router.put('/', async (req, res) => {
  console.log(req.query)
  try{
    // check if id is found
    const area_banjir = await areaBanjirModel.findById(req.query.id);
    if(!area_banjir){
      res.status(404).send({status : false, message : 'area banjir not found'});
      return;
    }
    //areaBanjirModel find by id = req.query.id and update minimal_tinggi = req.body.minimal_tinggi , maksimal_tinggi = req.body.maksimal_tinggi , updated_at = Date.now()
    await areaBanjirModel.findByIdAndUpdate(req.query.id, {
      minimal_tinggi: req.body.minimal_tinggi,
      maksimal_tinggi: req.body.maksimal_tinggi,
      updated_at: Date.now()
    });

    socket.emit('edit_banjir', {
      kecamatan: req.body.kecamatan,
    });
    res.send({status : true});
  }catch(err){
    res.status(500).send(err);
  }
})


//delete area banjir by id
router.delete('/', async (req, res) => {
  try{
    // check if id is found
    const area_banjir = await areaBanjirModel.findById(req.query.id);
    if(!area_banjir){
      res.status(404).send({status : false, message : 'area banjir not found'});
      return;
    }
    // await areaBanjirModel.findByIdAndDelete(req.query.id);
    await areaBanjirModel.findByIdAndUpdate(req.query.id, {
      end_at: Date.now()
    })
    socket.emit('delete_banjir', {
      message : 'delete area banjir',
    });
    res.send({status : true});
  }catch(err){
    res.status(500).send(err);
  }
})


router.get('/coba2', async (req, res) => {
  //emit ke server socket
  socket.emit('coba2', {
    data: 'coba2'
  })
  res.send({status : true});
})



module.exports = router;

