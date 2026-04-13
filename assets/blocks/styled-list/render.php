<?php
/**
 * Styled List block — frontend render template.
 *
 * Variables provided by WordPress at include-time:
 *   $attributes (array)    Block attributes from block.json + editor input.
 *   $content    (string)   Inner blocks HTML (the list items).
 *   $block      (WP_Block) Block instance.
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use function WP_Rig\WP_Rig\wp_rig;

$attributes = is_array( $attributes ?? null ) ? $attributes : array();
$content    = is_string( $content ?? null ) ? $content : '';

// Build wrapper attributes via namespaced helper.
$wrapper_attributes = wp_rig()->block_wrapper_attributes(
	array( 'styled-list' ),
	$attributes
);
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<ul class="styled-list__items">
		<?php
		// Inner blocks content: already prepared by WordPress and safe to output as-is.
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $content;
		?>
	</ul>
</div>
