// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "ordered-css" is now active!');
  interface UsedPropsInterface {
    [key: string]: string;
  }
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "ordered-css.orderCSS",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user

      const editor = vscode.window.activeTextEditor; // get Editor
      if (!editor) {
        vscode.window.showInformationMessage("No editor available!");
        return;
      }
      const text = editor.document.getText(editor.selection); //get selected text
      const splitted = text.split(";"); //split text into lines
      let props: UsedPropsInterface = {};
      splitted.forEach((prop) => {
        const trimmedProp = prop.trim(); //ignore empty lines
        if (trimmedProp.length === 0) {
          return;
        }
        const [key, value] = trimmedProp.split(":"); // split into key and value pairs
        props = { ...props, [key]: value }; // add them to object
      });

      const order: string[] =
        vscode.workspace.getConfiguration("cssPropsOrder").prop; // get desired order from settings

      let returnValue: string = "\n";

      order.forEach((element) => {
        // in desired order
        if (element in props) {
          //get element from selected properties
          returnValue += `${element}: ${props[element]};\n`; //add to return value
        }
      });

      editor.edit((edit) => {
        edit.replace(editor.selection, returnValue.trim()); // replace selection with sorted
      });
      // vscode.window.showInformationMessage(`Selected: + ${text}`);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
