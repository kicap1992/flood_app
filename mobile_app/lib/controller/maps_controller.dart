import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app/global.dart' as globals;
import 'package:http/http.dart' as http;

class MapsController extends ChangeNotifier {
  // ignore: non_constant_identifier_names
  Future<Map> ambil_marker() async {
    //create string result
    Map<String, dynamic> result;

    try {
      final response = await http
          .get(Uri.parse("${globals.http_to_server}area_banjir"), headers: {
        "Accept": "application/json",
        // "authorization":
        //     "Basic ${base64Encode(utf8.encode("Kicap_karan:bb10c6d9f01ec0cb16726b59e36c2f73"))}",
        // "crossDomain": "true"
      });
      final data = jsonDecode(response.body);
      result = data;
    } catch (e) {
      result = {"status": "error", "message": e.toString()};
    }

    return result;
  }

  // ignore: non_constant_identifier_names
  Future<Map> ambil_polygon() async {
    //create string result
    Map<String, dynamic> result;

    try {
      final response = await http
          .get(Uri.parse("${globals.http_to_server}maps/kabupaten"), headers: {
        "Accept": "application/json",
        // "authorization":
        //     "Basic ${base64Encode(utf8.encode("Kicap_karan:bb10c6d9f01ec0cb16726b59e36c2f73"))}",
        // "crossDomain": "true"
      });
      final data = jsonDecode(response.body);
      result = data;
    } catch (e) {
      result = {"status": "error", "message": e.toString()};
    }

    return result;
  }
}
