from PIL import Image
import os

# Load your tileset
tileset = Image.open("tile_sheet.png")

TILE_SIZE = 33
TILESET_COLS = tileset.width // TILE_SIZE + 1
TILESET_ROWS = tileset.height // TILE_SIZE + 1

# Output folder
os.makedirs("slices", exist_ok=True)

count = 0
for r in range(TILESET_ROWS):
    for c in range(TILESET_COLS):
        # Crop (left, upper, right, lower)
        left   = c * TILE_SIZE
        upper  = r * TILE_SIZE
        right  = left + TILE_SIZE
        lower  = upper + TILE_SIZE
        tile = tileset.crop((left, upper, right, lower))

        # Save as zero-padded ID
        tile.save(f"slices/tile_{1+count:03d}_c{c}_r{r}.png")
        count += 1

print(f"✅ Done! {count} tiles saved in ./slices/")
