<?php
/**
 * WP_Rig\WP_Rig\Related_Products\Component class
 *
 * Enqueues JS for the related-products slider section.
 * The section is reusable across PDP and other pages, so assets are enqueued
 * whenever the theme detects a product or front page context, or via a filter.
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig\Related_Products;

use WP_Rig\WP_Rig\Component_Interface;
use function add_action;
use function apply_filters;
use function is_product;
use function is_front_page;
use function wp_enqueue_script;
use function get_theme_file_uri;
use function get_theme_file_path;
use function file_exists;
use function filemtime;

/**
 * Class for the Related Products component.
 */
class Component implements Component_Interface {

	/**
	 * Gets the unique identifier for the theme component.
	 *
	 * @return string Component slug.
	 */
	public function get_slug(): string {
		return 'related-products';
	}

	/**
	 * Adds action hooks.
	 */
	public function initialize(): void {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Enqueues the related-products JS on relevant pages.
	 *
	 * Filter `eternal_related_products_load_script` to force-load on any page.
	 */
	public function enqueue_assets(): void {
		$should_load = is_product() || is_front_page();

		/**
		 * Filters whether the related-products script should load on the current page.
		 *
		 * @param bool $should_load Default: true on PDP and front page.
		 */
		$should_load = (bool) apply_filters( 'eternal_related_products_load_script', $should_load );

		if ( ! $should_load ) {
			return;
		}

		$js_path = get_theme_file_path( '/assets/js/related-products.min.js' );
		$js_uri  = get_theme_file_uri( '/assets/js/related-products.min.js' );

		if ( ! file_exists( $js_path ) ) {
			return;
		}

		wp_enqueue_script(
			'eternal-related-products',
			$js_uri,
			array(),
			(string) filemtime( $js_path ),
			true  // load in footer
		);
	}
}
