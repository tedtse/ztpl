var acorn = require('acorn')
var deepcopy = require('deepcopy')
var deepEqual = require('deep-equal')
var escodegen = require('escodegen')
var estraverse = require('estraverse')
var fs = require('fs')
var path = require('path')
var declare = require('./declare.js')
var currentPath = process.cwd()

var parseOpts = {}
var generateOpts = {
  format: {
    indent: { style: '  ' }
  }
}

module.exports = function (src, dest, options) {
  // 读取文件，将其转化成抽象语法树
  var code = fs.readFileSync(path.join(currentPath, src), declare.encoding)
  var ast = acorn.parse(code, parseOpts)
  // 获取配制参数
  var oldSection = options.orig
  var newSection = options.dest
  var context = options.context
  var selector = options.selector
  var oldSectionAst = acorn.parse(oldSection, parseOpts)
  var newSectionAst = acorn.parse(newSection, parseOpts)
  // 遍历抽象语法树
  estraverse.traverse(ast, {
    enter: function (node, parent) {
      var siblings, index, args
      if (context !== undefined && parent && parent.type !== context) {
        return
      }
      if (!checkNode(node, oldSectionAst.body[0])) {
        return
      }
      if (selector === undefined) {
        // 没有选择器逻辑
        siblings = parent.body || parent.declarations
        index = siblings.findIndex(function (_node) {
          return _node === node
        })
        args = [ index, 1 ].concat(newSectionAst.body)
        siblings.splice.apply(siblings, args)
      } else {
        // 有选择器逻辑
        siblings = queryNode(node, selector)
        index = siblings.findIndex(function (_node) {
          return deepEqual(filterAstNode(_node), filterAstNode(queryNode(oldSectionAst.body[0], selector)[0]))
        })
        if (index !== -1) {
          args = [ index, 1 ].concat(queryNode(newSectionAst.body[0], selector))
          siblings.splice.apply(siblings, args)
        }
      }
    }
  })
  fs.writeFileSync(path.join(currentPath, dest), escodegen.generate(ast, generateOpts), { encoding: 'utf8' })
  return Promise.resolve()
}

function VariableDeclarationParse (node) {
  var declaration = node.declarations[0]
  return {
    kind: node.kind,
    id: filterAstNode(declaration.id)
  }
}

function FunctionDeclarationParse (node) {
  return {
    id: filterAstNode(node.id),
    params: filterAstNode(node.params)
  }
}

function ExpressionStatementParse (node) {
  return {
    left: filterAstNode(node.expression.left)
  }
}

function ForStatementParse (node) {
  return {
    init: filterAstNode(node.init),
    test: filterAstNode(node.test),
    update: filterAstNode(node.update)
  }
}

function ForInStatementParse (node) {
  return {
    left: filterAstNode(node.left),
    right: filterAstNode(node.right)
  }
}

function ForOfStatementParse (node) {
  return {
    left: filterAstNode(node.left),
    right: filterAstNode(node.right)
  }
}

function IfStatementParse (node) {
  return {
    test: filterAstNode(node.test)
  }
}

function TryStatementParse (node) {
  return {
    block: filterAstNode(node.block)
  }
}

function WhileStatementParse (node) {
  return {
    test: filterAstNode(node.test)
  }
}

function DoWhileStatementParse (node) {
  return {
    test: filterAstNode(node.test)
  }
}

function SwitchStatementParse (node) {
  return {
    discriminant: filterAstNode(node.discriminant)
  }
}

function checkNode (astNode, oldSectionNode) {
  var result = false
  if (astNode.type !== oldSectionNode.type) {
    return result
  }
  switch (astNode.type) {
    case 'VariableDeclaration':
      result = deepEqual(VariableDeclarationParse(astNode), VariableDeclarationParse(oldSectionNode))
      break
    case 'FunctionDeclaration':
      result = deepEqual(FunctionDeclarationParse(astNode), FunctionDeclarationParse(oldSectionNode))
      break
    case 'ExpressionStatement':
      result = deepEqual(ExpressionStatementParse(astNode), ExpressionStatementParse(oldSectionNode))
      break
    case 'ForStatement':
      result = deepEqual(ForStatementParse(astNode), ForStatementParse(oldSectionNode))
      break
    case 'ForInStatement':
      result = deepEqual(ForInStatementParse(astNode), ForInStatementParse(oldSectionNode))
      break
    case 'ForOfStatement':
      result = deepEqual(ForOfStatementParse(astNode), ForOfStatementParse(oldSectionNode))
      break
    case 'IfStatement':
      result = deepEqual(IfStatementParse(astNode), IfStatementParse(oldSectionNode))
      break
    case 'TryStatement':
      result = deepEqual(TryStatementParse(astNode), TryStatementParse(oldSectionNode))
      break
    case 'WhileStatement':
      result = deepEqual(WhileStatementParse(astNode), WhileStatementParse(oldSectionNode))
      break
    case 'DoWhileStatement':
      result = deepEqual(DoWhileStatementParse(astNode), DoWhileStatementParse(oldSectionNode))
      break
    case 'SwitchStatement':
      result = deepEqual(SwitchStatementParse(astNode), SwitchStatementParse(oldSectionNode))
      break
    default:
      result = false
      break
  }
  return result
}

function filterAstNode (obj) {
  var clone = deepcopy(obj)
  deleteStartAndEndKeys(clone)
  return clone
}

function deleteStartAndEndKeys (obj) {
  obj && typeof obj.start !== 'undefined' && delete obj.start
  obj && typeof obj.end !== 'undefinded' && delete obj.end
  for (var i in obj) {
    var item = obj[i]
    if (typeof item === 'object') {
      deleteStartAndEndKeys(item)
    }
  }
}

// 通过递归找到对应节点
function queryNode (element, selector) {
  var sels = selector.split('.')
  var sel = sels.shift()
  if (sels.length) {
    return queryNode(element[sel], sels.join('.'))
  } else {
    return element[sel]
  }
}
