import 'package:flutter/material.dart';
import 'package:mobile_app/controller/maps_controller.dart';
import 'package:mobile_app/pages/map_screen.dart';
import 'package:provider/provider.dart';
// import 'package:google_maps_flutter/google_maps_flutter.dart';
// import 'dart:collection';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MapsController(),
      child: MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: const MapScreen(),
      ),
    );
  }
}
