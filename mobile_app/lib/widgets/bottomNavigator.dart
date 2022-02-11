// ignore: file_names
// ignore_for_file: file_names, duplicate_ignore, camel_case_types

import 'package:flutter/material.dart';

import '../pages/log_history.dart';
import '../pages/map_screen.dart';

class Bottom_Navigator {
  static void onTap(int value, BuildContext context) {
    if (value == 0) {
      Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const MapScreen()),
          (Route<dynamic> route) => false);
    } else if (value == 1) {
      Navigator.push(context,
          MaterialPageRoute(builder: (context) => const Log_History()));
    }
  }
}
