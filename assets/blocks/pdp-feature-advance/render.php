<?php
/**
 * PDP Feature Advance block — frontend render.
 *
 * Variables provided by WordPress at include-time:
 *   $attributes (array)    Block attributes from block.json + editor input.
 *   $content    (string)   Inner blocks HTML (unused — attribute-only block).
 *   $block      (WP_Block) Block instance.
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$attributes = is_array( $attributes ?? null ) ? $attributes : array();
$items_data = $attributes['items'] ?? array();

if ( empty( $items_data ) ) {
	return;
}

// Clamp to 10 items.
$items_data = array_slice( $items_data, 0, 10 );

$eyebrow   = isset( $attributes['eyebrow'] ) ? sanitize_text_field( $attributes['eyebrow'] ) : '';
$image_id  = isset( $attributes['imageId'] ) ? (int) $attributes['imageId'] : 0;
$image_url = isset( $attributes['imageUrl'] ) ? esc_url( $attributes['imageUrl'] ) : '';
$image_alt = isset( $attributes['imageAlt'] ) ? esc_attr( $attributes['imageAlt'] ) : '';

// Resolve image.
if ( $image_id > 0 ) {
	$img_tag = wp_get_attachment_image(
		$image_id,
		'full',
		false,
		array(
			'class'   => 'pfa-block__img',
			'loading' => 'lazy',
			'alt'     => $image_alt,
		)
	);
} elseif ( $image_url ) {
	$img_tag = '<img class="pfa-block__img" src="' . $image_url . '" alt="' . $image_alt . '" loading="lazy">';
} else {
	$img_tag = '';
}

$allowed_inline = array(
	'strong' => array(),
	'em'     => array(),
	'br'     => array(),
);
?>
<section class="pfa-block" data-pfa-block data-pfa-items="<?php echo esc_attr( count( $items_data ) ); ?>">

	<div class="pfa-block__inner">

		<?php /* ── Left sticky panel ─────────────────────────────────────── */ ?>
		<div class="pfa-block__left">
			<div class="pfa-block__left-body">

			<?php if ( $eyebrow ) : ?>
				<p class="pfa-block__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
			<?php endif; ?>

			<ul class="pfa-block__items" role="list">
				<?php foreach ( $items_data as $i => $item ) : ?>
					<?php
					$item_title = isset( $item['title'] ) ? sanitize_text_field( $item['title'] ) : '';
					$body_raw   = isset( $item['body'] ) ? $item['body'] : '';
					$body_html  = $body_raw ? wp_kses( nl2br( esc_html( $body_raw ) ), $allowed_inline ) : '';
					$is_first   = 0 === $i;
					?>
					<li class="pfa-block__item<?php echo $is_first ? ' is-active' : ' is-collapsed'; ?>"
						data-pfa-item="<?php echo esc_attr( $i ); ?>">

						<?php if ( $item_title ) : ?>
							<h3 class="pfa-block__item-title"><?php echo esc_html( $item_title ); ?></h3>
						<?php endif; ?>

						<div class="pfa-block__item-divider" aria-hidden="true">
							<span class="pfa-block__item-progress"></span>
						</div>

						<?php if ( $body_html ) : ?>
							<div class="pfa-block__item-body">
								<p><?php echo $body_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- sanitized above ?></p>
							</div>
						<?php endif; ?>

					</li>
				<?php endforeach; ?>
			</ul><!-- .pfa-block__items -->

			<nav class="pfa-block__nav" aria-label="<?php esc_attr_e( 'Navigate items', 'wp-rig' ); ?>">
				<button class="pfa-block__nav-btn pfa-block__nav-prev" aria-label="<?php esc_attr_e( 'Previous item', 'wp-rig' ); ?>">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
						<path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<span class="pfa-block__nav-sep" aria-hidden="true"></span>
				<button class="pfa-block__nav-btn pfa-block__nav-next" aria-label="<?php esc_attr_e( 'Next item', 'wp-rig' ); ?>">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
						<path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</nav><!-- .pfa-block__nav -->

			</div><!-- .pfa-block__left-body -->
		</div><!-- .pfa-block__left -->

		<?php /* ── Right image column ──────────────────────────────────────── */ ?>
		<?php if ( $img_tag ) : ?>
			<div class="pfa-block__right" aria-hidden="true">
				<?php echo $img_tag; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above ?>
			</div>
		<?php endif; ?>

	</div><!-- .pfa-block__inner -->

</section><!-- .pfa-block -->
