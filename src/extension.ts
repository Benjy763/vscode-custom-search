'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let output: vscode.OutputChannel = vscode.window.createOutputChannel('report');
    console.log('The extention "custom-search" is active');
    output.append('Waiting for results...\n');
    output.show();

    let disposable = vscode.commands.registerCommand('extension.generateReport', async () => {
        let exclusions = `{node_modules,**/*.mock.ts}`;
        let filesPatterns: any[] = [];
        // Get the config file in local workspace
        try {
            const config: vscode.TextDocument = await vscode.workspace.openTextDocument(vscode.workspace.rootPath+'\\custom-search.json');
            filesPatterns = JSON.parse(config.getText()).filesPatterns;
            // Init the config
            Object.keys(filesPatterns).forEach((key: any) => {
                filesPatterns[key].number = 0;
            });
        } catch(e) {
            vscode.window.showErrorMessage('Error loading json config file', e);
            return;
        }

        // Add all promises relative to files to find with filesPattern
        const fileListPromises: any[] = [];
        filesPatterns.forEach(filePattern => {
            fileListPromises.push(vscode.workspace.findFiles(filePattern.filesPattern, exclusions));
        });

        // Resolve all files and loop to open a document for each of them
        const fileAnnotationSearches: any[] = [];
        (await Promise.all(fileListPromises)).forEach(async (files: any, index: number) =>{
            // If there are no annotationPattern in config we don't need to do a search in document
            if (!filesPatterns[index].annotationPattern) {
                filesPatterns[index].number = files.length;
                fileAnnotationSearches.push(Promise.resolve());
                return;
            }

            // Add all promises relative to opened documents
            const fileContentPromises: any[] = [];
            files.forEach((uri: any) =>{
                fileContentPromises.push(vscode.workspace.openTextDocument(uri));
            });
            fileAnnotationSearches.push(Promise.all(fileContentPromises));
        });

        // Resolve all opnened document and loop to search into them with annotationPattern from config
        (await Promise.all(fileAnnotationSearches)).forEach((openDocuments: vscode.TextDocument[], index: number) => {
            if (!openDocuments) {
                return;
            }
            openDocuments.forEach((openDocument: vscode.TextDocument) => {
                const fileContentMatches = openDocument.getText().match(new RegExp(filesPatterns[index].annotationPattern, 'g'));
                // Increment a result when finding a match
                filesPatterns[index].number += fileContentMatches ? fileContentMatches.length : 0;
            });
        });

        // Display final result in the correct order
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
