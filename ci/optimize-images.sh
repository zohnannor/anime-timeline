#!/bin/bash

# Configuration
if [ $# -eq 0 ]; then
    echo "Error: Title argument is required"
    echo "Usage: $0 <title>"
    exit 1
fi

TITLE="$1" # Manga/Anime title
CPU="${CPU:-32}"                         # Number of parallel processes
MAIN_DIR="./public/${TITLE}"             # Original images directory
THUMB_DIR="./public/${TITLE}-thumbnails" # Thumbnails directory

# Quality Settings
MAIN_QUALITY=50  # WebP quality for main images
THUMB_QUALITY=10 # WebP quality for thumbnails
MAIN_WIDTH=800   # Main image max width
THUMB_WIDTH=100  # Thumbnail max width

if [ ! -d $MAIN_DIR ]; then
    echo "Error: Directory for \"$TITLE\" does not exist"
    exit 1
fi

# ------------------------------------------------------------------------------
# Functions
# ------------------------------------------------------------------------------

# Convert orphan WebP images to PNG (if no PNG/JPG/JPEG exists)
convert_orphan_webp() {
  local webp="$1"
  local base="${webp%.webp}"
  # Check if any of the common image formats exist (case-insensitive)
  if [[ ! -e "$base.png" && ! -e "$base.jpg" && ! -e "$base.jpeg" &&
    ! -e "$base.PNG" && ! -e "$base.JPG" && ! -e "$base.JPEG" ]]; then
    echo "Converting orphan WebP: $webp → ${base}.png"
    magick "$webp" "${base}.png"
  fi
}

# Process a single image (resize + convert to WebP without modifying originals)
process_image() {
  local src="$1"
  local quality="$2"
  local max_width="$3"
  local webp_dest="${src%.*}.webp"

  # Create WebP version without altering original
  magick "$src" -resize "${max_width}>" -strip -quality 100 "$webp_dest"
  cwebp -q "$quality" -m 6 -sharp_yuv "$webp_dest" -o "$webp_dest"
}

# Generate thumbnail version from original
generate_thumbnail() {
  local src="$1"
  local rel_path="${src#$MAIN_DIR/}"
  local thumb_dest="$THUMB_DIR/${rel_path%.*}.webp"

  mkdir -p "$(dirname "$thumb_dest")"
  magick "$src" -resize "${THUMB_WIDTH}>" -strip -quality "$THUMB_QUALITY" "$thumb_dest"
}

# ------------------------------------------------------------------------------
# Main Script
# ------------------------------------------------------------------------------

# Show usage if help requested
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
  echo "Usage: $0 <title>"
  echo "  title: Manga/Anime title"
  echo "         Sets main directory to ./public/<title>"
  echo "         Sets thumbnails directory to ./public/<title>-thumbnails"
  exit 0
fi

echo "Using title: $TITLE"
echo "Main directory: $MAIN_DIR"
echo "Thumbnails directory: $THUMB_DIR"

# Create directories if they don't exist
mkdir -p "$THUMB_DIR"

# Step 0: Convert orphan WebP images to PNG (if no PNG/JPG/JPEG exists)
export -f convert_orphan_webp
export MAIN_DIR
find "$MAIN_DIR" -iname "*.webp" -print0 |
  xargs -0 -P "$CPU" -I {} bash -c 'convert_orphan_webp "$@"' _ {}

# Step 1: Create thumbnails from originals
export -f generate_thumbnail
export MAIN_DIR THUMB_DIR THUMB_WIDTH THUMB_QUALITY
find "$MAIN_DIR" \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0 |
  xargs -0 -P "$CPU" -I {} bash -c 'generate_thumbnail "$@"' _ {}

# Step 2: Create optimized WebP versions (keep originals)
export -f process_image
export MAIN_QUALITY MAIN_WIDTH
find "$MAIN_DIR" \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0 |
  xargs -0 -P "$CPU" -I {} bash -c 'process_image "$@" $MAIN_QUALITY $MAIN_WIDTH' _ {}

# Step 2.1: Special handling for key visual (preserve original)
case $TITLE in
  csm)
    magick "$MAIN_DIR/Chainsaw_Man_Anime_Key_Visual_1.png" -resize "1000>" -strip -quality 80 "$MAIN_DIR/Chainsaw_Man_Anime_Key_Visual_1.webp"
    ;;
  berserk)
    magick "$MAIN_DIR/Berserk_Anime_Box_Art.png" -resize "1000>" -strip -quality 80 "$MAIN_DIR/Berserk_Anime_Box_Art.webp"
    ;;
  frieren)
    magick "$MAIN_DIR/Season_1_key_visual_3.png" -resize "1000>" -strip -quality 80 "$MAIN_DIR/Season_1_key_visual_3.webp"
    magick "$MAIN_DIR/Season_2_key_visual_3.png" -resize "1000>" -strip -quality 80 "$MAIN_DIR/Season_2_key_visual_3.webp"
    ;;
esac

# Final size report
echo -e "\nMain images size (WebP versions):"
find "$MAIN_DIR" -name '*.webp' -exec du -ch {} + | grep total
echo "Thumbnails size:"
find "$THUMB_DIR" -name '*.webp' -exec du -ch {} + | grep total

# script by deepseek-r1 my goat
