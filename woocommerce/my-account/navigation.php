<?php
/**
 * My Account — Navigation Tabs
 *
 * Styled vertical tabs (desktop) / horizontal scroll strip (mobile).
 * The 'logout' item is separated visually at the bottom.
 *
 * @package wp_rig
 */

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_account_navigation' );

$menu_items = wc_get_account_menu_items();

?>
<nav class="my-account-nav" aria-label="<?php esc_attr_e( 'Account pages', 'woocommerce' ); ?>">
	<ul class="my-account-nav__list" role="list">
		<?php foreach ( $menu_items as $endpoint => $label ) : ?>
			<?php
			$classes     = wc_get_account_menu_item_classes( $endpoint );
			$is_active   = wc_is_current_account_menu_item( $endpoint );
			$is_logout   = 'customer-logout' === $endpoint;
			$href        = wc_get_account_endpoint_url( $endpoint );
			$extra_class = $is_logout ? ' my-account-nav__item--logout' : '';
			?>
			<li class="my-account-nav__item <?php echo esc_attr( $classes . $extra_class ); ?>">
				<a
					class="my-account-nav__link<?php echo $is_active ? ' my-account-nav__link--active' : ''; ?>"
					href="<?php echo esc_url( $href ); ?>"
					<?php echo $is_active ? 'aria-current="page"' : ''; ?>
				>
					<?php echo esc_html( $label ); ?>
				</a>
			</li>
		<?php endforeach; ?>
	</ul>
</nav>

<?php do_action( 'woocommerce_after_account_navigation' ); ?>
