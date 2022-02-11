//creates maps model using mongoose schema
const mongoose = require('mongoose');

const areaBanjirSchema = mongoose.Schema({
  kordinat: {
    type: Object,
    required: true
  },
  nama_kecamatan: {
    type: String,
    required: true
  },
  _id_kelurahan: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  minimal_tinggi: {
    type: Number,
    required: true
  },
  maksimal_tinggi: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  end_at: {
    type: Date,
  }
})


module.exports = mongoose.model('tb_area_banjir', areaBanjirSchema,'tb_area_banjir');