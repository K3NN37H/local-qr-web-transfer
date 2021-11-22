import Koa from 'koa'
import send from 'koa-send'
// import send from 'koa-sendfile'
import { cwd, argv, exit } from 'process'
import { basename, join, isAbsolute, dirname } from 'path'
import { networkInterfaces } from 'os'
import Qrcode from 'qrcode'
import open from 'open'

const app = new Koa();

if (argv.length < 3) exit(1)
console.debug(networkInterfaces())

const ip = Object.values(networkInterfaces()).flat().find(network =>
  network?.family === 'IPv4' && network.address.startsWith('192.168')
)?.address
console.log(ip)

const sendRoot = isAbsolute(argv[2]) ? dirname(argv[2]) : cwd()
const filename = basename(join(sendRoot, argv[2]))

app.use(async ctx => {
  console.log(ctx.method)
  if (ctx.path === '/download') {
    ctx.set('Content-Disposition', `attachment; filename="${filename}"`)
    // await send(ctx, join(sendRoot, filename))
    await send(ctx, filename, { root: sendRoot })
    console.debug(ctx)
  } else {
    const qrdata = await Qrcode.toDataURL(`http://${ip}:3000/download`)
    ctx.body = `<img src="${qrdata}" />`;
  }
});

app.listen(3000);

open(`http://localhost:3000`)

console.log('Auto shutdown in 60 seconds...')
setTimeout(() => {
  exit(0)
}, 60000)
