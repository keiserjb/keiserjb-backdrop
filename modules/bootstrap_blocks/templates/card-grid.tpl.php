<div class="row <?php echo $card_columns; ?> g-<?php echo $card_gutter; ?> <?php echo $bblock_id; ?>">
  <?php foreach ($cards as $delta => $item): ?>
    <div class="col">
      <div class="card rounded-<?php echo $card_round; ?> <?php echo $bblock_id; ?> p-<?php echo $card_padding; ?> <?php echo $text_align; ?>">
        <?php if ($item['card_header']): ?>
          <?php if ($item['image_url']): ?>
            <img src="<?php echo $item['card_header']; ?>" class="card-img-top" alt="...">
          <?php else: ?>
            <div class="card-header">
              <?php echo $item['card_header']; ?>
            </div>
          <?php endif; ?>
        <?php endif; ?>
        <div class="card-body">
          <?php if ($item['card_title']): ?>
            <<?php echo $card_title_tag; ?> class="card-title"><?php echo $item['card_title']; ?></<?php echo $card_title_tag; ?>>
          <?php endif; ?>
          <div class="card-text"><?php echo $item['card_content']; ?></div>
        </div>
        <?php if ($item['card_footer']): ?>
          <div class="card-footer text-muted">
            <?php echo $item['card_footer']; ?>
          </div>
        <?php endif; ?>
      </div>
    </div>
  <?php endforeach; ?>
</div>

