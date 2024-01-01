Navbar
======

A very simple mobile friendly navigation toolbar. The Navbar module displays a bar containing top-level administrative components across the top of the screen or on left side.

In addition to providing deep-level responsive access into administrative functions without refreshing the page.
Navbar module has a drawer section where it displays links provided by other modules. The drawer can be hidden/shown by clicking on its corresponding tab.


Prerequisite
------------

The Navbar module requires Backdrop core's Administration bar module, but the Administration bar is suppressed if the Navbar module is enabled.


Installation
------------

- Enable Backdrop core's Administration bar module.
- Install this module using the official Backdrop CMS instructions at
  https://backdropcms.org/guide/modules
- You can show or hide some components (search bar, shortcuts, notification badge etc.) on the module's "Configure" page and switch light/dark theme.


Shortcuts tray
--------------
It provides a toolbar on the top of the page to which you can add links.

Usage:
- You can enable the shortcuts tray on module's configure page: Administration > Configuration > Administration > Navbar
- Go to Administration > Configuration > User interface > Navbar shortcuts. Here you can create and delete shortcut set, and add, modify, delete links of a shortcut set.
- On the 'List links' page use the 'Show row weights' for more details.
- You can switch current shortcut set on the user profil page on 'Navbar shortcuts' tab.
- Shortcut sets can be imported, exported by Configuration management: Administration > Configuration > Development > Configuration management


3rd party JavaScript libraries
------------------------------

The Navbar module depends on several third party JavaScript libraries, which included in 'js' directory:
- [Backbone](http://backbonejs.org/) (version >= 1.0.0)
- [Underscore](http://underscorejs.org/) (version >=1.5.0)
- Modernizr: [preconfigured version of Modernizr](http://modernizr.com/download/#-inputtypes-svg-touchevents-cssclasses-addtest-teststyles-prefixes-elem_details). Configuration:
  - Input Types (HTML5)
  - SVG (Misc.)
  - Touch Events (Misc.)
  - Add CSS Classes (Extra)
  - Modernizr.addTest (Extensibility)
  - Modernizr.testStyles (Extensibility)
  - Modernizr._prefixes (Extensibility)
  - elem-details (Non-core detects)


Application programming interface (API)
---------------------------------------

You can integrate your custom module's links into the Navbar toolbar. See this: 'navbar.api.php'


Including styling assets for a menu item
----------------------------------------

If you add a top-level menu item that requires an associated icon, you can add the styling assets to the page with hook_navbar. Follow this example.
```php
function workbench_navbar() {
  $items['workbench'] = array(
    '#attached' => array(
      'css' => array(backdrop_get_path('module', 'workbench') . '/workbench.navbar.icons.css'),
    ),
  );
  return $items;
}
```


Icons
-----

The toolbar uses the SVG icons designed by ry5n: [https://github.com/ry5n/libricons](https://github.com/ry5n/libricons)  
Recommended application for create an icon: [Inkscape](https://inkscape.org/)  
Set the page size to 16x16px (Inkscape: File > Document Properties > Width: 16, Height: 16, Units: px)


Issues
------

Bugs and Feature requests should be reported in the Issue Queue:
https://github.com/backdrop-contrib/navbar/issues


Current Maintainers
-------------------

- Attila Vasas (https://github.com/vasasa).


Credits
-------

- Ported to Backdrop CMS by Attila Vasas (https://github.com/vasasa).
- Originally written for Drupal by Jesse Beach (https://www.drupal.org/u/jessebeach).


License
-------

This project is GPL v2 software. See the LICENSE.txt file in this directory for
complete text.


Screenshots
-----------
Vertical orientation of Navbar (light theme):
![Vertical](https://github.com/backdrop-contrib/navbar/blob/1.x-1.x/images/screenshot-vertical.png)

Horizontal orientation of Navbar (light theme):
![Horizontal](https://github.com/backdrop-contrib/navbar/blob/1.x-1.x/images/screenshot-horizontal.png)

Vertical orientation of Navbar (dark theme):
![Vertical](https://github.com/backdrop-contrib/navbar/blob/1.x-1.x/images/screenshot-vertical-dark.png)

Horizontal orientation of Navbar (dark theme):
![Horizontal](https://github.com/backdrop-contrib/navbar/blob/1.x-1.x/images/screenshot-horizontal-dark.png)
