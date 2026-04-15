<?php
/**
 * WP Rig functions and definitions
 *
 * @package WP_Rig
 */

/**
 * WP Rig functions and definitions
 *
 * This file must be parseable by PHP 5.2.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package wp_rig
 */

/**
 * Add LiveReload script in development mode.
 */

define( 'WP_RIG_MINIMUM_WP_VERSION', '5.4' );
define( 'WP_RIG_MINIMUM_PHP_VERSION', '8.0' );

// Bail if requirements are not met.
if ( version_compare( $GLOBALS['wp_version'], WP_RIG_MINIMUM_WP_VERSION, '<' ) || version_compare( phpversion(), WP_RIG_MINIMUM_PHP_VERSION, '<' ) ) {
	require get_template_directory() . '/inc/back-compat.php';
	return;
}

// Include WordPress shims.
require get_template_directory() . '/inc/wordpress-shims.php';

// Setup autoloader (via Composer or custom).
if ( file_exists( get_template_directory() . '/vendor/autoload.php' ) ) {
	require get_template_directory() . '/vendor/autoload.php';
} else {
	/**
	 * Custom autoloader function for theme classes.
	 *
	 * @access private
	 *
	 * @param string $class_name Class name to load.
	 * @return bool True if the class was loaded, false otherwise.
	 */
	function _wp_rig_autoload( $class_name ) {
		$namespace = 'WP_Rig\WP_Rig';

		if ( 0 !== strpos( $class_name, $namespace . '\\' ) ) {
			return false;
		}

		$parts = explode( '\\', substr( $class_name, strlen( $namespace . '\\' ) ) );

		$path = get_template_directory() . '/inc';
		foreach ( $parts as $part ) {
			$path .= '/' . $part;
		}
		$path .= '.php';

		if ( ! file_exists( $path ) ) {
			return false;
		}

		require_once $path;

		return true;
	}
	spl_autoload_register( '_wp_rig_autoload' );
}

// Load the `wp_rig()` entry point function.
require get_template_directory() . '/inc/functions.php';

// @wp-cli:start
// Add custom WP CLI commands.
if ( defined( 'WP_CLI' ) && WP_CLI ) {
	$wp_cli_commands = get_template_directory() . '/wp-cli/wp-rig-commands.php';
	if ( file_exists( $wp_cli_commands ) ) {
		require_once $wp_cli_commands;
	}
}
// @wp-cli:end

// Initialize the theme.
call_user_func( 'WP_Rig\WP_Rig\wp_rig' );

/**
 * WooCommerce My Account Redirect Logic
 *
 * Redirects non-logged-in users from /my-account/ to /login/ page.
 * Never redirects in admin/editor context to allow editing.
 */
add_action( 'template_redirect', 'wp_rig_wc_account_redirect' );

/**
 * Redirect non-logged-in users from my-account to login page.
 *
 * Only redirects on frontend when not in editor context.
 *
 * @return void
 */
function wp_rig_wc_account_redirect() {
	// Only run on frontend, not in admin/block editor.
	if ( is_admin() ) {
		return;
	}

	// Check if we're in the block editor (editing a page).
	if ( function_exists( 'is_block_editor' ) && is_block_editor() ) {
		return;
	}

	// Also check for REST API requests (block editor uses these).
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return;
	}

	// Only redirect if WooCommerce is active.
	if ( ! class_exists( 'WooCommerce' ) ) {
		return;
	}

	// Check if this is the my-account page.
	if ( ! is_page( 'my-account' ) ) {
		return;
	}

	// If user is not logged in, redirect to login page.
	if ( ! is_user_logged_in() ) {
		$login_url = home_url( '/login/' );
		wp_safe_redirect( $login_url );
		exit;
	}
}

add_filter( 'woocommerce_login_redirect', 'wp_rig_wc_login_redirect' );

/**
 * After successful login, redirect to my-account page.
 *
 * @return string The my-account page URL.
 */
function wp_rig_wc_login_redirect() {
	// Redirect to my-account page after login.
	return wc_get_page_permalink( 'myaccount' );
}

// @dev-only:start
/**
 * Load development-only helpers (LiveReload for dev proxy).
 * This file resides under optional/ and is not bundled for production.
 */
$__wprig_dev_helpers = get_template_directory() . '/optional/dev/dev-proxy-livereload.php';
if ( file_exists( $__wprig_dev_helpers ) ) {
	require_once $__wprig_dev_helpers;
}
// @dev-only:end
