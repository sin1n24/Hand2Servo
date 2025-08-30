# Web-based Hand Tracking and Finger Angle Detection

This project uses MediaPipe's Hand Landmarker to perform real-time hand tracking from a webcam feed directly in the browser. It calculates the angles of each of the five fingers and sends this data over the Web Serial API.

## Features

- **Real-time Hand Tracking:** Utilizes the MediaPipe Hand Landmarker model to detect hand landmarks.
- **Finger Angle Calculation:** Calculates the angle of each finger based on the detected landmarks.
- **Web Serial API Integration:** Sends the calculated finger angles to a connected device (like an Arduino or other microcontroller) via the Web Serial API.
- **Browser-based:** Runs entirely in the web browser without requiring any server-side setup.

## How to Run

1.  Clone this repository.
2.  You need a local web server to run this project due to browser security policies (CORS). A simple way to do this is to use Python's built-in HTTP server.
    -   If you have Python 3, run the following command in the project's root directory:
        ```bash
        python -m http.server
        ```
    -   If you have Python 2, use:
        ```bash
        python -m SimpleHTTPServer
        ```
3.  Open your web browser and navigate to `http://localhost:8000` (or the port specified by your server).
4.  Click the "Start Camera" button to begin hand tracking.
5.  To send data over serial, connect a compatible device and click the "Start Serial" button.

## Reference

This project was created with reference to the following article:

-   [ブラウザだけで始めるハンドトラッキング - Zenn](https://zenn.dev/tkada/articles/600efba2db186b)
