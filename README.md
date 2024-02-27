# Docker Django Migrations Extension

This extension for Visual Studio Code enables easy management of Docker containers and Django migrations directly from the editor, streamlining your development workflow.

## Features

- Select a Docker container running a Django project.
- Generate Django migrations within the selected container.
- Apply Django migrations.
- View a list of available migrations.
- Roll back migrations.

## Getting Started

Ensure Docker and Visual Studio Code are installed on your system to use this extension.

### Installation

Install the extension through the Visual Studio Code Marketplace:

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the square icon on the sidebar or pressing `Ctrl+Shift+X`.
3. Search for "Docker Django Migrations Extension" and click Install.

### Usage

1. **Select Docker Container**: Click on the extension icon in the status bar and choose "Select Docker Container" from the menu.
2. **Make Migrations**: Select "Make Migrations" to generate migrations based on changes in your Django models.
3. **Make Migrations and Migrate**: Choose "Make Migrations and Migrate" to apply the generated migrations.
4. **View Migrations**: To see a list of migrations, select "Show Migrations".
5. **Rollback Migrations**: To roll back a migration, select "Rollback Migration" and specify the migration name.

## Support

If you have any questions, suggestions for improvement, or encounter any issues, please feel free to reach out through [GitHub Issues](https://github.com/anchv8/django-makemigrations-in-doker).

## License

This extension is distributed under the MIT License. See the LICENSE file in the source code for more detailed information.
