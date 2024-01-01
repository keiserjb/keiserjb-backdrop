<div class="<?php echo $bblock_id; ?> m-<?php echo $tabs_margin; ?> p-<?php echo $tabs_padding; ?> d-flex align-items-start border">
  
  <div class="nav nav-pills flex-column" id="<?php echo $bblock_id; ?>" role="tablist">
  <?php foreach ($tabs as $delta => $item): ?>
    <?php $active = ($delta == 0) ? 'active' : ''; ?>
      <button class="nav-link <?php echo $active; ?>" id="tabv-<?php echo $delta; ?>" data-bs-toggle="tab" data-bs-target="#tabv-content-<?php echo $delta; ?>" role="tab" type="button" aria-controls="tabv-content-<?php echo $delta; ?>" aria-selected="true">
      <?php echo $item['title']; ?>
      </button>
    <?php endforeach; ?>
  </div>

  <div class="tab-content" id="<?php echo $bblock_id; ?>Content">
  <?php foreach ($tabs as $delta => $item): ?>
    <?php $active = ($delta == 0) ? 'show active' : ''; ?>
    <div class="tab-pane p-4 fade <?php echo $active; ?>" id="tabv-content-<?php echo $delta; ?>" role="tabpanel" aria-labelledby="tabv-content-<?php echo $delta; ?>-tab"><?php echo $item['content']; ?></div>
    <?php endforeach; ?>
  </div>
</div>

