// Each filter has:
//   name       - display label
//   cssFilter  - CSS filter string applied live to the <video> element
//   apply(ctx, w, h) - canvas pixel manipulation applied at capture time

export const FILTERS = [
  {
    name: 'No Filter',
    cssFilter: 'none',
    apply: () => {},
  },
  {
    name: 'Black & White',
    cssFilter: 'grayscale(100%)',
    apply: (ctx, w, h) => {
      const d = ctx.getImageData(0, 0, w, h);
      for (let i = 0; i < d.data.length; i += 4) {
        const g = d.data[i] * 0.299 + d.data[i + 1] * 0.587 + d.data[i + 2] * 0.114;
        d.data[i] = d.data[i + 1] = d.data[i + 2] = g;
      }
      ctx.putImageData(d, 0, 0);
    },
  },
  {
    name: 'Sepia',
    cssFilter: 'sepia(100%)',
    apply: (ctx, w, h) => {
      const d = ctx.getImageData(0, 0, w, h);
      for (let i = 0; i < d.data.length; i += 4) {
        const r = d.data[i], g = d.data[i + 1], b = d.data[i + 2];
        d.data[i]     = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        d.data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        d.data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
      ctx.putImageData(d, 0, 0);
    },
  },
  {
    name: 'Old Photo',
    cssFilter: 'sepia(80%) contrast(90%) brightness(85%)',
    apply: (ctx, w, h) => {
      const d = ctx.getImageData(0, 0, w, h);
      for (let i = 0; i < d.data.length; i += 4) {
        const r = d.data[i], g = d.data[i + 1], b = d.data[i + 2];
        const bw = r * 0.299 + g * 0.587 + b * 0.114;
        d.data[i]     = Math.min(255, bw * 1.1 + 20);
        d.data[i + 1] = Math.min(255, bw * 0.95 + 10);
        d.data[i + 2] = Math.min(255, bw * 0.75);
      }
      ctx.putImageData(d, 0, 0);
      // Vignette
      const gradient = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.9);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.45)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    },
  },
  {
    name: 'Vivid',
    cssFilter: 'saturate(200%) contrast(110%) brightness(105%)',
    apply: (ctx, w, h) => {
      const d = ctx.getImageData(0, 0, w, h);
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i]     = Math.min(255, d.data[i]     * 1.3);
        d.data[i + 1] = Math.min(255, d.data[i + 1] * 1.15);
        d.data[i + 2] = Math.min(255, d.data[i + 2] * 1.2);
      }
      ctx.putImageData(d, 0, 0);
    },
  },
  {
    name: 'Mirror',
    cssFilter: 'none',
    apply: (ctx, w, h) => {
      const tmp = document.createElement('canvas');
      tmp.width = w; tmp.height = h;
      tmp.getContext('2d').drawImage(ctx.canvas, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(tmp, 0, 0);
      ctx.restore();
    },
  },
];
