<?php
/**
 * WP_Rig\WP_Rig\Shop Component
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig\Shop;

use WP_Rig\WP_Rig\Component_Interface;
use function add_action;
use function add_filter;
use function is_shop;
use function get_theme_file_path;
use function get_theme_file_uri;
use function filemtime;
use function wp_enqueue_style;
use function wp_enqueue_script;
use function wp_localize_script;
use function get_template_part;
use function get_terms;
use function get_term_meta;
use function get_option;

/**
 * Class for Shop component.
 */
class Component implements Component_Interface {

	/**
	 * Gets the unique identifier for the theme component.
	 *
	 * @return string Component slug.
	 */
	public function get_slug(): string {
		return 'shop';
	}

	/**
	 * Adds the action and filter hooks to integrate with WordPress.
	 */
	public function initialize(): void {
		// Only apply to shop page.
		add_action( 'template_redirect', array( $this, 'remove_woocommerce_defaults' ) );

		// Enqueue assets.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		// Output custom header.
		remove_action( 'woocommerce_archive_description', 'woocommerce_taxonomy_archive_description', 10 );
		remove_action( 'woocommerce_archive_description', 'woocommerce_product_archive_description', 10 );
		add_action( 'woocommerce_archive_description', array( $this, 'output_header' ), 10 );

		// Output product grid with mixed layout.
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_result_count', 20 );
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30 );
		remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
		remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );
		remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
		remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );
		add_action( 'woocommerce_before_shop_loop', array( $this, 'output_filters_and_grid' ), 10 );

		// Output FAQ data script.
		add_action( 'wp_footer', array( $this, 'output_faq_data_script' ), 10 );

		// Hide WooCommerce breadcrumb on shop page.
		add_filter( 'woocommerce_get_breadcrumb', array( $this, 'hide_breadcrumb' ), 10, 1 );

		// Add custom wrappers for shop page.
		add_action( 'woocommerce_before_main_content', array( $this, 'output_wrapper_start' ), 5 );
		add_action( 'woocommerce_after_main_content', array( $this, 'output_wrapper_end' ), 5 );
	}

	/**
	 * Enqueues CSS and JS assets for shop page.
	 */
	public function enqueue_assets(): void {
		if ( ! is_shop() ) {
			return;
		}

		$css_file_path = get_theme_file_path( 'assets/css/shop.min.css' );
		$js_file_path  = get_theme_file_path( 'assets/js/shop.min.js' );

		// Enqueue CSS.
		if ( file_exists( $css_file_path ) ) {
			wp_enqueue_style(
				'eternal-shop',
				get_theme_file_uri( 'assets/css/shop.min.css' ),
				array(),
				file_exists( $css_file_path ) ? filemtime( $css_file_path ) : '1.0.0'
			);
		}

		// Enqueue JS.
		if ( file_exists( $js_file_path ) ) {
			wp_enqueue_script(
				'eternal-shop',
				get_theme_file_uri( 'assets/js/shop.min.js' ),
				array(),
				file_exists( $js_file_path ) ? filemtime( $js_file_path ) : '1.0.0',
				true
			);

			// Prepare shop-specific data.
			$shop_data = $this->get_shop_data();

			// Localize script.
			wp_localize_script(
				'eternal-shop',
				'eternalShop',
				$shop_data
			);
		}
	}

	/**
	 * Outputs the custom header section.
	 */
	public function output_header(): void {
		if ( ! is_shop() ) {
			return;
		}

		get_template_part( 'template-parts/shop/header' );
	}

	/**
	 * Outputs the filter sidebar and product grid.
	 */
	public function output_filters_and_grid(): void {
		if ( ! is_shop() ) {
			return;
		}

		get_template_part( 'template-parts/shop/product-grid' );
	}

	/**
	 * Outputs opening wrapper for shop content.
	 */
	public function output_wrapper_start(): void {
		if ( ! is_shop() ) {
			return;
		}
		?>
		<main class="site-main" role="main">
		<?php
	}

	/**
	 * Outputs closing wrapper for shop content.
	 */
	public function output_wrapper_end(): void {
		if ( ! is_shop() ) {
			return;
		}
		?>
		</main><!-- .site-main -->
		<?php
	}

	/**
	 * Outputs FAQ data as a JavaScript global variable.
	 * Aggregates FAQs from all product categories.
	 */
	public function output_faq_data_script(): void {
		if ( ! is_shop() ) {
			return;
		}

		// Get aggregated FAQ data from all categories.
		$faq_data = $this->get_aggregated_faqs();

		if ( empty( $faq_data ) || ! is_array( $faq_data ) ) {
			printf( '<script>window.eternalShopFAQ = [];</script>' );
			return;
		}

		// Output as JavaScript global.
		printf(
			'<script>window.eternalShopFAQ = %s;</script>',
			wp_json_encode( $faq_data )
		);
	}

	/**
	 * Removes WooCommerce default elements from shop page.
	 */
	public function remove_woocommerce_defaults(): void {
		if ( ! is_shop() ) {
			return;
		}

		// Remove default product loop.
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_output_product_categories', 10 );
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_output_related_products', 20 );
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_output_products', 30 );
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_output_page_title', 10 );

		// Remove default sidebar.
		remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );

		// Remove all hooks from woocommerce_after_shop_loop.
		remove_all_actions( 'woocommerce_after_shop_loop' );

		// Remove default pagination.
		remove_action( 'woocommerce_after_shop_loop', 'woocommerce_pagination', 10 );
	}

	/**
	 * Hides breadcrumb on shop page.
	 *
	 * @param array $breadcrumb Breadcrumb items.
	 * @return array Empty array on shop page, otherwise original breadcrumb.
	 */
	public function hide_breadcrumb( array $breadcrumb ): array {
		if ( is_shop() ) {
			return array();
		}
		return $breadcrumb;
	}

	/**
	 * Gets shop-specific data for JavaScript.
	 *
	 * @return array Shop data for JavaScript localization.
	 */
	private function get_shop_data(): array {
		return array(
			'ajaxUrl'       => admin_url( 'admin-ajax.php' ),
			'shopUrl'       => get_permalink( wc_get_page_id( 'shop' ) ),
		);
	}

	/**
	 * Gets aggregated FAQ data from all product categories.
	 *
	 * @return array Aggregated FAQ data from all categories.
	 */
	private function get_aggregated_faqs(): array {
		$categories = get_terms(
			array(
				'taxonomy'   => 'product_cat',
				'hide_empty' => false,
				'exclude'    => array( get_option( 'default_product_cat' ) ),
			)
		);

		if ( empty( $categories ) || is_wp_error( $categories ) ) {
			return array();
		}

		$all_faqs = array();

		foreach ( $categories as $category ) {
			$cat_faqs = get_term_meta( $category->term_id, 'faq_questions', true );

			if ( empty( $cat_faqs ) || ! is_array( $cat_faqs ) ) {
				continue;
			}

			// Add category context to each FAQ.
			foreach ( $cat_faqs as $faq ) {
				$faq['category'] = $category->name;
				$all_faqs[]      = $faq;
			}
		}

		return $all_faqs;
	}
}
