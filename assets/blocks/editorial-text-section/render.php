<?php
/**
 * Editorial Text Section block — frontend render template.
 *
 * Variables provided by WordPress at include-time:
 *   $attributes (array)    Block attributes from block.json + editor input.
 *   $content    (string)   Inner blocks HTML (unused — no inner blocks).
 *   $block      (WP_Block) Block instance.
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$attributes = is_array( $attributes ?? null ) ? $attributes : array();
$eyebrow    = $attributes['eyebrowText'] ?? __( 'Scientific Foundation', 'wp-rig' );
$body_p1    = $attributes['bodyParagraph1'] ?? '';
$body_p2    = $attributes['bodyParagraph2'] ?? '';
$pull_quote = $attributes['pullQuoteText'] ?? '';
?>
<section class="editorial-text-section">
	<div class="editorial-text-section__spacer" aria-hidden="true"></div>
	<div class="editorial-text-section__sticky">

		<p class="editorial-text-section__eyebrow">
			<?php echo esc_html( $eyebrow ); ?>
		</p>

		<div class="editorial-text-section__body">
			<?php if ( $body_p1 ) : ?>
			<p class="editorial-text-section__body-p">
				<?php echo esc_html( $body_p1 ); ?>
			</p>
			<?php endif; ?>
			<?php if ( $body_p2 ) : ?>
			<p class="editorial-text-section__body-p">
				<?php echo esc_html( $body_p2 ); ?>
			</p>
			<?php endif; ?>
		</div>

		<p class="editorial-text-section__pull-quote">
			<?php echo esc_html( $pull_quote ); ?>
		</p>

	</div>
</section>
