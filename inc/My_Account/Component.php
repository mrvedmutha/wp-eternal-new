<?php
/**
 * WP_Rig\WP_Rig\My_Account\Component
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig\My_Account;

use WP_Rig\WP_Rig\Component_Interface;
use function add_action;
use function add_filter;
use function is_account_page;

/**
 * Handles WooCommerce My Account customisations.
 *
 * - Removes Downloads from the account menu (physical products only).
 * - Adds a body class used for layout overrides.
 */
class Component implements Component_Interface {

	/**
	 * {@inheritdoc}
	 */
	public function get_slug(): string {
		return 'my_account';
	}

	/**
	 * {@inheritdoc}
	 */
	public function initialize(): void {
		add_filter( 'woocommerce_account_menu_items', array( $this, 'remove_downloads_tab' ), 10, 1 );
		add_filter( 'body_class', array( $this, 'add_body_class' ), 10, 1 );
	}

	/**
	 * Removes the Downloads tab — unnecessary for a physical-product store.
	 *
	 * @param array $items Menu items keyed by endpoint slug.
	 * @return array
	 */
	public function remove_downloads_tab( array $items ): array {
		unset( $items['downloads'] );
		return $items;
	}

	/**
	 * Adds 'eternal-my-account' body class on all account pages.
	 *
	 * @param array $classes Existing body classes.
	 * @return array
	 */
	public function add_body_class( array $classes ): array {
		if ( is_account_page() ) {
			$classes[] = 'eternal-my-account';
		}
		return $classes;
	}
}
