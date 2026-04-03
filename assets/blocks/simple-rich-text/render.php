<?php
/**
 * Simple Rich Text block — frontend render template.
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

$attributes     = is_array( $attributes ?? null ) ? $attributes : array();
$heading        = $attributes['heading'] ?? __( 'The Science of Vitality', 'wp-rig' );
$body_primary   = $attributes['bodyPrimary'] ?? '';
$body_secondary = $attributes['bodySecondary'] ?? '';

// Allowed inline tags for RichText body content.
$allowed_inline = array(
	'strong' => array(),
	'em'     => array(),
	'a'      => array(
		'href'   => array(),
		'target' => array(),
		'rel'    => array(),
	),
);
?>
<section class="simple-rich-text">
	<h2 class="simple-rich-text__heading">
		<?php echo esc_html( $heading ); ?>
	</h2>

	<?php if ( $body_primary ) : ?>
	<p class="simple-rich-text__body simple-rich-text__body--primary">
		<?php echo wp_kses( $body_primary, $allowed_inline ); ?>
	</p>
	<?php endif; ?>

	<?php if ( $body_secondary ) : ?>
	<p class="simple-rich-text__body simple-rich-text__body--secondary">
		<?php echo wp_kses( $body_secondary, $allowed_inline ); ?>
	</p>
	<?php endif; ?>
</section>
