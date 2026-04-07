<?php
/**
 * PDP Feature Medium block — frontend render.
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

$eyebrow    = isset( $attributes['eyebrow'] ) ? sanitize_text_field( $attributes['eyebrow'] ) : '';
$media_type = isset( $attributes['mediaType'] ) ? sanitize_key( $attributes['mediaType'] ) : 'video';
$media_id   = isset( $attributes['mediaId'] ) ? (int) $attributes['mediaId'] : 0;
$media_url  = isset( $attributes['mediaUrl'] ) ? esc_url( $attributes['mediaUrl'] ) : '';
$media_alt  = isset( $attributes['mediaAlt'] ) ? esc_attr( $attributes['mediaAlt'] ) : '';

// Build right-panel media markup.
$media_html = '';

if ( 'video' === $media_type && $media_url ) {
	$media_html = sprintf(
		'<video class="pfm-block__media" src="%s" autoplay muted loop playsinline></video>',
		$media_url
	);
} elseif ( 'image' === $media_type ) {
	if ( $media_id > 0 ) {
		$media_html = wp_get_attachment_image(
			$media_id,
			'full',
			false,
			array(
				'class'   => 'pfm-block__media',
				'loading' => 'lazy',
				'alt'     => $media_alt,
			)
		);
	} elseif ( $media_url ) {
		$media_html = '<img class="pfm-block__media" src="' . $media_url . '" alt="' . $media_alt . '" loading="lazy">';
	}
}

$allowed_inline = array(
	'strong' => array(),
	'em'     => array(),
	'br'     => array(),
);
?>
<section class="pfm-block">

	<div class="pfm-block__inner">

		<?php /* ── Left sticky column ─────────────────────────────────────── */ ?>
		<div class="pfm-block__left">

			<?php if ( $eyebrow ) : ?>
				<p class="pfm-block__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
			<?php endif; ?>

			<ul class="pfm-block__items" role="list">
				<?php foreach ( $items_data as $item ) : ?>
					<?php
					$heading   = isset( $item['heading'] ) ? sanitize_text_field( $item['heading'] ) : '';
					$body_raw  = isset( $item['body'] ) ? $item['body'] : '';
					$body_html = $body_raw ? wp_kses( nl2br( esc_html( $body_raw ) ), $allowed_inline ) : '';
					?>
					<li class="pfm-block__item">

						<?php if ( $heading ) : ?>
							<h3 class="pfm-block__item-heading"><?php echo esc_html( $heading ); ?></h3>
						<?php endif; ?>

						<?php if ( $body_html ) : ?>
							<div class="pfm-block__item-body">
								<p><?php echo $body_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- sanitized above ?></p>
							</div>
						<?php endif; ?>

					</li>
				<?php endforeach; ?>
			</ul>

		</div><!-- .pfm-block__left -->

		<?php /* ── Right media panel ──────────────────────────────────────── */ ?>
		<?php if ( $media_html ) : ?>
			<div class="pfm-block__right" aria-hidden="<?php echo 'video' === $media_type ? 'true' : 'false'; ?>">
				<?php echo $media_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built above ?>
			</div>
		<?php endif; ?>

	</div><!-- .pfm-block__inner -->

</section><!-- .pfm-block -->
