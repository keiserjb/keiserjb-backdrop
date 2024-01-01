# Save Draft

`Save Draft` replaces the default "Save" button on the content creation page and 
removes the "Published" checkbox under "Publishing options". Instead it presents 
a "Publish" button and a "Save Draft" button for the same functionality with 
improved usability. "Publish" will save in published form and "Save as Draft" 
will save in unpublished form with a single click.

![Save Draft](https://github.com/backdrop-contrib/save_draft/blob/1.x-1.x/images/save_draft.gif "Save Draft example")

You also have the option to allow drafts to be saved even if required fields
are not filled in.

## Installation

- Install this module using the official 
  [Backdrop CMS instructions](https://backdropcms.org/guide/modules)

## Usage

After enabling the module:

- By default once you have enabled the module, the "Save Draft" button will
  be activated on all content types and the "Skip Required Fields" functionality
  will not be turned on.
- To adjust the default settings, simply edit a content type and look under
  "Publishing options" for the "Save Draft" settings:
  
  ![Save Draft - Content type settings](https://github.com/backdrop-contrib/save_draft/blob/1.x-1.x/images/save_draft-content_type_publishing_settings.png "Save Draft Content Type Publishing Settings")

## Developers

If your module adds a button to the node form module and you are using the
"Skip required validation" option you can allow your button to also skip
required validation by adding the #skip_required_validation property to your
button. For example, if you are adding a button 'my_button' to the form actions
you would add this property also:
$form['actions']['my_button']['#skip_required_validation'] = TRUE;

## Issues

Bugs and Feature requests should be reported in the 
[Issue Queue](https://github.com/backdrop-contrib/save_draft/issues)

## Current Maintainers

- [Laryn Kragt Bakker](https://github.com/laryn) - [CEDC.org](https://cedc.org)

## Credits

- Ported to Backdrop CMS by [Laryn Kragt Bakker](https://github.com/laryn) - [CEDC.org](https://cedc.org).
- Current and past maintainers for the Drupal module: Pravin Ajaaz, ArunSelva, 
  Yorirou, JulienD, valderama, ksenzee, danjukes. Support for the Drupal
  module is also provided by Young Globes.

## License

This project is GPL v2 software. See the [LICENSE.txt](https://github.com/backdrop-contrib/save_draft/blob/1.x-1.x/LICENSE.txt) 
file in this directory for complete text.
