const major = Number(process.version.slice(1).split('.')[0])
if (major < 18) {
  console.error(
    `\n[ERROR] Node.js ${process.version} detected. This project requires Node.js >= 18.\n` +
      'Run: nvm use 18   (see .nvmrc)\n'
  )
  process.exit(1)
}
