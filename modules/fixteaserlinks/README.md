Fix Teaser Links
================

The “Fix Teaser Links” module is a simple module that may be used to mange the
visibility of the links that appear below content teasers (i.e. “Add new
comment”, “Log in or register to post comments”, “Read more”).

It is intended for site builders who want a cleaner look of teaser lists.

Overview
--------

The module has no menu. By default, it will prevent the links “Add new comment”
and “Log in or register to post comments” from appearing below teasers. It will
not remove the link “Read more”.

The Drupal version of this module used drush commands to toggle these settings.

The short-term plan for the Backdrop version is to implement a configuration
page so that these settings can be easily toggled via the Admin UI.

The long-term plan is to have these settings be configured per-content type via
the Manage display > Teaser page (`/admin/structure/types/manage/[content_type]/display/teaser`).

Installation
------------

- Install and enable this module using the official Backdrop CMS instructions at
https://backdropcms.org/guide/modules

- [Planned - not implemented yet] Visit the configuration page under
Administration > Configuration > System > Teaser Links
(admin/config/system/fixteaserlinks) and enter the required information.

- Clear caches.

Documentation
-------------

Additional documentation is located in the Wiki:
https://github.com/backdrop-contrib/fixteaserlinks/wiki/Documentation

Issues
------

Bugs and Feature requests should be reported in the Issue Queue:
https://github.com/backdrop-contrib/fixteaserlinks/issues

Current Maintainers
-------------------

- Gregory Netsas (https://github.com/klonos)
- co-maintainers wanted

Credits
-------

- Ported to Backdrop CMS by Gregory Netsas (https://github.com/klonos)
- Originally written for Drupal by Gisle Hannemyr (https://www.drupal.org/u/gisle)

License
-------

This project is GPL v2 software. See the LICENSE.txt file in this directory for
complete text.