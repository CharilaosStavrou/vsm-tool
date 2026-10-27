// Browser file helpers: JSON download and PNG export of a DOM element.
import { toCanvas } from 'html-to-image';

// "Steel bracket SB-200" → "vsm-steel-bracket-sb-200"
export function getFileBaseName(productName) {
  const slug = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug ? `vsm-${slug}` : 'vsm';
}

export function downloadJson(data, fileName) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  downloadUrl(url, fileName);
  URL.revokeObjectURL(url);
}

// Renders the elements one below the other into a single PNG with a white margin.
// Each element is captured at its full size, even when it is scrolled out of view.
// Elements marked with the class "no-export" (e.g. buttons) are left out.
export async function downloadPng(elements, fileName) {
  const pixelRatio = 2;
  const padding = 24 * pixelRatio;
  const spacing = 24 * pixelRatio;

  const images = await Promise.all(
    elements.map((element) => {
      // Round up so fractional widths do not clip the right-most border.
      const { width, height } = element.getBoundingClientRect();
      return toCanvas(element, {
        backgroundColor: '#ffffff',
        pixelRatio,
        width: Math.ceil(Math.max(width, element.scrollWidth)),
        height: Math.ceil(Math.max(height, element.scrollHeight)),
        // The copy would otherwise keep the on-screen centering margin and be shifted.
        style: { margin: '0' },
        filter: (node) => !node.classList?.contains('no-export'),
      });
    }),
  );

  const output = document.createElement('canvas');
  output.width = Math.max(...images.map((image) => image.width)) + padding * 2;
  output.height =
    images.reduce((total, image) => total + image.height, 0) +
    spacing * (images.length - 1) +
    padding * 2;

  const context = output.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, output.width, output.height);
  let y = padding;
  for (const image of images) {
    context.drawImage(image, padding, y);
    y += image.height + spacing;
  }

  downloadUrl(output.toDataURL('image/png'), fileName);
}

function downloadUrl(url, fileName) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
}
