Preferred Text Format
=====================

This module allows setting a preferred text format per text field. This
overrides the default behaviour of letting the user choose between the text
formats they have access to, and instead tries to limit their options to the one
you set.

With this module, a field's text formats are displayed to the user according to
the following rules:

- If no preferred text format is set, display all allowed formats (Backdrop's
  default behaviour).
- If the user doesn't have access to the preferred text format, display all
  allowed formats.
- If the field has an existing value (and therefore an existing text format),
  display the existing format and the preferred format (hide all others).
- If the field is empty, display just the preferred format (hide all others).

Installation
------------

- Install this module using the official Backdrop CMS instructions at
  https://backdropcms.org/guide/modules.

- Configure your text field(s); set 'Text processing' to 'Filtered text' and
  'Preferred text format' to the format of your choice.

Issues
------

Bugs and Feature requests should be reported in the Issue Queue:
https://github.com/backdrop-contrib/preferred_text_format/issues.

Current Maintainers
-------------------

- Peter Anderson (https://github.com/BWPanda).

Credits
-------

- Inspired by the 'Text Format Access' Drupal module by Dmitry Zhgenti
  (https://www.drupal.org/u/zhgenti).

License
-------

This project is GPL v2 software. See the LICENSE.txt file in this directory for
complete text.

