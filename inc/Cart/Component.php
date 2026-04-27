<?php
/**
 * WP_Rig\WP_Rig\Cart\Component class
 *
 * Handles the empty-cart state: replaces the default WooCommerce product-new
 * grid with the theme's related-products card section, and enqueues the
 * cart-specific JS for visibility control.
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig\Cart;

use WP_Rig\WP_Rig\Component_Interface;
use function add_action;
use function add_filter;
use function is_cart;
use function wp_enqueue_script;
use function get_theme_file_uri;
use function get_theme_file_path;
use function get_template_part;
use function file_exists;
use function filemtime;
use function function_exists;
use function ob_start;
use function ob_get_clean;

/**
 * Class for the Cart component.
 */
class Component implements Component_Interface {

	/**
	 * Gets the unique identifier for the theme component.
	 *
	 * @return string Component slug.
	 */
	public function get_slug(): string {
		return 'cart';
	}

	/**
	 * Adds action and filter hooks.
	 */
	public function initialize(): void {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_filter( 'eternal_related_products_load_script', array( $this, 'load_related_products_script_on_cart' ) );
		add_filter( 'render_block_woocommerce/empty-cart-block', array( $this, 'replace_empty_cart_product_grid' ), 10, 1 );
	}

	/**
	 * Tells the Related Products component to enqueue its slider JS on the cart
	 * page, since the empty-cart state renders the related-products template.
	 *
	 * @param bool $should_load Current load decision.
	 * @return bool
	 */
	public function load_related_products_script_on_cart( bool $should_load ): bool {
		return $should_load || is_cart();
	}

	/**
	 * Enqueues the cart JS on the cart page.
	 */
	public function enqueue_assets(): void {
		if ( ! is_cart() ) {
			return;
		}

		$js_path = get_theme_file_path( '/assets/js/cart.min.js' );
		$js_uri  = get_theme_file_uri( '/assets/js/cart.min.js' );

		if ( ! file_exists( $js_path ) ) {
			return;
		}

		wp_enqueue_script(
			'eternal-cart',
			$js_uri,
			array(),
			(string) filemtime( $js_path ),
			true
		);
	}

	/**
	 * Replaces the default WooCommerce product-new grid inside the empty-cart
	 * block with the theme's related-products card section.
	 *
	 * WooCommerce's block rendering pipeline applies wp_kses somewhere in the
	 * chain, which strips HTML comment delimiters (<!-- -->) but leaves the
	 * inner text as visible text nodes. We strip all comments from the template
	 * output before returning to avoid this.
	 *
	 * @param string $block_content Rendered block HTML.
	 * @return string Modified block HTML.
	 */
	public function replace_empty_cart_product_grid( string $block_content ): string {
		if ( ! function_exists( 'wc_get_products' ) ) {
			return $block_content;
		}

		// Strip the wc-block-grid div and everything after it up to (and including)
		// the wrapper's closing </div>, then re-close the wrapper.
		$stripped = preg_replace(
			'#<div[^>]+class="[^"]*wc-block-grid[^"]*"[^>]*>.*</div></div>\s*$#s',
			'</div>',
			$block_content
		);

		if ( null === $stripped || $stripped === $block_content ) {
			return $block_content;
		}

		ob_start();
		get_template_part(
			'template-parts/product/part-related-products',
			null,
			array(
				'heading' => 'New In Store',
				'limit'   => 6,
				'context' => 'general',
			)
		);
		$related_html = (string) ob_get_clean();

		// Strip HTML comments before returning — see docblock above.
		$related_html = (string) preg_replace( '/<!--.*?-->/s', '', $related_html );

		return $stripped . $related_html;
	}
}
