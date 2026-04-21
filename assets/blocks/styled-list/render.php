<?php
/**
 * Styled List block — frontend render template.
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use function WP_Rig\WP_Rig\wp_rig;

$attributes = is_array( $attributes ?? null ) ? $attributes : array();
$items      = is_array( $attributes['items'] ?? null ) ? $attributes['items'] : array();

$wrapper_attributes = wp_rig()->block_wrapper_attributes(
	array( 'styled-list' ),
	$attributes
);
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<ul class="styled-list__items">
		<?php foreach ( $items as $item ) : ?>
			<?php
			$content = isset( $item['content'] ) ? wp_kses_post( $item['content'] ) : '';
			if ( '' === $content ) {
				continue;
			}
			?>
			<li class="styled-list__item"><?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></li>
		<?php endforeach; ?>
	</ul>
</div>
