#!/bin/bash

# Configuration
TITLE=""         # Manga/Anime title
CPU="${CPU:-32}" # Number of parallel processes
PROCESS_ALL=false
FORCE_MODE=false

# Quality Settings
MAIN_QUALITY=50  # WebP quality for main images
THUMB_QUALITY=10 # WebP quality for thumbnails
MAIN_WIDTH=800   # Main image max width
THUMB_WIDTH=100  # Thumbnail max width

# Special images configuration
declare -A SPECIAL_IMAGES=(
    [csm]="Chainsaw_Man_Anime_Key_Visual_1.png"
    [berserk]="Berserk_Anime_Box_Art.png \
               V3-Cover_Art-Manga.png \
               V5-Cover_Art-Manga.png \
               V18-Cover_Art-Manga.png \
               V34-Cover_Art-Manga.png \
               V38-Guts-Manga.png"
    [frieren]="Season_1_key_visual_3.png \
               Season_2_key_visual_3.png"
    [eva]="End_of_Evangelion_poster.jpg \
           Neon_Genesis_Evangelion_logo.jpg"
    [aot]="Attack_on_Titan_Season_1.jpg \
           Attack_on_Titan_Season_2_Official_Poster.png \
           Attack_on_Titan_Season_3.jpg \
           Attack_on_Titan_Season_3_sixth_key_visual_(clean).jpg \
           Attack_on_Titan_The_Final_Season.jpg \
           Attack_on_Titan_The_Final_Season_Part_2_-_Key_Visual_6.jpg \
           Attack_on_Titan_Final_Season_Part_3_key_visual_8_(textless).jpg \
           Attack_on_Titan_Final_Season_Part_4_key_visual_9_(no_quotation).jpg \
           The_Female_Titan_battle.png \
           Clash_of_the_Titans.png \
           Erwin_and_Pixis_speaking.jpg \
           Eren_returns_home.jpg \
           Volume_23_Cover_-_Clean_Version.png \
           Volume_29_Cover_-_Clean_Version.png"
    [opm]="Heroes_Spread.png \
           One-Punch_Man_TV_Anime_Key_Visual.png \
           One-Punch_Man_Anime_Season_2_Key_Visual.png \
           One-Punch_Man_Season_3_Key_Visual_2.png"
)

# ------------------------------------------------------------------------------
# Functions
# ------------------------------------------------------------------------------

# Check if an image is special
is_special_image() {
    local src="$1"
    local filename=$(basename "$src")

    # Check if current title has special images
    if [ -z "${SPECIAL_IMAGES[$TITLE]}" ]; then
        return 1
    fi

    # Check if this filename is in the special images list for the current title
    local special_list="${SPECIAL_IMAGES[$TITLE]}"
    for special_image in $special_list; do
        if [ "$filename" = "$special_image" ]; then
            return 0
        fi
    done
    return 1
}

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

# Convert orphan WebP and GIF images to PNG (if no PNG/JPG/JPEG exists)
convert_orphan_images() {
    local src="$1"
    local base="${src%.*}"
    # Check if any of the common image formats exist (case-insensitive)
    if [[ ! -e "$base.png" && ! -e "$base.jpg" && ! -e "$base.jpeg" &&
        ! -e "$base.PNG" && ! -e "$base.JPG" && ! -e "$base.JPEG" ]]; then
        echo "Converting orphan image: $src -> ${base}.png"
        # Extract only the first frame for animated WebP and GIF
        magick "$src[0]" -strip "${base}.png" &>/dev/null
    else
        echo "Skipping (has original): $src"
    fi
}

# Process a single image (resize + convert to WebP without modifying originals)
process_image() {
    local src="$1"
    local webp_dest="${src%.*}.webp"

    # Skip if this is a special image
    if is_special_image "$src"; then
        echo "Skipping special image in main processing: $src"
        return 0
    fi

    # Skip if WebP already exists and is newer than source (unless force mode)
    if [ "$FORCE_MODE" = "false" ] && [ -f "$webp_dest" ] && [ "$webp_dest" -nt "$src" ]; then
        echo "Skipping (up to date): $src"
        return 0
    fi

    echo "Processing image: $src -> $webp_dest"
    # Create WebP version without altering original
    magick "$src" -resize "${MAIN_WIDTH}>" -strip -quality 100 "$webp_dest" &>/dev/null
    cwebp -q "$MAIN_QUALITY" -m 6 -sharp_yuv "$webp_dest" -o "$webp_dest" &>/dev/null
}

# Generate thumbnail version from original
generate_thumbnail() {
    local src="$1"
    local rel_path="${src#$MAIN_DIR/}"
    local thumb_dest="$THUMB_DIR/${rel_path%.*}.webp"

    # Skip if thumbnail already exists and is newer than source (unless force mode)
    if [ "$FORCE_MODE" = "false" ] && [ -f "$thumb_dest" ] && [ "$thumb_dest" -nt "$src" ]; then
        echo "Skipping thumbnail (up to date): $src"
        return 0
    fi

    echo "Generating thumbnail: $src -> $thumb_dest"
    mkdir -p "$(dirname "$thumb_dest")"
    magick "$src" -resize "${THUMB_WIDTH}>" -strip -quality "$THUMB_QUALITY" "$thumb_dest" &>/dev/null
}

# Process all special images for current title
process_all_special_images() {
    local special_list="${SPECIAL_IMAGES[$TITLE]}"

    if [ -z "$special_list" ]; then
        echo "No special images defined for title: $TITLE"
        return 0
    fi

    echo "Processing special images for $TITLE:"
    for special_image in $special_list; do
        local full_src="$MAIN_DIR/$special_image"
        local webp_dest="${full_src%.*}.webp"

        # Skip if source doesn't exist
        if [ ! -f "$full_src" ]; then
            echo "Warning: Special image not found: $full_src"
            continue
        fi

        # Skip if WebP already exists and is newer than source (unless force mode)
        if [ "$FORCE_MODE" = "false" ] && [ -f "$webp_dest" ] && [ "$webp_dest" -nt "$full_src" ]; then
            echo "Skipping special (up to date): $full_src"
            continue
        fi

        echo "Processing special image: $full_src -> $webp_dest"
        # Use magick to resize and convert to WebP in one step
        magick "$full_src" -strip -quality 80 "WEBP:$webp_dest" &>/dev/null
    done
}

# Find all anime titles in the public directory
find_all_titles() {
    # Look for directories that match the pattern of having a thumbnails counterpart
    # This finds all directories that don't end with "-thumbnails" and aren't "index.html"
    find ./public -maxdepth 1 -type d ! -name "*-thumbnails" ! -name "index.html" ! -name "." ! -name "public" |
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
    echo "       $0 --force <title>"
    echo "       $0 --force --all"
    echo "       $0 --help"
    echo "       title: Manga/Anime title"
    echo "              Sets main directory to ./public/<title>"
    echo "              Sets thumbnails directory to ./public/<title>-thumbnails"
    echo "       --all: Process all anime titles found in ./public directory"
    echo "       --force: Force reprocessing of all images, ignoring timestamps"
    echo "  -h, --help: Show this help message"
    exit 0
fi

while [[ $# -gt 0 ]]; do
    case $1 in
    --force)
        FORCE_MODE=true
        shift
        ;;
    --all)
        PROCESS_ALL=true
        shift
        ;;
    -*)
        echo "Error: Unknown option $1"
        echo "Use --help for usage information"
        exit 1
        ;;
    *)
        if [ -z "$TITLE" ]; then
            TITLE="$1"
            shift
        else
            echo "Error: Unexpected argument: $1"
            echo "Use --help for usage information"
            exit 1
        fi
        ;;
    esac
done

# Handle --all flag
if [ "$PROCESS_ALL" = "true" ]; then
    echo "Finding all anime titles in ./public directory..."
    titles=$(find_all_titles)

    if [ -z "$titles" ]; then
        echo "No anime titles found in ./public directory"
        exit 1
    fi

    echo "Found titles:"
    echo "$titles"
    echo
    echo "Force mode: $FORCE_MODE"

    echo "Source images found: $(find "public" -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | wc -l)"
    echo "Existing WebP files: $(find "public" -name "*.webp" | wc -l)"

    # Process each title by calling this script recursively
    echo "$titles" | while read title; do
        echo "========================================================================"
        echo "Processing: $title"
        echo "========================================================================"
        cmd="$0"
        if [ "$FORCE_MODE" = "true" ]; then
            cmd="$cmd --force"
        fi
        cmd="$cmd \"$title\""

        eval "bash $cmd"
        echo
    done

    echo "========================================================================"
    echo "All titles processed successfully!"
    exit 0
fi

# Handle single title case
if [ -z "$TITLE" ]; then
    echo "Error: Title argument is required"
    echo "Usage: $0 <title>"
    echo "       $0 --all"
    echo "       $0 --force <title>"
    echo "       $0 --force --all"
    exit 1
fi

# Set directories based on title
MAIN_DIR="./public/${TITLE}"             # Original images directory
THUMB_DIR="./public/${TITLE}-thumbnails" # Thumbnails directory

if [ ! -d "$MAIN_DIR" ]; then
    echo "Error: Directory for \"$TITLE\" does not exist: $MAIN_DIR"
    exit 1
fi

echo "Using title: $TITLE"
echo "Force mode: $FORCE_MODE"
echo "Main directory: $MAIN_DIR"
echo "Thumbnails directory: $THUMB_DIR"
echo

# Create directories if they don't exist
mkdir -p "$THUMB_DIR"

# Create a temporary file with the SPECIAL_IMAGES array declaration
SPECIAL_IMAGES_FILE=$(mktemp)
declare -p SPECIAL_IMAGES >"$SPECIAL_IMAGES_FILE"

# Export functions and variables
export -f convert_orphan_images process_image generate_thumbnail is_special_image
export MAIN_DIR THUMB_DIR THUMB_WIDTH THUMB_QUALITY MAIN_QUALITY MAIN_WIDTH FORCE_MODE TITLE SPECIAL_IMAGES_FILE

echo "=== Image Optimization ==="
echo "Source images found: $(find "public/$TITLE" -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | wc -l)"
echo "Existing WebP files: $(find "public/$TITLE" -name "*.webp" | wc -l)"

# Step 0: Convert orphan WebP and GIF images to PNG (if no PNG/JPG/JPEG exists)
echo "=== Converting orphan images to PNG ==="
run_parallel '\( -iname "*.webp" -o -iname "*.gif" \)' 'source "$SPECIAL_IMAGES_FILE" && convert_orphan_images "$@"'

# Step 1: Create thumbnails from originals
echo "=== Generating thumbnails ==="
run_parallel '\( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \)' 'source "$SPECIAL_IMAGES_FILE" && generate_thumbnail "$@"'

# Step 2: Special handling for key visual (preserve original)
echo "=== Processing special images ==="
process_all_special_images
echo "Completed special images processing"
echo

# Step 3: Create optimized WebP versions (keep originals)
echo "=== Creating optimized WebP versions ==="
run_parallel '\( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \)' 'source "$SPECIAL_IMAGES_FILE" && process_image "$@"'

# Clean up the temporary file
rm -f "$SPECIAL_IMAGES_FILE"

# Final size report
echo "=== Size Report ==="
echo "Main images size (WebP versions):"
find "$MAIN_DIR" -name '*.webp' -exec du -ch {} + | grep total || echo "No WebP files found"
echo "Thumbnails size:"
find "$THUMB_DIR" -name '*.webp' -exec du -ch {} + | grep total || echo "No thumbnail files found"

# script by deepseek-r1 my goat
