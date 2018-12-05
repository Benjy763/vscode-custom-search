
'use strict';
import * as vscode from 'vscode';
import * as fs from 'fs';

export class FileUtils {
  readFile(path: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        fs.readFile(path, (error, buffer) => this.handleResult(resolve, reject, error, buffer));
    });
  }

  handleResult<T>(
    resolve: (result: T) => void,
    reject: (error: Error) => void, error: Error | null | undefined, result: T): void {
    if (error) {
        reject(this.massageError(error));
    } else {
        resolve(result);
    }
  }

  massageError(error: Error & { code?: string }): Error {
    if (error.code === 'ENOENT') {
        return vscode.FileSystemError.FileNotFound();
    }

    if (error.code === 'EISDIR') {
        return vscode.FileSystemError.FileIsADirectory();
    }

    if (error.code === 'EEXIST') {
        return vscode.FileSystemError.FileExists();
    }

    if (error.code === 'EPERM' || error.code === 'EACCESS') {
        return vscode.FileSystemError.NoPermissions();
    }

    return error;
  }
}
