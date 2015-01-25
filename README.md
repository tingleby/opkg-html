opkg-html
=========

This project is intended to take the Opkg index file `Packages` and
make a nice HTML page.

opkg-json.py
------------
This script should convert the `Packages` to `packages.json`. The only
included fields currently are name, version, section & description.

html
----
The included html/js should be able to parse the `packages.json` and
display the packages.
* Search bar will only search the package names, for now.
