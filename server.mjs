import Koa from 'koa'
import getData from './service/externalApiService.mjs'
import Router from 'koa-router'


const app = new Koa();
const router = new Router();

router.get('/:username', async (ctx, next) => {

    ctx.body = await getData(ctx.params.username)
    next();

});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);



