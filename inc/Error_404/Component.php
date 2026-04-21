<?php
/**
 * WP_Rig\WP_Rig\Error_404\Component class
 *
 * Enqueues the GSAP animation script on 404 error pages.
 *
 * @package wp_rig
 *
 * @js-file assets/js/src/404.js  Home link underline hover animation
 */

namespace WP_Rig\WP_Rig\Error_404;

use WP_Rig\WP_Rig\Component_Interface;
use function WP_Rig\WP_Rig\wp_rig;
use function add_action;
use function is_404;
use function wp_enqueue_script;
use function get_theme_file_uri;
use function get_theme_file_path;

/**
 * Class for 404 Error Page component.
 */
class Component implements Component_Interface {

	/**
	 * Gets the unique identifier for the theme component.
	 *
	 * @return string Component slug.
	 */
	public function get_slug(): string {
		return 'error-404';
	}

	/**
	 * Adds the action and filter hooks to integrate with WordPress.
	 */
	public function initialize(): void {
		add_action( 'wp_enqueue_scripts', array( $this, 'action_enqueue_script' ) );
	}

	/**
	 * Enqueues the 404 animation script only on 404 pages.
	 */
	public function action_enqueue_script(): void {
		if ( ! is_404() ) {
			return;
		}

		$js_path = get_theme_file_path( '/assets/js/404.min.js' );
		$js_uri  = get_theme_file_uri( '/assets/js/404.min.js' );

		if ( ! file_exists( $js_path ) ) {
			return;
		}

		wp_enqueue_script(
			'wp-rig-404',
			$js_uri,
			array(),
			wp_rig()->get_asset_version( $js_path ),
			true
		);
	}
}
