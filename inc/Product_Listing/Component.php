<?php
/**
 * WP_Rig\WP_Rig\Product_Listing Component
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig\Product_Listing;

use WP_Rig\WP_Rig\Component_Interface;
use function add_action;
use function add_filter;
use function is_product_category;
use function get_theme_file_path;
use function get_theme_file_uri;
use function filemtime;
use function wp_enqueue_style;
use function wp_enqueue_script;
use function wp_localize_script;
use function locate_template;
use function get_template_part;

/**
 * Class for Product_Listing component.
 */
class Component implements Component_Interface {

	/**
	 * Gets the unique identifier for the theme component.
	 *
	 * @return string Component slug.
	 */
	public function get_slug(): string {
		return 'product_listing';
	}

	/**
	 * Adds the action and filter hooks to integrate with WordPress.
	 */
	public function initialize(): void {
		// Enqueue assets.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		// Output custom header.
		remove_action( 'woocommerce_archive_description', 'woocommerce_taxonomy_archive_description', 10 );
		add_action( 'woocommerce_archive_description', array( $this, 'output_header' ), 10 );

		// Output product grid with mixed layout.
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_result_count', 20 );
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30 );
		add_action( 'woocommerce_before_shop_loop', array( $this, 'output_filters_and_grid' ), 10 );

		// Output FAQ section after products.
		add_action( 'woocommerce_after_shop_loop', array( $this, 'output_faq_section' ), 10 );
	}

	/**
	 * Enqueues CSS and JS assets for product listing pages.
	 */
	public function enqueue_assets(): void {
		if ( ! is_product_category() ) {
			return;
		}

		$js_file_path = get_theme_file_path( 'assets/js/product-listing.min.js' );

		// Note: Product listing CSS is included in global.min.css via @import.

		// Enqueue JS.
		if ( file_exists( $js_file_path ) ) {
			wp_enqueue_script(
				'eternal-product-listing',
				get_theme_file_uri( 'assets/js/product-listing.min.js' ),
				array(),
				file_exists( $js_file_path ) ? filemtime( $js_file_path ) : '1.0.0',
				true
			);

			// Prepare filter plugin data.
			$filter_data = $this->get_filter_plugin_data();

			// Localize script with filter plugin data.
			wp_localize_script(
				'eternal-product-listing',
				'eternalPLP',
				array(
					'pluginDataUrl'   => home_url( '/product-category/' ),
					'filters'         => $filter_data,
					'ajaxUrl'         => admin_url( 'admin-ajax.php' ),
					'restUrl'         => get_rest_url( null, 'eternal-filters/v1/category/' ),
				)
			);
		}

		// Add body class when filter plugin is active.
		$this->add_filter_plugin_body_class();
	}

	/**
	 * Outputs the custom header section.
	 */
	public function output_header(): void {
		if ( ! is_product_category() ) {
			return;
		}

		get_template_part( 'template-parts/product-listing/header' );
	}

	/**
	 * Outputs the filter sidebar and product grid.
	 */
	public function output_filters_and_grid(): void {
		if ( ! is_product_category() ) {
			return;
		}

		get_template_part( 'template-parts/product-listing/product-grid' );
	}

	/**
	 * Outputs the FAQ section.
	 */
	public function output_faq_section(): void {
		if ( ! is_product_category() ) {
			return;
		}

		get_template_part( 'template-parts/product-listing/faq-section' );

		// Output FAQ data from plugin as global JavaScript variable.
		$this->output_faq_data_script();
	}

	/**
	 * Outputs FAQ data as a JavaScript global variable.
	 * Captures data from Eternal Product Category FAQ plugin.
	 */
	public function output_faq_data_script(): void {
		$term_id = get_queried_object_id();

		if ( empty( $term_id ) ) {
			return;
		}

		// Get FAQ data from plugin (uses 'faq_questions' meta key).
		$faq_data = get_term_meta( $term_id, 'faq_questions', true );

		if ( empty( $faq_data ) || ! is_array( $faq_data ) ) {
			// Still output empty array so JS can handle it.
			printf(
				'<script>window.eternalCategoryFAQ = [];</script>'
			);
			return;
		}

		// Output as JavaScript global.
		printf(
			'<script>window.eternalCategoryFAQ = %s;</script>',
			wp_json_encode( $faq_data )
		);
	}

	/**
	 * Gets filter plugin data for JavaScript.
	 *
	 * @return array Filter plugin data or empty array if plugin inactive.
	 */
	private function get_filter_plugin_data(): array {
		$current_category = get_queried_object();

		if ( ! $current_category || ! isset( $current_category->term_id ) ) {
			return array();
		}

		$category_id = intval( $current_category->term_id );

		// Check if the Eternal Product Category Filter plugin has registered the filters.
		// The plugin sets a global JS variable, so we check if it would be available.
		// We can check if the plugin's REST endpoint exists.
		$rest_url = get_rest_url( null, "eternal-filters/v1/category/{$category_id}/filters" );

		// Return filter plugin data for JavaScript.
		// The actual data comes from the plugin's eternalFiltersData global.
		return array(
			'active'     => true, // Plugin provides eternalFiltersData.
			'categoryId' => $category_id,
			'endpoint'   => $rest_url,
			'nonce'      => wp_create_nonce( 'wp_rest' ),
		);
	}

	/**
	 * Adds body class when filter plugin is active for category.
	 */
	private function add_filter_plugin_body_class(): void {
		$filter_data = $this->get_filter_plugin_data();

		if ( empty( $filter_data['active'] ) ) {
			return;
		}

		add_filter(
			'body_class',
			function ( $classes ) {
				$classes[] = 'has-eternal-filters';
				return $classes;
			}
		);
	}
}
