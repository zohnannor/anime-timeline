#!/bin/bash

# Configuration
if [ $# -eq 0 ]; then
    echo "Error: Title argument is required"
    echo "Usage: $0 <title>"
    echo "       $0 --all"
    echo "       $0 --help"
    exit 1
fi

TITLE="$1"                               # Manga/Anime title
CPU="${CPU:-32}"                         # Number of parallel processes
MAIN_DIR="./public/${TITLE}"             # Original images directory
THUMB_DIR="./public/${TITLE}-thumbnails" # Thumbnails directory

# Quality Settings
MAIN_QUALITY=50  # WebP quality for main images
THUMB_QUALITY=10 # WebP quality for thumbnails
MAIN_WIDTH=800   # Main image max width
THUMB_WIDTH=100  # Thumbnail max width

# ------------------------------------------------------------------------------
# Functions
# ------------------------------------------------------------------------------

run_parallel() {
    local pattern="$1"
    local command="$2"
    echo "Running: $command with pattern: $pattern"

    local file_count=$(eval "find \"$MAIN_DIR\" $pattern" | wc -l)
    echo "Found $file_count files to process"

    if [ $file_count -gt 0 ]; then
        eval "find \"$MAIN_DIR\" $pattern -print0" | xargs -0 -P "$CPU" -I {} bash -c "$command" _ {}
        echo "Completed processing $file_count files"
    else
        echo "No files to process"
    fi
    echo
}

# Convert orphan WebP images to PNG (if no PNG/JPG/JPEG exists)
convert_orphan_webp() {
    local webp="$1"
    local base="${webp%.webp}"
    # Check if any of the common image formats exist (case-insensitive)
    if [[ ! -e "$base.png" && ! -e "$base.jpg" && ! -e "$base.jpeg" &&
          ! -e "$base.PNG" && ! -e "$base.JPG" && ! -e "$base.JPEG" ]]; then
        echo "Converting orphan WebP: $webp -> ${base}.png"
        magick "$webp" "${base}.png"
    else
        echo "Skipping (has original): $webp"
    fi
}

# Process a single image (resize + convert to WebP without modifying originals)
process_image() {
    local src="$1"
    local webp_dest="${src%.*}.webp"

    # Skip if WebP already exists and is newer than source
    if [ -f "$webp_dest" ] && [ "$webp_dest" -nt "$src" ]; then
        echo "Skipping (up to date): $src"
        return 0
    fi

    echo "Processing image: $src -> $webp_dest"
    # Create WebP version without altering original
    magick "$src" -resize "${MAIN_WIDTH}>" -strip -quality 100 "$webp_dest"
    cwebp -q "$MAIN_QUALITY" -m 6 -sharp_yuv "$webp_dest" -o "$webp_dest"
}

# Generate thumbnail version from original
generate_thumbnail() {
    local src="$1"
    local rel_path="${src#$MAIN_DIR/}"
    local thumb_dest="$THUMB_DIR/${rel_path%.*}.webp"

    # Skip if thumbnail already exists and is newer than source
    if [ -f "$thumb_dest" ] && [ "$thumb_dest" -nt "$src" ]; then
        echo "Skipping thumbnail (up to date): $src"
        return 0
    fi

    echo "Generating thumbnail: $src -> $thumb_dest"
    mkdir -p "$(dirname "$thumb_dest")"
    magick "$src" -resize "${THUMB_WIDTH}>" -strip -quality "$THUMB_QUALITY" "$thumb_dest"
}

process_special_image() {
    local src="$1"
    local full_src="$MAIN_DIR/$src"
    local webp_dest="${full_src%.*}.webp"

    # Skip if special WebP already exists and is newer than source
    if [ -f "$webp_dest" ] && [ "$webp_dest" -nt "$full_src" ]; then
        echo "Skipping special (up to date): $src"
        return 0
    fi

    echo "Processing special image: $src"
    magick "$full_src" -resize "1000>" -strip -quality 80 "$webp_dest"
}

# Find all anime titles in the public directory
find_all_titles() {
    # Look for directories that match the pattern of having a thumbnails counterpart
    # This finds all directories that don't end with "-thumbnails" and aren't "index.html"
    find ./public -maxdepth 1 -type d ! -name "*-thumbnails" ! -name "index.html" ! -name "." ! -name "public" | \
    while read dir; do
        if [ "$dir" != "./public" ]; then
            basename "$dir"
        fi
    done
}

# ------------------------------------------------------------------------------
# Main Script
# ------------------------------------------------------------------------------

# Show usage if help requested
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    echo "Usage: $0 <title>"
    echo "       $0 --all"
    echo "       $0 --help"
    echo "       title: Manga/Anime title"
    echo "              Sets main directory to ./public/<title>"
    echo "              Sets thumbnails directory to ./public/<title>-thumbnails"
    echo "       --all: Process all anime titles found in ./public directory"
    echo "  -h, --help: Show this help message"
    exit 0
fi

# Handle --all flag
if [[ "$1" == "--all" ]]; then
    echo "Finding all anime titles in ./public directory..."
    titles=$(find_all_titles)
    
    if [ -z "$titles" ]; then
        echo "No anime titles found in ./public directory"
        exit 1
    fi
    
    echo "Found titles:"
    echo "$titles"
    echo
    
    # Process each title by calling this script recursively
    echo "$titles" | while read title; do
        echo "========================================================================"
        echo "Processing: $title"
        echo "========================================================================"
        bash "$0" "$title"
        echo
    done
    
    echo "========================================================================"
    echo "All titles processed successfully!"
    exit 0
fi

if [ ! -d $MAIN_DIR ]; then
    echo "Error: Directory for \"$TITLE\" does not exist"
    exit 1
fi

echo "Using title: $TITLE"
echo "Main directory: $MAIN_DIR"
echo "Thumbnails directory: $THUMB_DIR"
echo

# Create directories if they don't exist
mkdir -p "$THUMB_DIR"

# Export functions
export -f convert_orphan_webp process_image generate_thumbnail process_special_image
export MAIN_DIR THUMB_DIR THUMB_WIDTH THUMB_QUALITY MAIN_QUALITY MAIN_WIDTH

# Step 0: Convert orphan WebP images to PNG (if no PNG/JPG/JPEG exists)
echo "=== Converting orphan WebP images to PNG ==="
run_parallel '-iname "*.webp"' 'convert_orphan_webp "$@"'

# Step 1: Create thumbnails from originals
echo "=== Generating thumbnails ==="
run_parallel '\( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \)' 'generate_thumbnail "$@"'

# Step 2: Create optimized WebP versions (keep originals)
echo "=== Creating optimized WebP versions ==="
run_parallel '\( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \)' 'process_image "$@"'

# Step 2.1: Special handling for key visual (preserve original)
echo "=== Processing special images ==="
case $TITLE in
    csm)
        process_special_image "Chainsaw_Man_Anime_Key_Visual_1.png"
        ;;
    berserk)
        process_special_image "Berserk_Anime_Box_Art.png"
        process_special_image "V3-Cover_Art-Manga.png"
        process_special_image "V5-Cover_Art-Manga.png"
        process_special_image "V18-Cover_Art-Manga.png"
        process_special_image "V34-Cover_Art-Manga.png"
        process_special_image "V38-Guts-Manga.png"
        ;;
    frieren)
        process_special_image "Season_1_key_visual_3.png"
        process_special_image "Season_2_key_visual_3.png"
        ;;
    eva)
        process_special_image "End_of_Evangelion_poster.jpg"
        process_special_image "Neon_Genesis_Evangelion_logo.jpg"
        ;;
    aot)
        process_special_image "Attack_on_Titan_Season_1.jpg"
        process_special_image "Attack_on_Titan_Season_2_Official_Poster.png"
        process_special_image "Attack_on_Titan_Season_3.jpg"
        process_special_image "Attack_on_Titan_Season_3_sixth_key_visual_(clean).jpg"
        process_special_image "Attack_on_Titan_The_Final_Season.jpg"
        process_special_image "Attack_on_Titan_The_Final_Season_Part_2_-_Key_Visual_6.jpg"
        process_special_image "Attack_on_Titan_Final_Season_Part_3_key_visual_8_(textless).jpg"
        process_special_image "Attack_on_Titan_Final_Season_Part_4_key_visual_9_(no_quotation).jpg"
        process_special_image "The_Female_Titan_battle.png"
        process_special_image "Clash_of_the_Titans.png"
        process_special_image "Erwin_and_Pixis_speaking.jpg"
        process_special_image "Eren_returns_home.jpg"
        process_special_image "Volume_23_Cover_-_Clean_Version.png"
        process_special_image "Volume_29_Cover_-_Clean_Version.png"
        ;;
esac
echo "Completed special images processing"
echo

# Final size report
echo "=== Size Report ==="
echo "Main images size (WebP versions):"
find "$MAIN_DIR" -name '*.webp' -exec du -ch {} + | grep total || echo "No WebP files found"
echo "Thumbnails size:"
find "$THUMB_DIR" -name '*.webp' -exec du -ch {} + | grep total || echo "No thumbnail files found"

# script by deepseek-r1 my goat
