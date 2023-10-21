const exec = require("child_process").exec
const dir = "pascal"

exec(`sass --watch ${dir}/sass:${dir}/css --style compressed`)
//exec(`watchify ${dir}/scripts/general.js -o ${dir}/general.js`)
console.log(`Compiling Sass in realtime for ${dir} project`)