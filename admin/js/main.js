var kordinat_banjir;
async function initMap() {
  sedang_proses()
  function updateMarkerPosition(latLng) {
    // document.getElementById('info').value = [
    return [latLng.lat().toFixed(5),
    latLng.lng().toFixed(5)
    ].join(', ');
  }

  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: { lat: -4.04603338, lng: 119.62361145 },
    mapTypeId: 'satellite',
    streetViewControl: false,
  });


  async function get_map() {
    let datanya;
    try {
      //create fetch get map
      let response = await fetch('https://flood-app.herokuapp.com/maps/kabupaten', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Kicap_karan:bb10c6d9f01ec0cb16726b59e36c2f73'
        },
        // body: JSON.stringify(data)
      });
      const data = await response.json();
      // console.log(data)
      datanya = data;
      $.unblockUI();
    } catch (err) {
      console.log(err);
      datanya = {};
      $.unblockUI();
    }
    return datanya
  }

  async function get_area_banjir() {
    let datanya;
    try {
      //create fetch get map
      let response = await fetch('https://flood-app.herokuapp.com/area_banjir', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Kicap_karan:bb10c6d9f01ec0cb16726b59e36c2f73'
        },
        // body: JSON.stringify(data)
      });
      const data = await response.json();
      // console.log(data)
      datanya = data.data;
      $.unblockUI();
    } catch (err) {
      console.log(err);
      datanya = [];
      $.unblockUI();
    }
    return datanya
  }

  let polygon = await get_map();
  polygon = (polygon.polygon != null || polygon.polygon != undefined) ? polygon.polygon : null;
  // console.log(polygon)
  let bounds = new google.maps.LatLngBounds();
  // console.log(polygon_coordinates)



  let polygon_coordinates = [];
  let polygons = [];
  // let polygons,this_polygons = [];
  polygon.forEach((item, index) => {
    // console.log(item , index)
    polygon_coordinates[index] = item;
    let this_polygons = new google.maps.Polygon({
      paths: polygon_coordinates[index],
      strokeColor: '#FF0000',
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.1
    });
    polygons.push(this_polygons);
    this_polygons.setMap(map);

  });

  for (var j = 0; j < polygons.length; j++) {
    for (var i = 0; i < polygons[j].getPath().getLength(); i++) {
      bounds.extend(polygons[j].getPath().getAt(i));
    }
  }

  let markers = []
  let get_marker_data = await get_area_banjir();
  // console.log(get_marker_data)

  if (get_marker_data.length > 0) {
    //create marker
    let infowindow
    get_marker_data.forEach((item, index) => {
      if(!item.end_at){
        markers[index] = new google.maps.Marker({
          position: item.kordinat,
          map: map,
          // title: item.nama_area,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
        // markers.push(marker);
        markers[index].setMap(map);
        google.maps.event.addListener(markers[index], 'click', function () {
          // console.log(item)
          if (infowindow) {
            infowindow.close();
          }
          // create let contentString with div class card-content, then inside div class card-content is div class form-group of item which is item.minimal_tinggi , item.maksimal_tinggi and item.created_at
          let contentString = '<div class="card-content">' +
            '<div class="form-group">' +
            '<br>' +
            '<label for="minimal_tinggi">Minimal Tinggi Banjir</label>' +
            '<input type="text" class="form-control" id="minimal_tinggi" value="' + item.minimal_tinggi + ' meter" readonly>' +
            '</div>' +
            '<div class="form-group">' +
            '<label for="maksimal_tinggi">Maksimal Tinggi</label>' +
            '<input type="text" class="form-control" id="maksimal_tinggi" value="' + item.maksimal_tinggi + ' meter" readonly>' +
            '</div>' +
            '<div class="form-group">' +
            '<label for="created_at">Waktu Ditambah</label>' +
            '<input type="text" class="form-control" id="created_at" value="' + removeTZdate(item.created_at) + '" readonly>' +
            '</div>' ;
            if(item.created_at != item.updated_at){
              contentString += '<div class="form-group">' +
              '<label for="updated_at">Waktu Diupdate</label>' +
              '<input type="text" class="form-control" id="updated_at" value="' + removeTZdate(item.updated_at) + '" readonly>' +
              '</div>' ;
            }
            //added button edit and delete
            contentString += '<div class="form-group text-center">' +
            `<button class="btn btn-xs btn-success" onclick="buka_modal_edit('${item._id}')">Edit</button>&nbsp &nbsp` +
            `<button class="btn btn-xs btn-danger" onclick="delete_area_banjir('${item._id}')">Hapus</button>` +
            '</div>' +
            '</div>';




          infowindow = new google.maps.InfoWindow({
            content: contentString,
          });
          infowindow.open({
            anchor: markers[index],
            map,
            shouldFocus: false,
          });
        });
      }
        
    })
  }



  map.fitBounds(bounds);


}

google.maps.event.addDomListener(window, 'load', initMap);

function open_modal_tambah_banjir() {
  //div id div_map2 style display none
  $("#div_map2").css("display", "none");
  // $('.selectnya option[value=0]').attr('selected','selected');
  let html = '<option value="0" selected disabled>-Pilih Kelurahan</option>';

  document.getElementById("select_kelurahan").innerHTML = html;
  document.querySelector('#select_kecamatan').value = '0'
  document.getElementById('div_map22').innerHTML = '';
  document.getElementById('div_map22').innerHTML = '<div id="map2" style="width: 100%; height: 500px "></div>'
  document.getElementById('minimal_tinggi').value = '';
  document.getElementById('maksimal_tinggi').value = '';
  //open modal id modal_tambah_banjir

  $("#modal_tambah_banjir").modal("show");
}

async function onchange_kecamatan(value) {
  sedang_proses()
  $("#p_kelurahan").hide();
  try {
    let response = await fetch('https://flood-app.herokuapp.com/maps/kecamatan?nama_kecamatan=' + value, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Kicap_karan:bb10c6d9f01ec0cb16726b59e36c2f73'
      },
      // body: JSON.stringify(data)
    });
    const data = await response.json();

    // console.log(data.data._id);
    initMap2(data.data.polygons, "kecamatan")

    let response2 = await fetch('https://flood-app.herokuapp.com/maps/kelurahan_by_kecamatan?id_kecamatan=' + data.data._id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data_kelurahan = await response2.json();
    // console.log(data_kelurahan)
    let html = '<option value="0">-Pilih Kelurahan</option>';
    data_kelurahan.data.forEach((item, index) => {
      // console.log(item)
      html += `<option value="${item._id}">${item.nama_kelurahan}</option>`
    })
    document.getElementById("select_kelurahan").innerHTML = html;
    $.unblockUI();
  } catch (err) {
    console.log(err);
    $.unblockUI();
  }
}

async function onchange_kelurahan(value) {
  // console.log(value)
  $("#p_kelurahan").show();
  sedang_proses()
  try {
    let response = await fetch('https://flood-app.herokuapp.com/maps/kelurahan?id_kelurahan=' + value, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Kicap_karan:bb10c6d9f01ec0cb16726b59e36c2f73'
      },
      // body: JSON.stringify(data)
    });
    const data = await response.json();

    // console.log(data.data.polygon)
    // console.log(data.data._id);
    initMap2(data.data.polygon, "kelurahan")
    $.unblockUI();
  } catch (err) {
    console.log(err);
    $.unblockUI();
  }
}


function initMap2(data, stat) {
  // console.log(Array.isArray(data[0]))
  //fade in id div_map2 in 2000ms
  $("#div_map2").fadeIn(1000);

  function updateMarkerPosition(latLng) {
    // document.getElementById('info').value = [
    // return [latLng.lat().toFixed(5),
    // latLng.lng().toFixed(5)
    // ].join(', ');
    let kor = { lat: latLng.lat(), lng: latLng.lng() }
    return kor;

  }

  const map = new google.maps.Map(document.getElementById("map2"), {
    zoom: 15,
    center: { lat: -4.04603338, lng: 119.62361145 },
    mapTypeId: 'hybrid',
    streetViewControl: false,
  });
  let bounds = new google.maps.LatLngBounds();
  let array = [];
  if (!Array.isArray(data[0])) {
    const kecamatan_polygons = data;
    array = array.concat(data);
    const kecamatan = new google.maps.Polygon({
      paths: kecamatan_polygons,
      strokeColor: "#FF0000",
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.1,
    });


    kecamatan.setMap(map);
    for (var i = 0; i < kecamatan_polygons.length; i++) {
      bounds.extend(kecamatan_polygons[i]);
    }
    // console.log(bounds.getCenter());



  } else {
    let polygon_all = data;
    let polygon_coordinates = [];
    let polygons = [];

    // let polygons,this_polygons = [];
    polygon_all.forEach((item, index) => {
      // console.log(item , index)
      polygon_coordinates[index] = item;
      //merge array with item
      array = array.concat(item);
      let this_polygons = new google.maps.Polygon({
        paths: polygon_coordinates[index],
        strokeColor: '#FF0000',
        strokeOpacity: 0.3,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.1
      });
      polygons.push(this_polygons);
      this_polygons.setMap(map);

    });

    // console.log(array)
    // array = new google.maps.Polygon({
    //   paths: array,

    // });

    for (var j = 0; j < polygons.length; j++) {
      for (var i = 0; i < polygons[j].getPath().getLength(); i++) {
        bounds.extend(polygons[j].getPath().getAt(i));
      }
    }


  }
  array = new google.maps.Polygon({
    paths: array,
    strokeOpacity: 0,
    // strokeWeight: 2,
    // fillColor: '#FF0000',
    fillOpacity: 0

  });
  array.setMap(map)

  if (stat == "kelurahan") {
    let marker = null
    google.maps.event.addListener(array, 'rightclick', function (event) {
      // console.log(event.latLng)
      // console.log("sini rightclick")
      // placeMarker(event.latLng, map2);
      if (marker != null) {
        marker.setMap(null)
      }

      marker = new google.maps.Marker({
        position: event.latLng,
        map: map,
        draggable: true,
      })

      // console.log(updateMarkerPosition(event.latLng));
      kordinat_banjir = updateMarkerPosition(event.latLng);

      google.maps.event.addListener(marker, 'dragend', function () {
        if (!google.maps.geometry.poly.containsLocation(marker.getPosition(), array)) {
          // markers[i].setMap(null)
          // console.log("diluar")
          marker.setMap(null)
          //create swal warning message "Marker harus berada di area yang ditentukan" with timer 1 sec
          swal({
            title: "Warning!",
            text: "Marker harus berada di area yang ditentukan",
            icon: "warning",
            timer: 1000,
            button: false
          })
        } else {
          // console.log("didalam")
          // console.log(updateMarkerPosition(event.latLng));
          kordinat_banjir = updateMarkerPosition(event.latLng);
        }
      });
    })
    // let marker = new google.maps.Marker({
    //   position: bounds.getCenter(),
    //   map: map,
    //   draggable: true,
    // });

    // google.maps.event.addListener(marker, 'dragend', function () {
    //   if (!google.maps.geometry.poly.containsLocation(marker.getPosition(), array)) {
    //     // markers[i].setMap(null)
    //     console.log("diluar")
    //   } else {
    //     console.log("didalam")
    //   }
    // });

  }

  map.fitBounds(bounds);
}




function tambah_area_banjir() {
  let kordinat = kordinat_banjir
  let kecamatan = document.getElementById('select_kecamatan').value
  let kelurahan = document.getElementById('select_kelurahan').value
  let minimal_tinggi = document.getElementById('minimal_tinggi').value
  let maksimal_tinggi = document.getElementById('maksimal_tinggi').value

  if (kecamatan == "0") {
    //create toast message "Pilih Kecamatan" with timer 1 sec
    toastr.warning("Kecamatan Harus Terpilih", "Warning!")
    //focus ke select_kecamatan
    document.getElementById('select_kecamatan').focus()
  } else if (kelurahan == "0") {
    //create toast message "Pilih Kelurahan" with timer 1 sec
    toastr.warning("Kelurahan Harus Terpilih", "Warning!")
    //focus ke select_kelurahan
    document.getElementById('select_kecamatan').focus()
  } else if (kordinat == null || kordinat == undefined) {
    toastr.warning("Kordinat Marker Area Banjir Harus Ada", "Warning!")
  } else if (minimal_tinggi == '') {
    toastr.warning("Minimal Tinggi Banjir Harus Terisi", "Warning!")
    //focus ke select_kelurahan
    document.getElementById('minimal_tinggi').focus()
  } else if (maksimal_tinggi == '') {
    toastr.warning("Maksimal Tinggi Banjir Harus Terisi", "Warning!")
    //focus ke select_kelurahan
    document.getElementById('maksimal_tinggi').focus()
  } else if (maksimal_tinggi <= minimal_tinggi) {
    toastr.warning("Maksimal Tinggi Tidak Bisa Sama Atau Lebih Rendah Dari Minimal Tinggi", "Warning!")
    //focus ke select_kelurahan
    document.getElementById('maksimal_tinggi').focus()
  } else {
    //create swal question message "Apakah Anda Yakin Ingin Menambahkan Area Banjir?" with Yes and No button
    swal({
      title: "Yakin?",
      text: "Apakah Anda Yakin Ingin Menambahkan Area Banjir?",
      icon: "info",
      buttons: true,
      // dangerMode: true,

    }).then(async (willDelete) => {
      if (willDelete) {
        sedang_proses()
        try {
          let response = await fetch(`https://flood-app.herokuapp.com/area_banjir`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              kordinat: kordinat,
              kecamatan: kecamatan,
              kelurahan: kelurahan,
              minimal_tinggi: minimal_tinggi,
              maksimal_tinggi: maksimal_tinggi
            })
          })

          let responseJson = await response.json()
          // console.log(response)
          if (response.status == 200) {
            //close modal
            $('.modal').modal('hide')
            //create swal success message "Area Banjir Berhasil Ditambahkan" with timer 2 sec
            swal({
              title: "Berhasil!",
              text: "Area Banjir Berhasil Ditambahkan",
              icon: "success",
              timer: 2000,
              button: false
            })
            window.scrollTo({ top: 0, behavior: 'smooth' });
            initMap()
          }
          // $.unblockUI()
        } catch (error) {
          $.unblockUI()
        }
      }
    })
  }


}

async function buka_modal_edit(id) {
  // console.log("sini buka modal edit banjir " +id)
  sedang_proses()
  try {
    let response = await fetch(`https://flood-app.herokuapp.com/area_banjir/detail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    let responseJson = await response.json()
    console.log(responseJson)
    if (response.status == 200) {
      let data = responseJson.data
      // console.log(responseJson)
      document.getElementById('div_map3').innerHTML = '<div id="map3" style="width: 100%; height: 500px "></div>'
      const map = new google.maps.Map(document.getElementById("map3"), {
        zoom: 18,
        center: data.kordinat,
        mapTypeId: 'hybrid',
        streetViewControl: false,
      });
      //create marker
      let marker = new google.maps.Marker({
        position: data.kordinat,
        map: map,
      })
      document.getElementById('waktu_ditambah_edit').value = removeTZdate(data.created_at)
      document.getElementById('waktu_update_edit').value = (data.created_at != data.updated_at) ? removeTZdate(data.updated_at) : "Belum Pernah Update"
      document.getElementById('minimal_tinggi_edit').value = data.minimal_tinggi
      document.getElementById('maksimal_tinggi_edit').value = data.maksimal_tinggi
      // button id konfirm_edit change the onclick="konfirm_edit('data._id')"
      document.getElementById('button_confirm_edit').setAttribute('onclick', `konfirm_edit('${data._id}',${data.minimal_tinggi}, ${data.maksimal_tinggi})`)
      //open modal id modal_edit_banjir
      $('#modal_edit_banjir').modal('show')
    } else {
      //created swal error message "Area Banjir Tidak Ditemukan" with timer 2 sec"
      swal({
        title: "Gagal!",
        text: "Area Banjir Tidak Ditemukan",
        icon: "error",
        timer: 2000,
        button: false
      })
    }
    $.unblockUI()
  } catch (error) {
    console.log(error)
    $.unblockUI()
    //created swal error message "Jaringan Error"  with 2 button blue color "Refresh Halaman"  and  red color "Close", if user click "Refresh Halaman" button, page will refresh
    swal({
      title: "Gagal!",
      text: "Jaringan Error",
      icon: "error",
      buttons: {
        refresh: {
          text: 'Refresh Halaman',
          value: "refresh",
          className: 'btn-sm btn-primary'
        },
        close: {
          text: 'Tutup',
          value: "close",
          className: 'btn-sm btn-danger'
        }
      },
    }).then((value) => {
      switch (value) {
        case "refresh":
          location.reload()
          break;
        default:
          return;
      }
    });

  }
}

async function konfirm_edit(id, min, maks) {
  // console.log("sini konfirm edit banjir " +id)
  let minimal_tinggi = document.getElementById('minimal_tinggi_edit').value
  let maksimal_tinggi = document.getElementById('maksimal_tinggi_edit').value
  console.log(minimal_tinggi)
  console.log(maksimal_tinggi)
  if (min == minimal_tinggi && maks == maksimal_tinggi) {
    //create toast warning "Tiada Perubahan Data"
    toastr.warning("Tiada Perubahan Data", "Warning!")
    //focus ke minimal_tinggi
    document.getElementById('minimal_tinggi_edit').focus()
  } else if(parseInt(maksimal_tinggi) < parseInt(minimal_tinggi)){
    //create toast error "Minimal Tinggi Tidak Boleh Lebih Besar Dari Maksimal Tinggi"
    toastr.error("Minimal Tinggi Tidak Boleh Lebih Besar Dari Maksimal Tinggi", "Warning!")
    //focus ke minimal_tinggi
    document.getElementById('minimal_tinggi_edit').focus()
  } else {
    //create swal info with message "Yakin Update Data Banjir?" with 2 button cancel and ok, if ok then console.log(ok)
    swal({
      title: "Yakin?",
      text: "Yakin Update Data Banjir?",
      icon: "info",
      buttons: true,
      // dangerMode: true,

    }).then(async (terima) => {
      if (terima) {
        sedang_proses()
        try {
          try {
            let response = await fetch(`https://flood-app.herokuapp.com/area_banjir/?id=${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                minimal_tinggi: minimal_tinggi,
                maksimal_tinggi: maksimal_tinggi
              })
            })

            let responseJson = await response.json()
            console.log(responseJson)
            if (response.status == 200) {
              //close modal
              $('.modal').modal('hide')
              //create swal success message "Area Banjir Berhasil Ditambahkan" with timer 2 sec
              swal({
                title: "Berhasil!",
                text: "Detail Area Banjir Berhasil Diubah",
                icon: "success",
                timer: 2000,
                button: false
              })
              window.scrollTo({ top: 0, behavior: 'smooth' });
              initMap()
            }
            $.unblockUI()


          } catch (error) {
            console.log(error)
            $.unblockUI()
          }
        } catch (error) {
          $.unblockUI()
        }
      }
    })

  }


}

async function delete_area_banjir(id){
  // console.log("sini delete area banjir " +id)
  // create swal info with message "Yakin Hapus Data Banjir?" with 2 button cancel and ok, if ok then console.log(ok)
  swal({
    title: "Yakin?",
    text: "Yakin Hapus Data Banjir?",
    icon: "info",
    buttons: true,
    // dangerMode: true,

  }).then(async (terima) => {
    if (terima) {
      sedang_proses()
      try {
        
        let response = await fetch(`https://flood-app.herokuapp.com/area_banjir/?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        let responseJson = await response.json()
        if (response.status == 200) {
          //close modal
          $('.modal').modal('hide')
          //create swal success message "Area Banjir Berhasil Ditambahkan" with timer 2 sec
          swal({
            title: "Berhasil!",
            text: "Area Banjir Berhasil Dihapus",
            icon: "success",
            timer: 2000,
            button: false
          })
          window.scrollTo({ top: 0, behavior: 'smooth' });
          initMap()
        }else{
          swal({
            title: "Gagal!",
            text: "Area Banjir Gagal Dihapus",
            icon: "error",
            timer: 2000,
            button: false
          })
        }
      }catch(error){
        console.log(error)
        $.unblockUI()
      }
    }
  })
}

function removeTZdate(val) {
  //change a "T" and "Z" to " ", then remove the milliseconds
  return val.replace("T", " | ").replace("Z", " ").split(".")[0]
  // return val.replace(/T/g, " | ").replace(/Z/g, "");
}

