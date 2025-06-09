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

const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');

function capture() {
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert canvas to image
  const imageData = canvas.toDataURL('image/png');
  photo.src = imageData;
}
