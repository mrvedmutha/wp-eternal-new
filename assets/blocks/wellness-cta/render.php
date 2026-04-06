<?php
/**
 * Wellness CTA block — frontend render.
 *
 * Bottom section is mutually exclusive:
 *  - ctaLabel set   → CTA variant (bottomText above label + linked underline CTA)
 *  - ctaLabel empty → Tagline variant (bottomText only)
 *
 * @package wp_rig
 */

defined( 'ABSPATH' ) || exit;

$attributes  = is_array( $attributes ?? null ) ? $attributes : array();
$heading     = $attributes['heading'] ?? '';
$body        = $attributes['body'] ?? '';
$media_id    = isset( $attributes['mediaId'] ) ? (int) $attributes['mediaId'] : 0;
$media_url   = $attributes['mediaUrl'] ?? '';
$bottom_text = $attributes['bottomText'] ?? '';
$cta_label   = $attributes['ctaLabel'] ?? '';
$cta_url     = $attributes['ctaUrl'] ?? '';

$has_cta   = '' !== $cta_label;
$has_image = '' !== $media_url || $media_id > 0;

$wrapper_attrs = get_block_wrapper_attributes(
	array(
		'class' => 'wellness-cta',
	)
);

// Split body on blank lines into paragraphs.
$paragraphs = array_filter( array_map( 'trim', preg_split( '/\n{2,}/', $body ) ) );
?>
<section <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="wellness-cta__inner">

		<?php if ( $heading || $paragraphs ) : ?>
		<div class="wellness-cta__text">
			<?php if ( $heading ) : ?>
				<h2 class="wellness-cta__heading"><?php echo esc_html( $heading ); ?></h2>
			<?php endif; ?>

			<?php if ( $paragraphs ) : ?>
				<div class="wellness-cta__body">
					<?php foreach ( $paragraphs as $p ) : ?>
						<p><?php echo esc_html( $p ); ?></p>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
		<?php endif; ?>

		<?php if ( $has_image ) : ?>
		<div class="wellness-cta__image-wrap">
			<div class="wellness-cta__image-bg">
				<?php
				if ( $media_id ) {
					echo wp_get_attachment_image(
						$media_id,
						'large',
						false,
						array(
							'class' => 'wellness-cta__img',
							'alt'   => '',
						)
					);
				} else {
					echo '<img src="' . esc_url( $media_url ) . '" alt="" class="wellness-cta__img" loading="lazy" />';
				}
				?>
			</div>
		</div>
		<?php endif; ?>

		<?php if ( $has_cta ) : ?>
		<div class="wellness-cta__bottom wellness-cta__bottom--cta">
			<?php if ( $bottom_text ) : ?>
				<p class="wellness-cta__bottom-text"><?php echo esc_html( $bottom_text ); ?></p>
			<?php endif; ?>
			<a class="wellness-cta__cta" href="<?php echo esc_url( $cta_url ); ?>">
				<span class="wellness-cta__cta-label"><?php echo esc_html( $cta_label ); ?></span>
				<span class="wellness-cta__cta-rule" aria-hidden="true"></span>
			</a>
		</div>

		<?php elseif ( $bottom_text ) : ?>
		<div class="wellness-cta__bottom wellness-cta__bottom--tagline">
			<p class="wellness-cta__bottom-text"><?php echo esc_html( $bottom_text ); ?></p>
		</div>
		<?php endif; ?>

	</div>
</section>
