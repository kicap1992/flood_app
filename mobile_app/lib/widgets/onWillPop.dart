import 'package:flutter/material.dart';
import 'dart:async';

class Will_Pop {
  static Future<bool> willpop(BuildContext context) async {
    return (await showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Yakin?'),
            content: const Text('Anda Akan Keluar Dari Aplikasi'),
            actions: <Widget>[
              ElevatedButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: const Text('Tidak'),
              ),
              ElevatedButton(
                onPressed: () => Navigator.of(context).pop(true),
                style: ElevatedButton.styleFrom(
                  primary: Colors.red,
                ),
                child: const Text('Ya'),
              ),
            ],
          ),
        )) ??
        false;
  }
}
