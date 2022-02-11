// ignore_for_file: avoid_print, duplicate_ignore

// import 'dart:async';
import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:mobile_app/widgets/bottomNavigator.dart';
import 'package:provider/provider.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'dart:collection';

import '../controller/maps_controller.dart';
import '../controller/notification_api.dart';
import 'package:timezone/data/latest.dart' as tz;

import '../widgets/onWillPop.dart';

// import 'package:socket_io_client/socket_io_client.dart' as IO;

class MapScreen extends StatefulWidget {
  const MapScreen({Key? key}) : super(key: key);

  @override
  _MapScreenState createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen>
    with AutomaticKeepAliveClientMixin<MapScreen> {
  // Completer<GoogleMapController> _controller = Completer();
  late GoogleMapController mapController;

  static const _initialCameraPosition = CameraPosition(
    target: LatLng(-4.021715309872529, 119.65549213554705),
    zoom: 11.5,
  );

  final Set<Marker> _markers = HashSet<Marker>();
  final Set<Circle> _circles = HashSet<Circle>();
  //create set _polygons
  // ignore: unused_field
  final Set<Polygon> _polygons = HashSet<Polygon>();

  // ignore: prefer_final_fields
  List<LatLng> _latlng = [];

  // ignore: unused_element
  void _ambilMarker(BuildContext context) async {
    final MapsController _toController =
        Provider.of<MapsController>(context, listen: false);

    try {
      final Map _data = await _toController.ambil_marker();
      final List<dynamic> _list = _data['data'];
      //loop _list and add to _markers
      for (var item in _list) {
        if (item['end_at'] == null) {
          setState(() {
            _markers.add(
              Marker(
                  markerId: MarkerId(item['_id']),
                  position:
                      LatLng(item['kordinat']['lat'], item['kordinat']['lng']),
                  // infoWindow: const InfoWindow(
                  //   title: "sini title",
                  //   snippet: "sini snippet ",
                  // ),
                  onTap: () {
                    // remove "T" and "Z" from item['created_at']

                    // ignore: deprecated_member_use

                    //create bottom sheet
                    showModalBottomSheet(
                      isScrollControlled: true,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                      context: context,
                      builder: (context) => Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const SizedBox(height: 20),
                          Text(
                              "Created At : ${item['created_at'].replaceAll('T', '').replaceAll('Z', '')}"),
                          const SizedBox(height: 10),
                          Text("Kecamatan : ${item['nama_kecamatan']}"),
                          const SizedBox(height: 10),
                          Text(
                              "Tinggi Minimal : ${item['minimal_tinggi']} meter"),
                          const SizedBox(height: 10),
                          Text(
                              "Tinggi Maksimal : ${item['maksimal_tinggi']} meter"),
                          const SizedBox(height: 10),
                          (item['created_at'] != item['updated_at'])
                              ? Text(
                                  "Updated At : ${item['updated_at'].replaceAll('T', '').replaceAll('Z', '')}")
                              : const SizedBox(),
                          const SizedBox(height: 20),
                        ],
                      ),
                    );
                  }),
            );

            _latlng.add(
              LatLng(item['kordinat']['lat'], item['kordinat']['lng']),
            );

            // add _circles
            _circles.add(
              Circle(
                circleId: CircleId(item['_id']),
                center:
                    LatLng(item['kordinat']['lat'], item['kordinat']['lng']),
                radius: 100,
                fillColor: Colors.blue.withOpacity(0.2),
                strokeWidth: 0,
              ),
            );
          });
        }
      }
      // print(_markers);
    } catch (e) {
      print(e);
    }
  }

  void _ambilPolygon(BuildContext context) async {
    final MapsController _toController =
        Provider.of<MapsController>(context, listen: false);

    // ignore: duplicate_ignore
    try {
      final Map _data = await _toController.ambil_polygon();
      final List<dynamic> _dataPolygons = _data['polygon'];
      int i = 0;
      for (var item in _dataPolygons) {
        List<LatLng> polygonCoords = [];
        // print(item);
        //loop item and add to polygonCoords
        for (var item2 in item) {
          polygonCoords.add(LatLng(item2['lat'], item2['lng']));
        }
        print(polygonCoords);
        setState(() {
          _polygons.add(
            Polygon(
              polygonId: PolygonId('polygon' + i.toString()),
              points: polygonCoords,
              fillColor: Colors.black.withOpacity(0.4),
              strokeWidth: 1,
            ),
          );
        });
        i++;
      }
      //loop _da

    } catch (e) {
      // ignore: avoid_print
      print(e);
    }
  }

  late Socket socket;
  void connectToServer() async {
    try {
      // Configure socket transports must be sepecified
      socket = io('https://flood-app.herokuapp.com', <String, dynamic>{
        'transports': ['websocket'],
        'autoConnect': false,
      });

      // Connect to websocket
      socket.connect();

      // Handle socket events
      socket.on('connect', (_) => print('connect asdasdsad: ${socket.id}'));
      socket.on('coba2', (_) => print(_));
      socket.on('tambah_banjir', (_) {
        if (mounted) {
          setState(() {
            _latlng.clear();
            _markers.clear();
            _circles.clear();
            _ambilMarker(context);
            NotificationApi.showNotification(
              id: 1,
              title: 'Penambahan Laporan Banjir',
              body: _['message'],
              payload: 'Penambahan Laporan Banjir',
            );

            //timer
            Timer(const Duration(seconds: 2), () {
              // camera to last position
              if (_latlng.isNotEmpty) {
                mapController.animateCamera(
                  CameraUpdate.newLatLngBounds(
                    computeBounds(_latlng),
                    100,
                  ),
                );
              }
            });
          });
        }
      });
      socket.on('edit_banjir', (_) {
        NotificationApi.showNotification(
          id: 2,
          title: 'Update Laporan Banjir',
          body: _['message'],
          payload: 'Update Laporan Banjir',
        );
        if (mounted) {
          setState(() {
            _latlng.clear();
            _markers.clear();
            _circles.clear();
            _ambilMarker(context);

            //timer
            Timer(const Duration(seconds: 2), () {
              // camera to last position
              mapController.animateCamera(
                CameraUpdate.newLatLngBounds(
                  computeBounds(_latlng),
                  100,
                ),
              );
            });
          });
        }
      });
      socket.on('delete_banjir', (_) {
        if (mounted) {
          setState(() {
            _latlng.clear();
            _markers.clear();
            _circles.clear();
            _ambilMarker(context);

            // change camera position

            //camera to initial position

            //timer
            Timer(const Duration(seconds: 2), () {
              // camera to last position
              mapController.animateCamera(
                CameraUpdate.newLatLngBounds(
                  computeBounds(_latlng),
                  100,
                ),
              );
            });
            // mapController.animateCamera(
            //   CameraUpdate.newLatLngBounds(
            //     computeBounds(_latlng),
            //     100,
            //   ),
            // );
          });
        }
      });

      // socket.on('typing', handleTyping);
      // socket.on('message', handleMessage);
      // socket.on('disconnect', (_) => print('disconnect'));
      // socket.on('fromServer', (_) => print(_));
      print(socket.connected);
    } catch (e) {
      print(e.toString());
      print('tidak connect');
    }
  }

  Location location = Location();

  void getLoc() async {
    bool _serviceEnabled;
    PermissionStatus _permissionGranted;
    // ignore: unused_local_variable
    LocationData _locationData;

    _serviceEnabled = await location.serviceEnabled();
    if (!_serviceEnabled) {
      _serviceEnabled = await location.requestService();
      if (!_serviceEnabled) {
        return;
      }
    }

    _permissionGranted = await location.hasPermission();
    if (_permissionGranted == PermissionStatus.denied) {
      _permissionGranted = await location.requestPermission();
      if (_permissionGranted != PermissionStatus.granted) {
        return;
      }
    }
    //location accuracy to high

    location.changeSettings(
        accuracy: LocationAccuracy.high, interval: 1000, distanceFilter: 10);

    _locationData = await location.getLocation();

    location.onLocationChanged.listen((LocationData currentLocation) {
      // Use current location
      // print(currentLocation);
      if (mounted) {
        if (_latlng.isNotEmpty) {
          for (var item in _latlng) {
            // print(item.latitude);
            var _length = calculateDistance(item.latitude, item.longitude,
                currentLocation.latitude, currentLocation.longitude);

            if (_length <= 1) {
              //set camera to item with zoom level 15

              mapController.animateCamera(
                CameraUpdate.newCameraPosition(CameraPosition(
                  target: LatLng(currentLocation.latitude ?? item.latitude,
                      currentLocation.longitude ?? item.longitude),
                  zoom: 15,
                )),
              );

              //create snackbar
              // ScaffoldMessenger.of(context).showSnackBar(
              //     const SnackBar(content: Text('Dekat dari lokasi banjir')));
            }
          }
        }
      }
    });

    // print(_latlng);
  }

  double calculateDistance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;
    var c = cos;
    var a = 0.5 -
        c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * asin(sqrt(a));
  }

  @override
  void initState() {
    // ignore: todo
    // TODO: implement initState
    super.initState();
    _ambilPolygon(context);
    _ambilMarker(context);
    connectToServer();
    tz.initializeTimeZones();
    NotificationApi.init(initScheduled: true, context: context);
    getLoc();
    // _setMarkers();
    // print(_markers);
  }

  LatLngBounds computeBounds(List<LatLng> list) {
    // assert(list.isNotEmpty);
    var firstLatLng = list.first;
    var s = firstLatLng.latitude,
        n = firstLatLng.latitude,
        w = firstLatLng.longitude,
        e = firstLatLng.longitude;
    for (var i = 1; i < list.length; i++) {
      var latlng = list[i];
      s = min(s, latlng.latitude);
      n = max(n, latlng.latitude);
      w = min(w, latlng.longitude);
      e = max(e, latlng.longitude);
    }
    return LatLngBounds(southwest: LatLng(s, w), northeast: LatLng(n, e));
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return WillPopScope(
      onWillPop: () => Will_Pop.willpop(context),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Peta Parepare'),
        ),
        body: GoogleMap(
          mapToolbarEnabled: false,
          myLocationButtonEnabled: false,
          zoomControlsEnabled: true,
          initialCameraPosition: _initialCameraPosition,
          markers: _markers,
          circles: _circles,
          polygons: _polygons,
          onMapCreated: _onBounds,
        ),
        bottomNavigationBar: BottomNavigationBar(
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Peta Parepare',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.search),
              label: 'Log History',
            ),
          ],
          currentIndex: 0,
          selectedItemColor: Colors.amber[800],
          onTap: (int value) {
            Bottom_Navigator.onTap(value, context);
          },
        ),
      ),
    );
  }

  @override
  bool get wantKeepAlive => true;

  void _onBounds(GoogleMapController controller) {
    // _controller.complete(controller);
    Timer(const Duration(seconds: 3), () {
      if (mounted) {
        mapController = controller;
        //put computeBounds here with _markers
        // print(computeBounds(_latlng));

        if (_latlng.isNotEmpty) {
          mapController.animateCamera(
            CameraUpdate.newLatLngBounds(
              computeBounds(_latlng),
              100,
            ),
          );
        }
      }
    });
  }
}
