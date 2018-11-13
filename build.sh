#!/bin/bash
set -o errexit

realpath() {
  echo "$(cd "$(dirname "$1")"; pwd)/$(basename "$1")"
}

BASE_DIRECTORY=$(dirname $(realpath $0))
DIST_DIRECTORY="$BASE_DIRECTORY/dist"

yarn_build() {
  yarn build
}

package_files() {
  pkgfile="$BASE_DIRECTORY/bundle.tar.gz"
  rm -rf pkgfile
  echo $pkgfile
  tar cfz $pkgfile -C dist .
}

build_image() {
  bazel run --cpu k8 //:streamlio-ui
}

yarn_build

package_files

echo "bundle.tar.gz bundle created."

build_image
