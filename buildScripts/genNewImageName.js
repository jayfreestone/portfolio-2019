function genNewImageName(originalName, width, height) {
  return originalName.replace(/(.+)(?=\.)(.+$)/, `$1-${width}-${height}$2`);
}

module.exports = genNewImageName;