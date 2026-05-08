import sys
from PIL import Image

def process_logo(input_path, output_png, output_ico):
    print("Opening image...")
    img = Image.open(input_path).convert("RGBA")
    
    # Get data
    data = img.getdata()
    
    new_data = []
    # The background is likely a light gray/off-white. 
    # Let's find the background color from the top left pixel.
    bg_color = data[0]
    print(f"Detected background color: {bg_color}")
    
    # We will compute color distance. If it's close to the background, make it transparent.
    # The N itself has strong orange/red/yellow colors.
    for item in data:
        # Distance to background
        dist = sum(abs(a - b) for a, b in zip(item[:3], bg_color[:3]))
        if dist < 30: # Tolerance
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Now we need to crop it to the bounding box of the non-transparent pixels
    print("Cropping...")
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    # The user only wants the "N", not the text "CNWEPRO".
    # The text is usually at the bottom. We can crop the top portion.
    # We can detect the vertical gap between the N and the text, or just crop the top 70%.
    # Let's look at the density of non-transparent pixels horizontally to find the gap.
    width, height = img.size
    row_density = []
    for y in range(height):
        row = [img.getpixel((x, y))[3] for x in range(width)]
        row_density.append(sum(1 for a in row if a > 0))
        
    # Find a gap (low density) in the lower half
    split_y = height
    for y in range(int(height * 0.5), height):
        if row_density[y] == 0:
            split_y = y
            break
            
    if split_y < height:
        print(f"Found gap at y={split_y}, cropping out text.")
        img = img.crop((0, 0, width, split_y))
        
    # Final crop to tight bounding box again
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    # Make it square
    w, h = img.size
    size = max(w, h)
    # Add some padding
    size = int(size * 1.1)
    square = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    square.paste(img, ((size - w) // 2, (size - h) // 2))
    
    print(f"Saving {output_png}...")
    square.save(output_png)
    
    print(f"Saving {output_ico}...")
    # Resize for favicon
    icon_sizes = [(16,16), (32,32), (48,48), (64,64)]
    square.save(output_ico, format='ICO', sizes=icon_sizes)
    print("Done!")

if __name__ == "__main__":
    process_logo(sys.argv[1], sys.argv[2], sys.argv[3])
