<?php
/**
 * My Account — Layout
 *
 * Two-column layout: sidebar tab navigation left, content right.
 * On mobile the tabs collapse to a horizontal scroll strip.
 *
 * @package wp_rig
 */

defined( 'ABSPATH' ) || exit;

// Resolve heading for the active endpoint.
$current_endpoint = WC()->query ? WC()->query->get_current_endpoint() : '';
$menu_items       = wc_get_account_menu_items();

// Dashboard endpoint key is an empty string.
if ( '' === $current_endpoint || ! isset( $menu_items[ $current_endpoint ] ) ) {
	$heading = isset( $menu_items['dashboard'] ) ? $menu_items['dashboard'] : __( 'Dashboard', 'woocommerce' );
} else {
	$heading = $menu_items[ $current_endpoint ];
}

?>
<div class="my-account-layout">

	<aside class="my-account-sidebar" aria-label="<?php esc_attr_e( 'Account navigation', 'wp-rig' ); ?>">
		<?php do_action( 'woocommerce_account_navigation' ); ?>
	</aside>

	<div class="my-account-content">
		<h1 class="my-account-content__heading"><?php echo esc_html( $heading ); ?></h1>

		<div class="my-account-content__body">
			<?php do_action( 'woocommerce_account_content' ); ?>
		</div>
	</div>

</div>
