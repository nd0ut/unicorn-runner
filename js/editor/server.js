const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();

router.post('/spec', (ctx, next) => {
    ctx.body = {
        success: true
    };
});

app
    .use(cors())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(12345);

console.log('Spec update server running at http://localhost:12345');
