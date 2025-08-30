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
          modelAssetPath: "./hand_landmarker.task", //.task�t�@�C�����w�肷��
          delegate: "CPU" //CPU or GPU�ŏ������邩���w�肷��
        },
        numHands: 2 //�F���ł����̐�
      });
  
  await handLandmarker.setOptions({ runningMode: "video" });

  let lastVideoTime = -1;

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
      if (results.landmarks) {
        for (const landmarks of results.landmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 5
          });
          drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
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