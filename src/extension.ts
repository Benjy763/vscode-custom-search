'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let output: vscode.OutputChannel = vscode.window.createOutputChannel('report');
    console.log('The extention "migration-state" is active');
    output.append('Waiting for results...\n');
    output.show();

    let disposable = vscode.commands.registerCommand('extension.generateReport', async () => {
        let exclusions = `{node_modules,**/*.mock.ts}`;
        let filesPatterns = [
            { type: 'AngularJS controllers', number: 0, filesPattern: '**/*.module.js', annotationPattern: /.controller\(/g },
            { type: 'AngularJS Components', number: 0, filesPattern: '**/*.module.js', annotationPattern: /.component\(/g },
            { type: 'AngularJS Services', number: 0, filesPattern: `**/*.module.js`, annotationPattern: /.service\(|.factory\(/g },
            { type: 'AngularJS directives', number: 0, filesPattern: `**/*.module.js`, annotationPattern: /.directive\(/g },
            { type: 'JS files', number: 0, filesPattern: '**/*.js' },
            { type: 'Angular components', number: 0, filesPattern: '**/*.ts', annotationPattern: /@Component\(/g },
            { type: 'Angular services', number: 0, filesPattern: '**/*.ts', annotationPattern: /@Injectable\(/g },
            { type: 'TS files', number: 0, filesPattern: '**/*.ts' }
        ];

        const fileListPromises: any[] = [];
        filesPatterns.forEach(filePattern => {
            fileListPromises.push(vscode.workspace.findFiles(filePattern.filesPattern, exclusions));
        });

        const fileAnnotationSearches: any[] = [];
        (await Promise.all(fileListPromises)).forEach(async (files: any, index: number) =>{
            if (!filesPatterns[index].annotationPattern) {
                filesPatterns[index].number = files.length;
                fileAnnotationSearches.push(Promise.resolve());
                return;
            }
            const fileContentPromises: any[] = [];
            files.forEach((uri: any) =>{
                fileContentPromises.push(vscode.workspace.openTextDocument(uri));
            });
            fileAnnotationSearches.push(Promise.all(fileContentPromises));
        });

        (await Promise.all(fileAnnotationSearches)).forEach((openDocuments: any, index: number) => {
            if (!openDocuments) {
                return;
            }
            openDocuments.forEach((openDocument: any) => {
                const fileContentMatches = openDocument.getText().match(filesPatterns[index].annotationPattern);
                filesPatterns[index].number += fileContentMatches ? fileContentMatches.length : 0;
            });
        });

        filesPatterns.forEach(filePattern => {
            output.append('Number of ' + filePattern.type + ': ' + filePattern.number.toString() + '\n');
            output.show();
        });
        vscode.window.showInformationMessage('Report generated !');
    });

    context.subscriptions.push(disposable);
}
export function deactivate() {
}
