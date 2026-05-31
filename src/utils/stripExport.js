/**
 * Creates a film-strip PNG from an array of photo data URLs.
 * Returns a Promise that resolves with the strip data URL.
 */
export function createStripImage(photos) {
  return new Promise((resolve) => {
    const frameW = 300, frameH = 220;
    const padding = 16;
    const holeSize = 14, holeH = 18, holeGap = 14;
    const sprocketRowH = 36;
    const labelH = 20;
    const totalW = frameW * photos.length + padding * 2;
    const totalH = sprocketRowH * 2 + labelH * 2 + frameH + padding;

    const sc = document.createElement('canvas');
    sc.width = totalW;
    sc.height = totalH;
    const ctx = sc.getContext('2d');

    // Background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, totalW, totalH);

    // Sprocket rows (dark bands top & bottom)
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, totalW, sprocketRowH);
    ctx.fillRect(0, totalH - sprocketRowH, totalW, sprocketRowH);

    // Sprocket holes top
    for (let x = padding; x < totalW - padding; x += holeSize + holeGap) {
      roundRect(ctx, x, (sprocketRowH - holeH) / 2, holeSize, holeH, 3);
      ctx.fillStyle = '#1a1a1a';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Sprocket holes bottom
    for (let x = padding; x < totalW - padding; x += holeSize + holeGap) {
      roundRect(ctx, x, totalH - sprocketRowH + (sprocketRowH - holeH) / 2, holeSize, holeH, 3);
      ctx.fillStyle = '#1a1a1a';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Film labels
    ctx.fillStyle = '#c9a84c22';
    ctx.fillRect(0, sprocketRowH, totalW, labelH);
    ctx.fillRect(0, sprocketRowH + labelH + frameH, totalW, labelH);

    ctx.fillStyle = '#c9a84c88';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('FOTOFORFUN  ✦  ISO 400  ✦  35mm', padding + 10, sprocketRowH + 14);
    ctx.fillText('✦ 1 ✦ 2 ✦ 3 ✦  DO NOT BEND  ✦  FOTOFORFUN', padding + 10, sprocketRowH + labelH + frameH + 14);

    // Load & draw each photo
    let loaded = 0;
    photos.slice(0, 3).forEach((src, i) => {
      const img = new Image();
      img.onload = () => {
        const fx = padding + i * frameW;
        const fy = sprocketRowH + labelH;
        ctx.drawImage(img, fx, fy, frameW, frameH);

        // Frame border
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ctx.strokeRect(fx, fy, frameW, frameH);

        // Frame number
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '11px monospace';
        ctx.fillText('▲ ' + (i + 1), fx + frameW - 28, fy + frameH - 6);

        if (++loaded === photos.length) {
          resolve(sc.toDataURL('image/png'));
        }
      };
      img.src = src;
    });
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function downloadImage(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export async function shareImage(dataUrl, filename) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], filename, { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: 'FotoForFun', text: 'My FotoForFun photo!' });
  } else {
    alert('Sharing not supported on this device.');
  }
}
