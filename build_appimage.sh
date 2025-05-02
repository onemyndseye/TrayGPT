set -e

APP_NAME="TrayGPT"
VERSION="0.0.1"
ARCH="x64"
ICON="icon.png"
OUTPUT_DIR="release"



## Init
#get version from package file
VERSION="$(cat package.json |grep version |awk '{print $2}'|sed '{s|"||g}' |sed '{s|,||}')"


# Step 1: Clean and package the Electron app
echo "🧹 Cleaning previous builds..."
rm -rf $OUTPUT_DIR AppDir

echo "📦 Packaging Electron app..."
electron-packager . $APP_NAME \
  --platform=linux \
  --arch=$ARCH \
  --overwrite \
  --out=$OUTPUT_DIR \
  --icon=$ICON \
  --prune=true \
  --app-version=$VERSION

# Step 2: Prepare AppDir
echo "📁 Setting up AppDir..."
mkdir -p AppDir/usr/bin
cp -r $OUTPUT_DIR/${APP_NAME}-linux-$ARCH/* AppDir/usr/bin/

cat > AppDir/AppRun <<'EOF'
#!/bin/bash
HERE="$(dirname "$(readlink -f "$0")")"
exec "$HERE/usr/bin/TrayGPT" "$@"
EOF

chmod +x AppDir/AppRun



# Desktop file
cat > AppDir/traygpt.desktop <<EOF
[Desktop Entry]
Name=TrayGPT
Exec=traygpt
Icon=icon
Type=Application
Categories=Utility;
EOF

cp icon.png AppDir/icon.png

# Step 3: Build AppImage
echo "🛠  Building AppImage..."
appimagetool AppDir



echo "📁 Cleaning up ..."
rm -rfd ./AppDir
rm -rfd ./release

echo "✅ Done!"
mv ./TrayGPT-x86_64.AppImage TrayGPT-$VERSION-x86_64.AppImage


