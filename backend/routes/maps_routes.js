//create routes from models models/maps_model.js
const express = require('express');
const router = express.Router();

const {mapKabupatenModel, mapKecamatanModel, mapKelurahanModel} = require('../models/maps_model');

//create get kabupaten
router.get('/kabupaten', async (req, res) => {
  try{
    const map_kabupaten = await mapKabupatenModel.findOne({nama_kabupaten : "Parepare"});
    // console.log(Array.isArray(map_kabupaten.polygon[0][0]));
    // console.log(map_kabupaten.polygon[0][0]);
    res.send(map_kabupaten);
  }
  catch(err){
    res.status(500).send(err);
  }
})

//create get kecamatan
router.get('/kecamatan', async (req, res) => {
  // console.log(req.query.nama_kecamatan);
  try{
    //if exist
    const cek_kecamatan = await mapKecamatanModel.exists({name : req.query.nama_kecamatan});
    if(!cek_kecamatan){
      // console.log("Tidak ada");
      res.status(400).send({message : "Kecamatan tidak ada"});
      return;
    }
    // console.log(cek_kecamatan);
    const map_kecamatan = await mapKecamatanModel.findOne({name : req.query.nama_kecamatan});
    // console.log(map_kecamatan);
    res.send({status : true, data : map_kecamatan});
  }catch(err){
    res.status(500).send(err);
  }
  // res.send({map_kabupaten: "kecamatan"});
})

//create get kecamatan
router.get('/kelurahan_by_kecamatan', async (req, res) => {
  // console.log(req.query.id_kecamatan);
  try{
    //if exist
    const cek_kelurahan = await mapKelurahanModel.exists({_id_kecamatan: req.query.id_kecamatan});
    // console.log(cek_kelurahan);
    if(!cek_kelurahan){
      // console.log("Tidak ada");
      res.status(400).send({message : "Kelurahan dan desa untuk kecamatan ini tidak ada"});
      return;
    }
    // console.log(cek_kelurahan);
    const all_map_kelurahan = await mapKelurahanModel.find({_id_kecamatan: req.query.id_kecamatan});
    // console.log(all_map_kelurahan);
    // res.send({status : true, data : map_kecamatan});
    res.send({status : true, data : all_map_kelurahan});
  }catch(err){
    res.status(500).send(err);
  }
  // res.send({map_kelurahan: "kelurahan"});
})

//create get kecamatan
router.get('/kelurahan', async (req, res) => {
  console.log(req.query.id_kelurahan);
  try{
    //if exist
    const cek_kelurahan = await mapKelurahanModel.exists({_id: req.query.id_kelurahan});
    // console.log(cek_kelurahan);
    if(!cek_kelurahan){
      // console.log("Tidak ada");
      res.status(400).send({message : "Kelurahan atau desa ini tidak ada"});
      return;
    }
    // console.log(cek_kelurahan);
    const map_kelurahan = await mapKelurahanModel.findById(req.query.id_kelurahan);
    // console.log(map_kelurahan);
    // res.send({status : true, data : map_kecamatan});
    res.send({status : true, data : map_kelurahan});
  }catch(err){
    res.status(500).send(err);
  }
  // res.send({map_kelurahan: "kelurahan"});
})



module.exports = router;

