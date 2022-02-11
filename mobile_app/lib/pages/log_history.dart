// ignore_for_file: camel_case_types, prefer_const_constructors, duplicate_ignore

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:mobile_app/controller/maps_controller.dart';
import 'package:mobile_app/widgets/ourContainer.dart';
import 'package:provider/provider.dart';

import '../widgets/bottomNavigator.dart';

class Log_History extends StatefulWidget {
  const Log_History({Key? key}) : super(key: key);

  @override
  _Log_HistoryState createState() => _Log_HistoryState();
}

class _Log_HistoryState extends State<Log_History> {
  bool _loading = true;
  List<Map<String, dynamic>> _laporanAll = [];

  void _ambilMarker(BuildContext context) async {
    setState(() {
      _loading = true;
    });
    final MapsController _toController =
        Provider.of<MapsController>(context, listen: false);

    try {
      final Map _data = await _toController.ambil_marker();
      if (_data['data'].length > 0) {
        setState(() {
          _laporanAll = (_data['data'] as List)
              .map((dynamic item) => item as Map<String, dynamic>)
              .toList();
          _loading = false;
          // print(_laporanAll);
        });
      }
    } catch (e) {
      // print(e);
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  void initState() {
    // ignore: todo
    // TODO: implement initState
    super.initState();
    _ambilMarker(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // ignore: duplicate_ignore
      appBar: AppBar(
        // ignore: prefer_const_constructors
        title: Text('Log History'),
        automaticallyImplyLeading: false,
      ),
      body: _loading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                children: [
                  SizedBox(height: 20),
                  OurContainer(
                    child: Column(
                      children: [
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: DataTable(
                            columns: const [
                              DataColumn(label: Text('Created At')),
                              DataColumn(label: Text('Kecamatan')),
                              DataColumn(label: Text('Tinggi Min')),
                              DataColumn(label: Text('Tinggi Maks')),
                              DataColumn(label: Text('Kordinat')),
                            ],
                            rows: _laporanAll.map((Map<String, dynamic> item) {
                              return DataRow(
                                cells: [
                                  DataCell(Text(
                                      '${item['created_at'].replaceAll('T', '').replaceAll('Z', '').substring(0, 5)}')),
                                  DataCell(Text('${item['nama_kecamatan']}')),
                                  DataCell(
                                      Text('${item['minimal_tinggi']} meter')),
                                  DataCell(
                                      Text('${item['maksimal_tinggi']} meter')),
                                  DataCell(IconButton(
                                    icon: const Icon(Icons.location_on_rounded),
                                    color: Colors.blue,
                                    onPressed: () {
                                      // _create bottom sheet
                                      showModalBottomSheet(
                                          context: context,
                                          builder: (BuildContext context) {
                                            return GoogleMap(
                                              scrollGesturesEnabled: false,
                                              tiltGesturesEnabled: false,
                                              rotateGesturesEnabled: false,
                                              initialCameraPosition:
                                                  CameraPosition(
                                                target: LatLng(
                                                    double.parse(
                                                        item['kordinat']['lat']
                                                            .toString()),
                                                    double.parse(
                                                        item['kordinat']['lng']
                                                            .toString())),
                                                zoom: 15,
                                              ),
                                              markers: {
                                                Marker(
                                                  markerId: MarkerId(
                                                      '${item['kordinat']['lat']}'),
                                                  position: LatLng(
                                                      double.parse(
                                                          item['kordinat']
                                                                  ['lat']
                                                              .toString()),
                                                      double.parse(
                                                          item['kordinat']
                                                                  ['lng']
                                                              .toString())),
                                                ),
                                              },
                                              circles: {
                                                Circle(
                                                  circleId: CircleId(
                                                      '${item['kordinat']['lat']}'),
                                                  center: LatLng(
                                                      double.parse(
                                                          item['kordinat']
                                                                  ['lat']
                                                              .toString()),
                                                      double.parse(
                                                          item['kordinat']
                                                                  ['lng']
                                                              .toString())),
                                                  radius: 100,
                                                  fillColor: Colors.blue
                                                      .withOpacity(0.2),
                                                  strokeWidth: 0,
                                                ),
                                              },
                                            );
                                          });
                                    },
                                  )),
                                ],
                              );
                            }).toList(),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
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
        currentIndex: 1,
        selectedItemColor: Colors.amber[800],
        onTap: (int value) {
          Bottom_Navigator.onTap(value, context);
        },
      ),
    );
  }
}
