import {
  HandLandmarker,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

import Stats  from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js';

const init = async () =>{
  const stats = new Stats();
  document.body.appendChild(stats.dom);
  
  const video = document.getElementById("input_video");
  const canvasElement = document.getElementById("output_canvas"); 
  const canvasCtx = canvasElement.getContext("2d");
  const startButton = document.getElementById("start-camera-button");

  canvasElement.style.display = "none";

  const vision = await FilesetResolver.forVisionTasks(
    // path/to/wasm/root
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const handLandmarker = await HandLandmarker.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath: "./hand_landmarker.task", //.taskファイルを指定する
          delegate: "CPU" //CPU or GPUで処理するかを指定する
        },
        numHands: 2 //認識できる手の数
      });
  
  await handLandmarker.setOptions({ runningMode: "video" });

  let lastVideoTime = -1;

  const calculateAngle = (p1, p2, p3) => {
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y, z: p3.z - p2.z };

    const dotProduct = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    const magnitudeV1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
    const magnitudeV2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);

    const angle = Math.acos(dotProduct / (magnitudeV1 * magnitudeV2));
    return angle * (180 / Math.PI);
  };

  const fingerInfoElements = {
    thumb: document.getElementById("thumb-info"),
    index: document.getElementById("index-info"),
    middle: document.getElementById("middle-info"),
    ring: document.getElementById("ring-info"),
    little: document.getElementById("little-info"),
  };

  const initialFingerInfo = {};
  for (const finger in fingerInfoElements) {
    initialFingerInfo[finger] = fingerInfoElements[finger].textContent;
  }

  const renderLoop = () => {
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    let startTimeMs = performance.now();
    if (video.currentTime > 0 && video.currentTime !== lastVideoTime) {
      const results = handLandmarker.detectForVideo(video,startTimeMs);
      lastVideoTime = video.currentTime;
      
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0]; // Assuming one hand for simplicity

        // Draw landmarks and connectors
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 5 });
        drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });

        // Define finger landmark triplets
        const fingerTriplets = {
          thumb: [2, 1, 0],
          index: [6, 5, 0],
          middle: [10, 9, 0],
          ring: [14, 13, 0],
          little: [18, 17, 0],
        };

        // Calculate and display angles
        for (const finger in fingerTriplets) {
          const [p1_idx, p2_idx, p3_idx] = fingerTriplets[finger];
          const p1 = landmarks[p1_idx];
          const p2 = landmarks[p2_idx];
          const p3 = landmarks[p3_idx];
          const angle = calculateAngle(p1, p2, p3);

          const infoElement = fingerInfoElements[finger];
          const originalText = initialFingerInfo[finger].split(':')[0];
          infoElement.textContent = `${originalText}: ${angle.toFixed(0)}ﾂｰ`;
        }
      }
      canvasCtx.restore();
    }

    requestAnimationFrame(() => {
      stats.begin();
      renderLoop();
      stats.end();
    });
  }

  startButton.addEventListener("click", () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
          video.addEventListener("loadeddata", () => {
            startButton.style.display = "none";
            canvasElement.style.display = "block";
            renderLoop();
          });
          video.play();
        })
        .catch(function (error) {
          console.error("Error accessing the camera: ", error);
          alert("Error accessing the camera. Please check permissions and try again.");
        });
    } else {
      alert("Sorry, your browser does not support the camera API.");
    }
  });
}


init();