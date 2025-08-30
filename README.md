# Web-based Hand Tracking and Finger Angle Detection

This project uses MediaPipe's Hand Landmarker to perform real-time hand tracking from a webcam feed directly in the browser. It calculates the angles of each of the five fingers and sends this data over the Web Serial API.

## Features

- **Real-time Hand Tracking:** Utilizes the MediaPipe Hand Landmarker model to detect hand landmarks.
- **Finger Angle Calculation:** Calculates the angle of each finger based on the detected landmarks.
- **Web Serial API Integration:** Sends the calculated finger angles to a connected device (like an Arduino or other microcontroller) via the Web Serial API.
- **Browser-based:** Runs entirely in the web browser without requiring any server-side setup.

## How to Run

This project is deployed using GitHub Pages. You can try the live demo by accessing the `index.html` file through your GitHub Pages URL for this repository.

The application can be accessed directly via GitHub Pages at the following link:

[**Live Demo (./index.html)**](./index.html)

Once the page is loaded:
1.  Click the "Start Camera" button and grant camera permissions.
2.  To send data over serial, connect a compatible device and click the "Start Serial" button.

## Reference

This project was created with great reference to the following article. My heartfelt thanks to the author for the valuable information.

-   [ブラウザだけで始めるハンドトラッキング - Zenn](https://zenn.dev/tkada/articles/600efba2db186b)
