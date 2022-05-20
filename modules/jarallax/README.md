Jarallax - Just Another Parallax
=============

Smooth parallax scrolling effect for background images using the
[Jarallax](https://github.com/nk-o/jarallax) plugin from `nk-o`.

Installation
------------

- Install this module using the [official Backdrop CMS instructions](https://backdropcms.org/guide/modules).

- Visit the configuration page under **Administration > Configuration > User
  Interface > Jarallax** (`admin/config/user-interface/jarallax`).

- Adjust the default settings and add the elements that you wish to add the
  parallax effect to. The parameters follow the [options](https://github.com/nk-o/jarallax#options)
  provided in the Jarallax library.

Usage
------------
Currently you'll need to add a `min-height` or `aspect-ratio` or `padding` in
the CSS settings for the elements you apply Jarallax to, otherwise they will
collapse when it is applied and will not be visible. [Follow this issue.](https://github.com/backdrop-contrib/jarallax/issues/2)

Roadmap
------
Long term vision includes:

 - Implementing more of the basic options into the admin UI.
 - Implementing Jarallax element and Youtube/Vimeo background video options.
 - Adding a modified hero block that lets you add image, text, etc. and
   configure the parallax effect all in one place.

Wiki
------

Please add and review usage guidelines in the [Wiki](https://github.com/backdrop-contrib/jarallax/wiki).

Issues
------

Bugs and Feature requests should be reported in the [Issue Queue](https://github.com/backdrop-contrib/jarallax/issues).

Current Maintainers
-------------------

- [Laryn Kragt Bakker](https://github.com/laryn) - [CEDC.org](https://cedc.org).

Credits
-------

- Created for Backdrop CMS by [Laryn Kragt Bakker](https://github.com/laryn) - [CEDC.org](https://cedc.org).
- Early work on this module was based on the structure of the [Scroll Reveal](https://github.com/backdrop-contrib/scrollreveal) module.
- The Jarallax plugin is by [nk-o](https://github.com/nk-o).

License
-------

This project is GPL v2 software. See the LICENSE.txt file in this directory for
complete text.

The Jarallax plugin itself has been released under the MIT license.

