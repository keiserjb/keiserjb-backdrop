<div class="card rounded-<?php echo $card_round; ?> <?php echo $bblock_id; ?> m-<?php echo $card_margin; ?> p-<?php echo $card_padding; ?> <?php echo $text_align; ?>">
  <?php if ($image_position == 'top'): ?>
    <img src="<?php echo $image_path; ?>" class="card-img-top" alt="...">
  <?php endif; ?>
  <div class="card-body">
    <?php if ($card_title): ?>
      <<?php echo $card_title_tag; ?> class="card-title"><?php echo $card_title; ?></<?php echo $card_title_tag; ?>>
    <?php endif; ?>
    <div class="card-text"><?php echo $card_content; ?></div>
  </div>
  <?php if ($card_footer): ?>
    <div class="card-footer text-muted">
      <?php echo $card_footer; ?>
    </div>
  <?php endif; ?>
  <?php if ($image_position == 'bottom'): ?>
    <img src="<?php echo $image_path; ?>" class="card-img-bottom" alt="...">
  <?php endif; ?>
</div>