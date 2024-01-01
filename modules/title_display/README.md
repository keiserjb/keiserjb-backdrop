Title Display
=============

The Title Display module allows you to render the title of a node as part of the
content area. The title can then be placed between other fields instead of being
positioned at the top of the content.

Settings for how the title is displayed is done per content type and display
mode, with options for configuring the HTML tag (H2, H3, etc.) and extra classes
that might be desired.

Note that when enabled on a display mode, the normal title displayed by the
node template is suppressed to prevent the title from displaying twice.

Potential Conflicts
-------------------
This module potentially **conflicts** with the "Title" module and the
"Display Suite" collection of modules. It should not be used at the same time
as those other modules.

This feature is also planned to be included in Backdrop core at some point in
the future. See these two issues:

* [Issue #933: Make node title a proper (sortable too) field](https://github.com/backdrop/backdrop-issues/issues/933)
* [Issue #1950: Move title display settings to Manage Display form](https://github.com/backdrop/backdrop-issues/issues/1950)

This module is intended to work as a lightweight solution until core provides
the feature directly.

Installation
------------

1. Install this module using the official Backdrop CMS instructions at
   <https://backdropcms.org/guide/modules>.
2. Login as an administrator. Enable the module at "Administer" >
   "Functionality" (`admin/modules`).
3. Enable the title display for specific content types at Administer >
   Structure > Content Types (`admin/structure/types`) and click the "Configure"
   button for a content type. Settings for this module are in a vertical tab
   labeled "Display title". Enable for one or more display modes on the content
   type.
4. Once enabled, switch to the "Manage Displays" tab of the content type. The
   title field will now be available in enabled display modes.

Current Maintainers
-------------------

- [Nate Lampton](https://github.com/quicksketch)

Credits
-------

- Written for Backdrop CMS by [Nate Lampton](https://github.com/quicksketch).
- Original development paid for by [Exceljet](https://exceljet.net/).

License
-------

This project is GPL v2 software.
See the LICENSE.txt file in this directory for complete text.
