const video = document.getElementById('video');

function toggleMirror() {
  video.style.transform = video.style.transform === 'scaleX(-1)' ? 'scaleX(1)' : 'scaleX(-1)';
}


navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream; 
  })

  .catch((err) => {
    console.error("Error accessing the camera: ", err);
  });
