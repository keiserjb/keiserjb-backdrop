Bootstrap Blocks
=================

Provides Bootstrap components as blocks.

HOW TO INSTALL:
---------------

- Requires Bootsrap 5 library to be loaded, as may be provided by the 
[Bootsrap 5 lite](https://backdropcms.org/project/bootstrap5_lite) theme, for
example. This module does not load the library.
- Install this module using the official Backdrop CMS instructions at 
https://backdropcms.org/guide/modules


Usage
---------------
The following blocks are provided:
- Accordion
- Single Card
- Card Group
- Card Grid
- Image Card
- Hero
- Tabs
- Vertical Tabs


Simply add one (or more) of these blocks to your layout.

The Accordion, Card Group, Card Grid, Tabs, and Vertical Tabs allow to click to
add multiple sets of tabs/cards in the block configuration form in layouts. To
delete a tab/card, delete all its contents as empty cards are removed. 

The ability to re-position tabs/cards is not implemented.

The tabs/cards forms provide fields for:
- Header
- Content area
  - Content area title
  - Content
- Footer

Single image cards allow image upload within the form. 

To create an image card
within a card group, the URL to the image can be types into the Card Header
field using the prefix `url::`. This will render an image at that URL if it is
full path (for example with `http://` prefixed) or otherwise, the image must be
in your public files folder.

For example:
- `url::http://remote-site.com/image-path.image.png` will display the image
from that URL.
- `url::image-path/image.png` will work if there is such an image at that path
in the public files folder of your installation.


      
LICENSE
---------------    

This project is GPL v2 software. See the LICENSE.txt file in this directory 
for complete text.

CURRENT MAINTAINERS
---------------    

docwilmot (github.com/docwilmot)

Inspired by, and code samples from, Bootstrap Blocks Italia:
- https://www.drupal.org/project/bootstrap_blocks
- By Mario Linguito (https://www.drupal.org/u/drp_distruptor)
