<?php
/**
 * WP_Rig\WP_Rig\Shop Component
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig\Shop;

use WP_REST_Request;
use WP_REST_Response;
use WP_Query;
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
use function register_rest_route;
use function rest_url;
use function absint;
use function get_permalink;
use function get_post_meta;
use function wp_get_attachment_image_src;
use function wc_placeholder_img_src;
use function wc_get_product;
use function wc_get_product_terms;
use function wp_strip_all_tags;
use function ob_start;
use function ob_get_clean;
use function esc_url;
use function esc_attr;
use function esc_html;
use function sanitize_text_field;

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

	const REST_NAMESPACE    = 'eternal/v1';
	const PRODUCTS_PER_PAGE = 6;

	/**
	 * Adds the action and filter hooks to integrate with WordPress.
	 */
	public function initialize(): void {
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );

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
			'ajaxUrl'          => admin_url( 'admin-ajax.php' ),
			'shopUrl'          => get_permalink( wc_get_page_id( 'shop' ) ),
			'productsEndpoint' => rest_url( self::REST_NAMESPACE . '/shop-products' ),
		);
	}

	/**
	 * Registers the REST API endpoint for load-more pagination.
	 */
	public function register_rest_routes(): void {
		register_rest_route(
			self::REST_NAMESPACE,
			'/shop-products',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'handle_load_more' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'page' => array(
						'required'          => false,
						'type'              => 'integer',
						'default'           => 2,
						'sanitize_callback' => 'absint',
					),
				),
			)
		);
	}

	/**
	 * Handles AJAX load-more requests for the shop grid.
	 *
	 * @param WP_REST_Request $request The REST request.
	 * @return WP_REST_Response
	 */
	public function handle_load_more( WP_REST_Request $request ): WP_REST_Response {
		$page = max( 2, absint( $request->get_param( 'page' ) ) );

		$query = new WP_Query(
			array(
				'post_type'      => 'product',
				'post_status'    => 'publish',
				'posts_per_page' => self::PRODUCTS_PER_PAGE,
				'paged'          => $page,
				'orderby'        => 'menu_order',
				'order'          => 'ASC',
				// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
				'tax_query'      => array(
					array(
						'taxonomy' => 'product_visibility',
						'field'    => 'name',
						'terms'    => array( 'exclude-from-catalog' ),
						'operator' => 'NOT IN',
					),
				),
			)
		);

		if ( ! $query->have_posts() ) {
			return new WP_REST_Response(
				array(
					'html'      => '',
					'has_more'  => false,
					'next_page' => null,
				),
				200
			);
		}

		ob_start();
		$posts    = $query->posts;
		$count    = count( $posts );
		$has_more = $page < $query->max_num_pages;

		for ( $i = 0; $i < $count; $i += 2 ) {
			$pair    = array_slice( $posts, $i, 2 );
			$is_pair = count( $pair ) === 2;

			if ( $is_pair ) {
				echo '<div class="shop-grid__row shop-grid__row--2up">';
			}

			foreach ( $pair as $product_post ) {
				$product = wc_get_product( $product_post->ID );
				if ( ! $product ) {
					continue;
				}
				$this->render_product_card( $product );
			}

			if ( $is_pair ) {
				echo '</div>';
			}
		}

		$html = ob_get_clean();

		return new WP_REST_Response(
			array(
				'html'      => $html,
				'has_more'  => $has_more,
				'next_page' => $has_more ? $page + 1 : null,
			),
			200
		);
	}

	/**
	 * Renders a single product card — mirrors product-grid.php card markup.
	 *
	 * @param \WC_Product $product The WooCommerce product.
	 */
	private function render_product_card( $product ): void {
		$pid       = $product->get_id();
		$permalink = get_permalink( $pid );
		$name      = $product->get_name();

		// Images.
		$main_img_id = $product->get_image_id();
		$main_src    = $main_img_id ? wp_get_attachment_image_src( $main_img_id, 'shop-card' ) : null;
		if ( ! $main_src && $main_img_id ) {
			$main_src = wp_get_attachment_image_src( $main_img_id, 'full' );
		}
		$main_url = $main_src ? $main_src[0] : wc_placeholder_img_src( 'woocommerce_single' );
		$main_alt = $main_img_id ? (string) get_post_meta( $main_img_id, '_wp_attachment_image_alt', true ) : $name;

		$gallery_ids = $product->get_gallery_image_ids();
		$hover_url   = '';
		if ( ! empty( $gallery_ids ) ) {
			$hover_src = wp_get_attachment_image_src( $gallery_ids[0], 'shop-card' );
			if ( ! $hover_src ) {
				$hover_src = wp_get_attachment_image_src( $gallery_ids[0], 'full' );
			}
			$hover_url = $hover_src ? $hover_src[0] : '';
		}

		// Meta — read directly to avoid wp_rig() dependency in REST context.
		$french_text = sanitize_text_field( (string) get_post_meta( $pid, 'product_french_text', true ) );
		$tagline     = sanitize_text_field( (string) get_post_meta( $pid, 'product_caption', true ) );
		if ( ! $tagline ) {
			$tagline = wp_strip_all_tags( $product->get_short_description() );
		}
		$amount     = sanitize_text_field( (string) get_post_meta( $pid, 'product_buy_box_amount', true ) );
		$unit       = sanitize_text_field( (string) get_post_meta( $pid, 'product_buy_box_unit', true ) );
		$size_label = strtoupper( trim( $amount . $unit ) );

		$pills = array();
		if ( $size_label ) {
			$pills[] = $size_label;
		}
		foreach ( $product->get_attributes() as $attribute ) {
			if ( $attribute->is_taxonomy() && ! $attribute->get_variation() ) {
				$terms = wc_get_product_terms( $pid, $attribute->get_name(), array( 'fields' => 'names' ) );
				foreach ( $terms as $term_name ) {
					$pills[] = strtoupper( $term_name );
				}
			}
		}
		$pills = array_unique( $pills );
		?>
		<div class="shop-grid__item shop-grid__item--half">
			<div class="shop-product__img-zone">
				<a class="shop-product__img-link"
					href="<?php echo esc_url( $permalink ); ?>"
					aria-label="<?php echo esc_attr( $name ); ?>"></a>
				<img class="shop-product__img"
					src="<?php echo esc_url( $main_url ); ?>"
					alt="<?php echo esc_attr( $main_alt ? $main_alt : $name ); ?>"
					width="316" height="423"
					loading="lazy" />
				<?php if ( $hover_url ) : ?>
				<img class="shop-product__img shop-product__img--hover"
					src="<?php echo esc_url( $hover_url ); ?>"
					alt="" width="316" height="423"
					loading="lazy" aria-hidden="true" />
				<?php endif; ?>
				<div class="shop-product__atb" data-shop-atb>
					<a class="shop-product__atb-link"
						href="<?php echo esc_url( $product->add_to_cart_url() ); ?>"
						data-product-id="<?php echo esc_attr( $pid ); ?>"
						data-product-type="<?php echo esc_attr( $product->get_type() ); ?>">
						ADD TO BAG
					</a>
				</div>
			</div>
			<div class="shop-product__info">
				<?php if ( ! empty( $pills ) ) : ?>
				<div class="shop-product__pills">
					<?php foreach ( $pills as $pill ) : ?>
					<span class="shop-product__pill"><?php echo esc_html( $pill ); ?></span>
					<?php endforeach; ?>
				</div>
				<?php endif; ?>
				<div class="shop-product__names">
					<a class="shop-product__name-link" href="<?php echo esc_url( $permalink ); ?>">
						<p class="shop-product__name"><?php echo esc_html( strtoupper( $name ) ); ?></p>
						<?php if ( $french_text ) : ?>
						<p class="shop-product__name-fr"><?php echo esc_html( strtoupper( $french_text ) ); ?></p>
						<?php endif; ?>
					</a>
				</div>
				<?php if ( $tagline ) : ?>
				<p class="shop-product__tagline"><?php echo esc_html( $tagline ); ?></p>
				<?php endif; ?>
				<div class="shop-product__price">
					<?php
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo $product->get_price_html();
					?>
				</div>
			</div>
		</div>
		<?php
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
