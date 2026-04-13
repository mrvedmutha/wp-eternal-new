<?php
/**
 * Legal Page Content block — frontend render template.
 *
 * Variables provided by WordPress at include-time:
 *   $attributes (array)    Block attributes from block.json + editor input.
 *   $content    (string)   Inner blocks HTML (the rich content area).
 *   $block      (WP_Block) Block instance.
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use function WP_Rig\WP_Rig\wp_rig;

$attributes        = is_array( $attributes ?? null ) ? $attributes : array();
$hero_label        = $attributes['heroLabel'] ?? 'LEGAL';
$hero_heading      = $attributes['heroHeading'] ?? '';
$hero_last_updated = $attributes['heroLastUpdated'] ?? '';
$content           = is_string( $content ?? null ) ? $content : '';

// Build wrapper attributes via namespaced helper.
$wrapper_attributes = wp_rig()->block_wrapper_attributes(
	array( 'legal-page-content' ),
	$attributes
);
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<section class="legal-page-content__hero">
		<p class="legal-page-content__hero-label">
			<?php echo esc_html( $hero_label ); ?>
		</p>
		<?php if ( $hero_heading ) : ?>
			<h1 class="legal-page-content__hero-heading">
				<?php echo esc_html( $hero_heading ); ?>
			</h1>
		<?php endif; ?>
		<?php if ( $hero_last_updated ) : ?>
			<p class="legal-page-content__hero-date">
				<?php echo esc_html( $hero_last_updated ); ?>
			</p>
		<?php endif; ?>
	</section>

	<section class="legal-page-content__content">
		<div class="legal-page-content__content-inner">
			<?php
			// Inner blocks content: already prepared by WordPress and safe to output as-is.
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo $content;
			?>
		</div>
	</section>
</div>
