# node-signal-reader
Node.js Signal Desktop Database Reader provides a CLI to read/export messages from a Signal desktop sqlite database.

## Setup
* Find the location of your Signal sqlite database. On *nix systems, the locations is usually `$HOME/.config/Signal/`.
* Clone this repo to your local system.
* Install NPM packages `npm install` or `yarn install`.

## Runtime
* Start with `./main --help`. 
* Provide the path to your Signal database. Example: `./main db tables -c ~/.config/Signal`.

## Functions
* List tables in database
* List database schemas
* List conversations/contacts
* Show a full conversation
* Show full details of a single message

## Features
* Export all data as JSON or friendly/tables
* Display paths to media
* Stickers
* Timestamps are show in local time

## Comments/Feedback
Comments, bug reports, and feedback are appreciated. This code was tested on my personal Signal database. YMMV.
