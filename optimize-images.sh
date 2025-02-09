#!/bin/bash
CPU=${CPU:-16}  # Default to 16 processes, adjust based on your CPU cores
find . -name '*.png' | xargs -P $CPU -I {} optipng -o7 -quiet {}
