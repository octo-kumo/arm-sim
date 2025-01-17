import * as acorn from "acorn";

function compile(source: string) {
    const ast = acorn.parse(source, { ecmaVersion: 'latest' })
    return convert(ast);
}

function convert(node?: acorn.Node | null): string[] {
    if (!node) return []
    switch (node.type) {
        case 'VariableDeclaration':
            const n1 = node as acorn.VariableDeclaration
            console.log(n1.declarations)
            return [`const ${n1.declarations.map(convert).join(', ')};`]
        case 'VariableDeclarator':
            const n2 = node as acorn.VariableDeclarator
            return [`${convert(n2.id)} = ${convert(n2.init)}`]
        case 'Identifier':
            const n3 = node as acorn.Identifier
            return [n3.name]
        case 'BinaryExpression':
            const n4 = node as acorn.BinaryExpression
            return [`(${convert(n4.left)} ${n4.operator} ${convert(n4.right)})`]
        case 'CallExpression':
            const n5 = node as acorn.CallExpression
            return [`${convert(n5.callee)}(${n5.arguments.map(convert).join(', ')})`]
        case 'MemberExpression':
            const n6 = node as acorn.MemberExpression
            return [`${convert(n6.object)}.${convert(n6.property)}`]
        case 'ExpressionStatement':
            const n7 = node as acorn.ExpressionStatement
            return convert(n7.expression)
        case 'BlockStatement':
            const n8 = node as acorn.BlockStatement
            return [`{${n8.body.map(convert).join('; ')}}`]
        case 'Program':
            const n9 = node as acorn.Program
            return n9.body.flatMap(convert)
        case 'Literal':
            const n10 = node as acorn.Literal
            return [JSON.stringify(n10.value)]
        default:
            throw new Error(`Unsupported node type: ${node.type}`)
    }
}

console.log(compile(`
const a = 1 + 2;
console.log(a);
const b = a + 3;
const c = (a+b) * 2;
console.log(c);
`).join('\n'))