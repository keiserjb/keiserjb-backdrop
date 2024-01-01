<div class="card mb-3 rounded-<?php echo $card_round; ?> <?php echo $bblock_id; ?> m-<?php echo $card_margin; ?> p-<?php echo $card_padding; ?> <?php echo $text_align; ?>">
  <div class="row g-0">
    <?php if ($image_position == 'left'): ?>
      <div class="col-md-4">
        <img src="<?php echo $image_path; ?>" class="img-fluid" alt="...">
      </div>
    <?php endif; ?>
    <div class="col-md-8">
      <div class="card-body">
        <?php if ($card_title): ?>
          <<?php echo $card_title_tag; ?> class="card-title"><?php echo $card_title; ?></<?php echo $card_title_tag; ?>>
        <?php endif; ?>
        <div class="card-text"><?php echo $card_content; ?></div>
      </div>
      <?php if ($card_footer): ?>
        <div class="card-footer mx-3 px-0 bg-transparent text-muted">
          <?php echo $card_footer; ?>
        </div>
      <?php endif; ?>
    </div>
    <?php if ($image_position == 'right'): ?>
      <div class="col-md-4">
        <img src="<?php echo $image_path; ?>" class="img-fluid" alt="...">
      </div>
    <?php endif; ?>
  </div>
</div>
