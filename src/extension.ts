import * as vscode from 'vscode';
import { exec } from 'child_process';

let selectedContainerName: string | undefined;

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.selectContainer', selectContainer));
    context.subscriptions.push(vscode.commands.registerCommand('extension.makeMigrations', makeMigrations));
    context.subscriptions.push(vscode.commands.registerCommand('extension.makeMigrationsAndMigrate', makeMigrationsAndMigrate));
    context.subscriptions.push(vscode.commands.registerCommand('extension.showMigrations', showMigrations));
    context.subscriptions.push(vscode.commands.registerCommand('extension.rollbackMigration', rollbackMigration));

    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'extension.showQuickPick';
    statusBarItem.text = `$(triangle-down) Docker Actions`;
    statusBarItem.tooltip = "Select Docker Action";
    statusBarItem.show();

    context.subscriptions.push(statusBarItem);

    context.subscriptions.push(vscode.commands.registerCommand('extension.showQuickPick', showQuickPick));
}

function showQuickPick() {
    const items = ["Select Docker Container", "Make Migrations", "Make Migrations and Migrate", "Show Migrations", "Rollback Migration"];
    vscode.window.showQuickPick(items).then(selection => {
        switch (selection) {
            case "Select Docker Container":
                selectContainer();
                break;
            case "Make Migrations":
                makeMigrations();
                break;
            case "Make Migrations and Migrate":
                makeMigrationsAndMigrate();
                break;
            case "Show Migrations":
                showMigrations();
                break;
            case "Rollback Migration":
                rollbackMigration();
                break;
        }
    });
}

function selectContainer() {
    vscode.window.showInputBox({ prompt: 'Enter Docker container name or id:' }).then(ContainerName => {
        if (ContainerName) {
            exec(`docker ps -q -f name=^${ContainerName}$`, (err, stdout, stderr) => {
                if (err) {
                    vscode.window.showErrorMessage("Error checking container status");
                    return;
                }
                if (stdout) {
                    vscode.window.showInformationMessage(`Container ${ContainerName} is running`);
					selectedContainerName = ContainerName;
                } else {
                    vscode.window.showWarningMessage(`Container ${ContainerName} is not running`);
                }
            });
        }
    });
}

function makeMigrations() {
    exec(`docker exec ${selectedContainerName} python manage.py makemigrations`, (err, stdout, stderr) => {
        if (err) {
            vscode.window.showErrorMessage("Failed to make migrations");
            return;
        }
        vscode.window.showInformationMessage(stdout || "Migrations created successfully");
    });
}

function makeMigrationsAndMigrate() {
    exec(`docker exec ${selectedContainerName} python manage.py makemigrations && docker exec ${selectedContainerName} python manage.py migrate`, (err, stdout, stderr) => {
        if (err) {
            vscode.window.showErrorMessage("Failed to make and apply migrations");
            return;
        }
        vscode.window.showInformationMessage("Migrations created and applied successfully");
    });
}

function showMigrations() {
    exec(`docker exec ${selectedContainerName} python manage.py showmigrations`, (err, stdout, stderr) => {
        if (err) {
            vscode.window.showErrorMessage("Failed to show migrations: " + err.message);
            return;
        }
        vscode.window.showInformationMessage(stdout || "No migrations found");
    });
}

function rollbackMigration() {
    vscode.window.showInputBox({ prompt: 'Enter migration name to rollback:' }).then(migration => {
        if (!migration) return;
        exec(`docker exec ${selectedContainerName} python manage.py migrate ${migration}`, (err, stdout, stderr) => {
            if (err) {
                vscode.window.showErrorMessage("Failed to rollback migration");
                return;
            }
            vscode.window.showInformationMessage("Migration rolled back successfully");
        });
    });
}