Smart Trim
======================

Smart Trim implements a new field formatter for textfields (text, text_long, and
text_with_summary, if you want to get technical) that improved upon the "Summary
or Trimmed" formatter built into Drupal 7 and ported to Backdrop CMS.

After installing and enabling Smart Trim, you should see a "Smart trimmed"
option in the format dropdown for your text fields. With smart trim, you have
control over:

  1. The trim length
  2. Whether the trim length is measured in characters or words
  3. Appending an optional suffix at the trim point
  4. Displaying an optional "More" link immediately after the trimmed text.
  5. Stripping out HTML tags from the field

The "More" link functionality may not make sense in many contexts, and may be
redundant in situations where "Read More" is included in set of links included
with the node.

Note that HTML markup not seen by end-users will still be counted when
calculating trim length. This may be addressed in future releases.

Installation
------------

- Install this module using the official Backdrop CMS instructions at
  https://backdropcms.org/guide/modules

Issues
------

Bugs and Feature requests should be reported in the Issue Queue:
https://github.com/backdrop-contrib/smart_trim/issues

Current Maintainers
-------------------

- Said El fazni (https://github.com/fazni/)


Credits
-------

- Ported to Backdrop CMS by Said El fazni (https://github.com/fazni).
- Originally written for Drupal by Ben Byrne (https://github.com/drywall).

License
-------

This project is GPL v2 software. See the LICENSE.txt file in this directory for
complete text.
