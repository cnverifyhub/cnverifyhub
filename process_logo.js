const { Jimp } = require('jimp');

async function processLogo() {
  const imagePath = "C:/Users/sawmi/.gemini/antigravity/brain/f02814bd-fda7-4b3c-8d8e-6cbfb01bb9b7/media__1772837742501.png";
  
  console.log("Loading image...");
  const image = await Jimp.read(imagePath);
  
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  
  console.log(`Dimensions: ${width}x${height}`);

  // Background color top-left
  const bgColorInt = image.getPixelColor(0, 0);
  const bgR = (bgColorInt >> 24) & 0xff;
  const bgG = (bgColorInt >> 16) & 0xff;
  const bgB = (bgColorInt >> 8) & 0xff;
  
  console.log(`Detected background: ${bgR},${bgG},${bgB}`);
  
  // Create a tracking array for non-bg pixels
  let rowHasPixels = new Array(height).fill(false);
  let colHasPixels = new Array(width).fill(false);
  
  // Make transparent
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = image.getPixelColor(x, y);
      const r = (color >> 24) & 0xff;
      const g = (color >> 16) & 0xff;
      const b = (color >> 8) & 0xff;
      
      const dist = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
      
      // If close to bg, make transparent
      if (dist < 40) {
        image.setPixelColor(0x00000000, x, y);
      } else {
        rowHasPixels[y] = true;
        colHasPixels[x] = true;
      }
    }
  }
  
  console.log("Detecting text gap...");
  // Look for a gap row in the bottom half
  let textStartY = height;
  for (let y = Math.floor(height * 0.5); y < height; y++) {
    if (!rowHasPixels[y]) {
      // Find where pixels start again to be safe
      textStartY = y;
      break;
    }
  }
  
  if (textStartY < height) {
    console.log(`Gap detected at Y=${textStartY}, cropping out logo text`);
    for (let y = textStartY; y < height; y++) {
      for (let x = 0; x < width; x++) {
         image.setPixelColor(0x00000000, x, y);
         rowHasPixels[y] = false;
      }
    }
  }
  
  // Find tight bounding box
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    if (rowHasPixels[y]) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  for (let x = 0; x < width; x++) {
    if (colHasPixels[x]) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
  }
  
  console.log(`Cropping to tight bounds: ${minX},${minY} => ${maxX},${maxY}`);
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  image.crop({x: minX, y: minY, w: cropW, h: cropH});
  
  // To make it square with padding, create a new transparent image
  const size = Math.floor(Math.max(cropW, cropH) * 1.15);
  const offsetX = Math.floor((size - cropW) / 2);
  const offsetY = Math.floor((size - cropH) / 2);
  
  console.log(`Pasting onto square canvas of size ${size}`);
  const square = await new Jimp({ width: size, height: size, color: 0x00000000 });
  square.composite(image, offsetX, offsetY);
  
  // Save logo.png
  console.log("Saving public/logo.png");
  await square.write("public/logo.png");
  
  // Resize and save icon
  console.log("Saving public/icon.png (for favicon)");
  square.resize({ w: 64, h: 64 });
  await square.write("public/icon.png"); // Next.js uses icon.png / favicon.ico
  await square.write("public/favicon.ico"); 
  
  console.log("Done!");
}

processLogo().catch(console.error);
