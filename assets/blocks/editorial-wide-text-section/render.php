<?php
/**
 * Editorial Wide Text Section block — frontend render template.
 *
 * Variables provided by WordPress at include-time:
 *   $attributes (array)    Block attributes from block.json + editor input.
 *   $content    (string)   Inner blocks HTML (unused — no inner blocks).
 *   $block      (WP_Block) Block instance.
 *
 * Variants:
 *   heading-only  → centered H2, upright, 48px vertical padding, justify-between
 *   pull-quote    → centered blockquote, italic, 48px vertical padding, justify-center
 *   heading-body  → centered H2 + body paragraph, 80px vertical padding, justify-center
 *
 * @package wp_rig
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use function WP_Rig\WP_Rig\wp_rig;

$attributes   = is_array( $attributes ?? null ) ? $attributes : array();
$variant      = $attributes['variant'] ?? 'heading-only';
$heading_text = $attributes['headingText'] ?? '';
$quote_text   = $attributes['quoteText'] ?? '';
$body_text    = $attributes['bodyText'] ?? '';

$wrapper_attrs = wp_rig()->block_wrapper_attributes( array( 'ewts', 'ewts--' . $variant ), $attributes );
?>
<section <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="ewts__inner">

		<?php if ( 'pull-quote' === $variant ) : ?>

			<?php if ( $quote_text ) : ?>
			<blockquote class="ewts__quote">
				<?php echo esc_html( $quote_text ); ?>
			</blockquote>
			<?php endif; ?>

		<?php else : ?>

			<?php if ( $heading_text ) : ?>
			<h2 class="ewts__heading">
				<?php echo esc_html( $heading_text ); ?>
			</h2>
			<?php endif; ?>

			<?php if ( 'heading-body' === $variant && $body_text ) : ?>
			<p class="ewts__body">
				<?php echo esc_html( $body_text ); ?>
			</p>
			<?php endif; ?>

		<?php endif; ?>

	</div>
</section>
