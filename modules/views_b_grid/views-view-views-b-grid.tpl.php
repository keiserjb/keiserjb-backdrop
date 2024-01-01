<?php

/**
 * @file
 * Default view template to display content using views_b_grid layout_type
 */
?>

<?php
$layout_type = $options['layout_type'];

switch ($layout_type) {
    case "fixed_container":
        print '<div class="l-secondary">';
          print '<div class="l-secondary-inner container">';
            print '<div class="l-secondary-inner-2 row">';
            if (!empty($title)) {
                print "<h3>$title</h3>";
            }
            foreach ($rows as $id => $row) {
                if ($row_classes[$id]) {
                    print '<div class="l-secondary-region ' . implode(' ', $row_classes[$id]) . '">' . $row . '</div>';
                }
            }
            print '</div>';
          print '</div>';
        print '</div>';
    break;

    case "full_width_container":
        print '<div class="l-secondary">';
          print '<div class="l-secondary-inner container container-fluid">';
            print '<div class="l-secondary-inner-2 row">';
              if (!empty($title)) {
                print "<h3>$title</h3>";
            }
              foreach ($rows as $id => $row) {
                if ($row_classes[$id]) {
                    print '<div class="l-secondary-region ' . implode(' ', $row_classes[$id]) . '">' . $row . '</div>';
                }
            }
            print '</div>';
          print '</div>';
        print '</div>';
    break;
}

?>
