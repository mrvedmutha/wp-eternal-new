<?php
/**
 * My Account — Dashboard
 *
 * Welcome message shown on the main account dashboard.
 *
 * @package wp_rig
 */

defined( 'ABSPATH' ) || exit;

$allowed_html = array(
	'a' => array(
		'href' => array(),
	),
);

$orders_url  = wc_get_endpoint_url( 'orders' );
$address_url = wc_get_endpoint_url( 'edit-address' );
$account_url = wc_get_endpoint_url( 'edit-account' );

?>
<div class="my-account-dashboard">

	<p class="my-account-dashboard__welcome">
		<?php
		printf(
			/* translators: 1: user display name 2: logout url */
			wp_kses( __( 'Hello, %1$s. <span class="my-account-dashboard__not-you">(Not %1$s? <a href="%2$s">Log out</a>)</span>', 'woocommerce' ), array_merge( $allowed_html, array( 'span' => array( 'class' => array() ) ) ) ),
			'<strong>' . esc_html( $current_user->display_name ) . '</strong>',
			esc_url( wc_logout_url() )
		);
		?>
	</p>

	<p class="my-account-dashboard__description">
		<?php
		if ( wc_shipping_enabled() ) {
			/* translators: 1: orders URL 2: addresses URL 3: account URL */
			$desc = __( 'From your account dashboard you can view your <a href="%1$s">recent orders</a>, manage your <a href="%2$s">shipping and billing addresses</a>, and <a href="%3$s">edit your password and account details</a>.', 'woocommerce' );
		} else {
			/* translators: 1: orders URL 2: address URL 3: account URL */
			$desc = __( 'From your account dashboard you can view your <a href="%1$s">recent orders</a>, manage your <a href="%2$s">billing address</a>, and <a href="%3$s">edit your password and account details</a>.', 'woocommerce' );
		}
		printf(
			wp_kses( $desc, $allowed_html ),
			esc_url( $orders_url ),
			esc_url( $address_url ),
			esc_url( $account_url )
		);
		?>
	</p>

	<ul class="my-account-dashboard__cards" role="list">
		<li class="my-account-dashboard__card">
			<a href="<?php echo esc_url( $orders_url ); ?>" class="my-account-dashboard__card-link">
				<span class="my-account-dashboard__card-label"><?php esc_html_e( 'Orders', 'woocommerce' ); ?></span>
				<span class="my-account-dashboard__card-arrow" aria-hidden="true">→</span>
			</a>
		</li>
		<li class="my-account-dashboard__card">
			<a href="<?php echo esc_url( $address_url ); ?>" class="my-account-dashboard__card-link">
				<span class="my-account-dashboard__card-label"><?php esc_html_e( 'Addresses', 'woocommerce' ); ?></span>
				<span class="my-account-dashboard__card-arrow" aria-hidden="true">→</span>
			</a>
		</li>
		<li class="my-account-dashboard__card">
			<a href="<?php echo esc_url( $account_url ); ?>" class="my-account-dashboard__card-link">
				<span class="my-account-dashboard__card-label"><?php esc_html_e( 'Account Details', 'woocommerce' ); ?></span>
				<span class="my-account-dashboard__card-arrow" aria-hidden="true">→</span>
			</a>
		</li>
	</ul>

</div>

<?php
do_action( 'woocommerce_account_dashboard' );
do_action( 'woocommerce_before_my_account' ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
do_action( 'woocommerce_after_my_account' );  // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
