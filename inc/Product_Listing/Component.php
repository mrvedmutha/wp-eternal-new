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

		$css_file_path = get_theme_file_path( 'assets/css/product-listing.min.css' );
		$js_file_path  = get_theme_file_path( 'assets/js/product-listing.min.js' );

		// Enqueue CSS.
		if ( file_exists( $css_file_path ) ) {
			wp_enqueue_style(
				'eternal-product-listing',
				get_theme_file_uri( 'assets/css/product-listing.min.css' ),
				array(),
				file_exists( $css_file_path ) ? filemtime( $css_file_path ) : '1.0.0'
			);
		}

		// Enqueue JS.
		if ( file_exists( $js_file_path ) ) {
			wp_enqueue_script(
				'eternal-product-listing',
				get_theme_file_uri( 'assets/js/product-listing.min.js' ),
				array(),
				file_exists( $js_file_path ) ? filemtime( $js_file_path ) : '1.0.0',
				true
			);

			// Localize script for plugin integration.
			wp_localize_script(
				'eternal-product-listing',
				'eternalPLP',
				array(
					'pluginDataUrl' => home_url( '/product-category/' ),
				)
			);
		}
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
}
