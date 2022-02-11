async function dataTables() {
  sedang_proses()
  try {
    //create fetch
    let response = await fetch('https://flood-app.herokuapp.com/area_banjir', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Kicap_karan:bb10c6d9f01ec0cb16726b59e36c2f73'
      },
      // body: JSON.stringify(data)
    });
    const data = await response.json();
    // console.log(response.status);
    if (response.status == 200) {
      let array = data['data'];
      // console.log(array);
      let table = $('#example').DataTable({
        data: array,
        columns: [
          { data: null },
          { data: 'nama_kecamatan' },
          { data: null },
          { data: null },
          { data: null },
        ],
        columnDefs: [
          {
            targets: 0,
            render: function (data, type, row) {
              // return moment(data.created_at).format('DD-MM-YYYY HH:mm:ss');
              let time = row.created_at;
              // remove 'T' and 'Z' and milisecond

              time = time.replace('T', ' ').replace('Z', '').substr(0, time.length - 5);
              return time;
            }
          },
          {
            targets: 2,
            render: function (data, type, row) {
              return row.minimal_tinggi + ' m';
            }
          },
          {
            targets: 3,
            render: function (data, type, row) {
              return row.maksimal_tinggi + ' m';
            }
          },
          {
            targets: 4,
            render: function (data, type, row) {
              //create button icon rounded
              let button = `<center><button class="btn btn-xs btn-icon btn-primary btn-rounded" onclick='tampilkan(${JSON.stringify(row.kordinat)})''><i class="fa fa-pencil"></i></button></center>`;
              // return row.kordinat;
              return button
            }
          },
        ],
      });
      table.columns.adjust().draw();
    }
    $.unblockUI();
  } catch (error) {
    $.unblockUI();
  }
}

dataTables();

function tampilkan(kor) {
  //op
  const map = new google.maps.Map(document.getElementById("map2"), {
    zoom: 17,
    center: { lat: kor.lat, lng: kor.lng },
    mapTypeId: 'hybrid',
    streetViewControl: false,
  });
  //create marker
  const marker = new google.maps.Marker({
    //marker icon
    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    position: { lat: kor.lat, lng: kor.lng },
    map: map,
    title: 'Kordinat',
    draggable: false,
  });
  //set marker
  marker.setMap(map);

  //create radius
  const circle = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    center: { lat: kor.lat, lng: kor.lng },
    radius: 100,
  });
  //set radius
  circle.setMap(map);

  //open modal
  $('.modal').modal('show');
}
