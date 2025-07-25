{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  # These are the packages available in your developer environment
  buildInputs = [
    pkgs.nodejs
    pkgs.git
    pkgs.ffmpeg-full  # Menggunakan versi lengkap untuk dukungan codec yang lebih baik

    # System libraries required by Puppeteer/Chromium
    pkgs.chromium
    pkgs.alsa-lib
    pkgs.at-spi2-atk
    pkgs.cairo
    pkgs.cups
    pkgs.dbus
    pkgs.expat
    pkgs.fontconfig
    pkgs.gdk-pixbuf
    pkgs.glib
    pkgs.gtk3
    pkgs.nss
    pkgs.pango
    pkgs.xorg.libX11
    pkgs.xorg.libXScrnSaver
    pkgs.xorg.libXcomposite
    pkgs.xorg.libXcursor
    pkgs.xorg.libXdamage
    pkgs.xorg.libXext
    pkgs.xorg.libXfixes
    pkgs.xorg.libXi
    pkgs.xorg.libXrandr
    pkgs.xorg.libXrender
    pkgs.xorg.libXtst
  ];

  # This hook runs automatically when you enter the shell.
  # It sets environment variables to tell our application where to find key binaries.
  shellHook = ''
    export PUPPETEER_EXECUTABLE_PATH="${pkgs.chromium}/bin/chromium"
    export FFMPEG_PATH="${pkgs.ffmpeg-full}/bin/ffmpeg" # Menunjuk ke versi lengkap
  '';
}
