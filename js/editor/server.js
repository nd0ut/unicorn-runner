const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const fs = require('fs');
const acorn = require('acorn');
const prettier = require('prettier');
const path = require('path');

const app = new Koa();
const router = new Router();

function replaceBetween(source, start, end, what) {
    return source.substring(0, start) + what + source.substring(end);
}

function getLevelPath(levelIdx) {
    const indexPath = './js/levels/index.js';
    const indexFile = readFile(indexPath);
    const ast = getAst(indexFile);

    const exportLevelOreder = ast.body.find(node => node.type === 'ExportDefaultDeclaration');
    const levelVarName = exportLevelOreder.declaration.elements[levelIdx].name;

    const importPath =  ast.body.find(node => node.specifiers[0].local.name === levelVarName);
    const levelPath = importPath.source.value;
    const absolutePath = './' + path.join('js/levels', levelPath) + '.js';

    return absolutePath;    
}

function readFile(path) {
    const str = fs.readFileSync(path).toString();
    return str;
}

function getAst(levelFile) {
    return acorn.parse(levelFile, {
        sourceType: 'module',
        ecmaVersion: 9
    });
}

function isSpecNode(node) {
    const varName = 'spec';
    return (
        node.type === 'VariableDeclaration' && node.declarations[0].id.name === varName
    );
}

function getSpecProperties(ast) {
    return ast.body.find(isSpecNode).declarations[0].init.properties;
}

router.post('/spec', (ctx, next) => {
    const { specUpdate, levelIdx } = ctx.request.body;

    const levelPath = getLevelPath(levelIdx);
    let levelFile = readFile(levelPath);
    let ast = getAst(levelFile);

    for (const key of Object.keys(specUpdate)) {
        const props = getSpecProperties(ast);
        const { start, end } = props.find(prop => prop.key.name === key).value;

        levelFile = replaceBetween(
            levelFile,
            start,
            end,
            JSON.stringify(specUpdate[key])
        );

        ast = getAst(levelFile);
    }

    fs.writeFileSync(levelPath, prettier.format(levelFile));

    ctx.body = { success: true, levelFile };
});

app
    .use(cors())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(12345);

console.log('Spec update server running at http://localhost:12345');
