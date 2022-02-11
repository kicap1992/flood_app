//creates maps model using mongoose schema
const mongoose = require('mongoose');

const mapKabupatenSchema = mongoose.Schema({
  nama: {
    type: String,
    required: true
  },
  polygon: {
    type: Array,
    required: true
  }
})

const mapKecamatanSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  polygons: {
    type: Array,
    required: true
  }
})

const mapKelurahanSchema = mongoose.Schema({
  _id_kecamatan: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  nama_kelurahan: {
    type: String,
    required: true
  },
  polygon: {
    type: Array,
    required: true
  }
})

const mapKabupatenModel = mongoose.model('tb_kabupaten_maps', mapKabupatenSchema,'tb_kabupaten_maps');
const mapKecamatanModel = mongoose.model('tb_kecamatan_maps', mapKecamatanSchema,'tb_kecamatan_maps');
const mapKelurahanModel = mongoose.model('tb_kelurahan_maps', mapKelurahanSchema,'tb_kelurahan_maps');

module.exports = {mapKabupatenModel, mapKecamatanModel, mapKelurahanModel};