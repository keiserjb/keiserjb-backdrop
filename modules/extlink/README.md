External Links
==============

The External Links module is a very simple approach to adding icons to links
to external websites or e-mail addresses. It is a purely JavaScript
implementation, so the icons are only shown to users that have JavaScript
enabled.

External Links was written by Nate Haug.
Built by Robots: http://www.lullabot.com

Installation
------------

- Install this module using the official Backdrop CMS instructions at
  https://backdropcms.org/guide/modules

- No additional configuration is necessary though you may fine-tune settings at
  Administer > Configuration > User interface > External Links
  (/admin/config/user-interface/extlink).

A note about the CSS
--------------------

This module adds a CSS file that is only a few lines in length. You may choose
to move this CSS to your theme to prevent the file from needing to be loaded
separately. To do this:

1) Open the .info file for your theme, add this line of code to prevent
   the extlink.css file from loading:
   `stylesheets[all][] = extlink.css`

2) Open the extlink.css file within the extlink directory and copy all the code
   from the file into your theme's style.css file.

3) Copy the extlink.png and mailto.png files to your theme's directory.

Note that you DO NOT need to make a extlink.css file. Specifying the file in the
info file is enough to tell Backdrop not to load the original file.

License
-------

This project is GPL v2 software. See the LICENSE.txt file in this directory for
complete text.

Maintainers
-----------

Written and maintained by:

- Nate Haug (https://github.com/quicksketch/)
