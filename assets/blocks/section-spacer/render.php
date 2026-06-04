<?php
/**
 * Section Spacer block — frontend render template.
 *
 * @package wp_rig
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$attributes   = is_array( $attributes ?? null ) ? $attributes : array();
$desktop      = absint( $attributes['spacingDesktop'] ?? 80 );
$tablet       = absint( $attributes['spacingTablet'] ?? 60 );
$mobile       = absint( $attributes['spacingMobile'] ?? 40 );
$inline_style = sprintf( '--sp-d:%dpx;--sp-t:%dpx;--sp-m:%dpx;', $desktop, $tablet, $mobile );
?>
<div class="section-spacer" style="<?php echo esc_attr( $inline_style ); ?>" aria-hidden="true"></div>
