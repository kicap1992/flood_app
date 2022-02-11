// ignore_for_file: file_names

import 'package:flutter/material.dart';

class OurContainer extends StatelessWidget {
  final Widget? child;

  const OurContainer({Key? key, this.child}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    final double left = (MediaQuery.of(context).size.width -
            (MediaQuery.of(context).size.width * 0.9)) /
        2;
    return Container(
      width: MediaQuery.of(context).size.width * 0.9,
      margin: EdgeInsets.only(left: left),
      padding: const EdgeInsets.only(left: 20, right: 20, bottom: 20, top: 10),
      decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: const [
            BoxShadow(
              color: Colors.grey,
              blurRadius: 10,
              spreadRadius: 1,
              offset: Offset(
                4,
                4,
              ),
            ),
          ]),
      child: child,
    );
  }
}
