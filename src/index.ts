import Koa, { Response } from 'koa'
import send from 'koa-send'
import { cwd, argv, exit } from 'process'
import { basename, join } from 'path'
const app = new Koa();

if (argv.length < 3) exit()

// response
app.use(async ctx => {
  if (ctx.path === '/download') {
    ctx.set('Content-Disposition', `attachment; filename="${basename(join(cwd(), argv[2]))}"`)
    await send(ctx, argv[2], { root: cwd() })
  } else {
    ctx.body = 'Hello Koa';
  }
});

app.listen(3000);
