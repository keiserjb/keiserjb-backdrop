<div class="card rounded-<?php echo $card_round; ?> <?php echo $bblock_id; ?> m-<?php echo $card_margin; ?> p-<?php echo $card_padding; ?> <?php echo $text_align; ?>">
  <?php if ($card_header): ?>
    <div class="card-header">
      <?php echo $card_header; ?>
    </div>
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
</div>