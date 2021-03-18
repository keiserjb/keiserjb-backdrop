<?php if (!empty($title)): ?>
  <h3><?php print $title ?></h3>
<?php endif ?>

<div id="views-bootstrap-accordion-<?php print $id ?>" class="<?php foreach($classes as $key => $value) { print $value; } ?>">
  <?php foreach ($rows as $key => $row): ?>
    <?php if (isset($titles[$key])): ?>
      <div class="panel panel-default">
        <div class="panel-heading">
          <<?php print $title_tag; ?> class="panel-title">
            <a class="accordion-toggle collapsed"
              data-toggle="collapse"
              data-parent="#views-bootstrap-accordion-<?php print $id ?>"
              href="#collapse-<?php print $id . '-' . $key ?>">
              <?php print $titles[$key] ?>
            </a>
          </<?php print $title_tag; ?>>
        </div>

        <div id="collapse-<?php print $id . '-' . $key ?>" class="panel-collapse collapse">
          <div class="panel-body">
            <?php print $row ?>
          </div>
        </div>
      </div>
    <?php endif ?>
  <?php endforeach ?>
</div>
