<div class="card text-white rounded-<?php echo $card_round; ?> <?php echo $bblock_id; ?> m-<?php echo $card_margin; ?> <?php echo $text_align; ?>">
  <img class="rounded-<?php echo $card_round; ?>" src="<?php echo $image_path; ?>" class="card-img-top" alt="...">
  <div class="card-img-overlay rounded-<?php echo $card_round; ?> <?php echo $bblock_id; ?> m-<?php echo $card_margin; ?> p-<?php echo $card_padding; ?> <?php echo $text_align; ?>">
    <?php if ($card_header): ?>
      <div class="card-header bg-transparent">
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
      <div class="card-footer bg-transparent">
        <?php echo $card_footer; ?>
      </div>
    <?php endif; ?>
  </div>
</div>
