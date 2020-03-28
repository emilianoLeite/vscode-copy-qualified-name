// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vscode-copy-qualified-name" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.copyFullQualifiedClassName', function () {
    // The code you place here will be executed every time your command is executed

    const currentDocument = vscode.window.activeTextEditor.document
    const namespaceDefinitions = []

    let condition = true
    let index = 0

    function isNamespaceDefinition(lineText) {
      let trimmedLine = lineText.trim()

      return (
        trimmedLine.startsWith('module') || trimmedLine.startsWith('class')
      )
    }

    function isComment(lineText) {
      return lineText.trim().startsWith('#')
    }

    function isRequire(lineText) {
      return lineText.trim().startsWith('require')
    }

    /**
     * @param {string[]} namespaceDefinitions
     */
    function trimNamespaceKeywords(namespaceDefinitions) {
      return namespaceDefinitions.map((namespaceDefinition) => {
        return (namespaceDefinition
          .replace('class ', '')
          .replace('module ', '')
        .trim()
        )
      })
    }

    while (condition) {
      let currentLine = currentDocument.lineAt(index)
      let currentLineContent = currentLine.text

      switch (true) {
        case isNamespaceDefinition(currentLineContent):
          // vscode.window.showInformationMessage('condition = true')
          namespaceDefinitions.push(currentLineContent)
          index++
          break
        case currentLine.isEmptyOrWhitespace:
          // vscode.window.showInformationMessage('blank = true')
          index++
          break
        case isComment(currentLineContent):
          // vscode.window.showInformationMessage('comment = true')
          index++
          break
        case isRequire(currentLineContent):
          // vscode.window.showInformationMessage('require = true')
          index++
          break
        default:
          // vscode.window.showInformationMessage('condition = false')
          condition = false
          break
      }
    }

    const fullyQualifiedClassName = `::${trimNamespaceKeywords(namespaceDefinitions).join('::')}`
    vscode.env.clipboard.writeText(fullyQualifiedClassName)
    vscode.window.showInformationMessage('Copied!')
  })

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
}
