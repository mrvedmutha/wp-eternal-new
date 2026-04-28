<?php
/**
 * WP_Rig\WP_Rig\Blog_Posts_Grid\Component class
 *
 * Registers the blog-card-thumb image size, enqueues the blog-posts-grid
 * JS on blog and category archive pages, and handles the AJAX endpoint
 * that powers tab filtering and pagination.
 *
 * @package wp_rig
 *
 * @js-file assets/js/src/blog-posts-grid.ts  AJAX tab + pagination handler
 */

namespace WP_Rig\WP_Rig\Blog_Posts_Grid;

use WP_Rig\WP_Rig\Component_Interface;
use WP_Query;
use function add_action;
use function add_image_size;
use function is_home;
use function is_category;
use function wp_enqueue_script;
use function wp_localize_script;
use function wp_create_nonce;
use function wp_send_json_success;
use function wp_send_json_error;
use function check_ajax_referer;
use function sanitize_text_field;
use function absint;
use function admin_url;
use function get_theme_file_uri;
use function get_theme_file_path;
use function get_template_part;
use function ob_start;
use function ob_get_clean;
use function wp_reset_postdata;
use function esc_html__;
use function file_exists;
use function filemtime;

/**
 * Class for Blog Posts Grid component.
 */
class Component implements Component_Interface {

	/**
	 * Gets the unique identifier for the theme component.
	 *
	 * @return string Component slug.
	 */
	public function get_slug(): string {
		return 'blog-posts-grid';
	}

	/**
	 * Adds the action and filter hooks to integrate with WordPress.
	 */
	public function initialize(): void {
		add_action( 'init', array( $this, 'register_image_size' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'wp_ajax_wp_rig_blog_posts', array( $this, 'ajax_get_blog_posts' ) );
		add_action( 'wp_ajax_nopriv_wp_rig_blog_posts', array( $this, 'ajax_get_blog_posts' ) );
	}

	/**
	 * Registers the blog card thumbnail image size.
	 */
	public function register_image_size(): void {
		add_image_size( 'blog-card-thumb', 200, 276, true );
	}

	/**
	 * Enqueues blog-posts-grid JS on blog home and category archive pages.
	 */
	public function enqueue_assets(): void {
		if ( ! is_home() && ! is_category() ) {
			return;
		}

		$js_path = get_theme_file_path( '/assets/js/blog-posts-grid.min.js' );
		$js_uri  = get_theme_file_uri( '/assets/js/blog-posts-grid.min.js' );

		if ( ! file_exists( $js_path ) ) {
			return;
		}

		wp_enqueue_script(
			'wp-rig-blog-posts-grid',
			$js_uri,
			array(),
			(string) filemtime( $js_path ),
			true
		);

		wp_localize_script(
			'wp-rig-blog-posts-grid',
			'wpRigBlog',
			array(
				'ajaxUrl'      => admin_url( 'admin-ajax.php' ),
				'nonce'        => wp_create_nonce( 'wp_rig_blog_posts' ),
				'blogUrl'      => get_permalink( (int) get_option( 'page_for_posts' ) ),
				'isHome'       => is_home() ? '1' : '0',
				'isCategory'   => is_category() ? '1' : '0',
			)
		);
	}

	/**
	 * AJAX handler: returns cards HTML + pagination HTML for a given category + page.
	 */
	public function ajax_get_blog_posts(): void {
		check_ajax_referer( 'wp_rig_blog_posts', 'nonce' );

		$category       = sanitize_text_field( wp_unslash( $_POST['category'] ?? '' ) );
		$paged          = max( 1, absint( $_POST['paged'] ?? 1 ) );
		$posts_per_page = max( 1, absint( $_POST['posts_per_page'] ?? 12 ) );

		$query_args = array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'posts_per_page' => $posts_per_page,
			'paged'          => $paged,
			'orderby'        => 'date',
			'order'          => 'DESC',
		);

		if ( ! empty( $category ) ) {
			$query_args['category_name'] = $category;
		}

		$query = new WP_Query( $query_args );

		// Cards HTML.
		ob_start();
		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				get_template_part( 'template-parts/content/blog-card' );
			}
			wp_reset_postdata();
		} else {
			echo '<p class="blog-posts-grid__no-results">' . esc_html__( 'No posts found.', 'wp-rig' ) . '</p>';
		}
		$cards_html = ob_get_clean();

		// Pagination HTML.
		$pagination_html = $this->render_pagination( $paged, (int) $query->max_num_pages );

		wp_send_json_success(
			array(
				'cardsHtml'      => $cards_html,
				'paginationHtml' => $pagination_html,
				'maxPages'       => (int) $query->max_num_pages,
				'currentPage'    => $paged,
			)
		);
	}

	/**
	 * Renders the blog pagination markup for a given page + total pages.
	 *
	 * @param int $current   Current page number.
	 * @param int $max_pages Total number of pages.
	 * @return string HTML string.
	 */
	public static function render_pagination( int $current, int $max_pages ): string {
		if ( $max_pages <= 1 ) {
			return '';
		}

		ob_start();
		?>
		<nav class="blog-pagination" aria-label="<?php esc_attr_e( 'Blog pagination', 'wp-rig' ); ?>">
			<?php
			// Build page range: always show first 3, last 1, and current ±1.
			$pages = self::get_page_range( $current, $max_pages );
			$prev  = $current - 1;

			foreach ( $pages as $page ) {
				if ( 'ellipsis' === $page ) {
					echo '<span class="blog-pagination__ellipsis" aria-hidden="true">....</span>';
					continue;
				}

				$is_active = ( (int) $page === $current );
				printf(
					'<button class="blog-pagination__page%s" data-page="%d" aria-label="%s" aria-current="%s">%d</button>',
					$is_active ? ' is-active' : '',
					(int) $page,
					/* translators: %d: page number */
					esc_attr( sprintf( __( 'Page %d', 'wp-rig' ), (int) $page ) ),
					$is_active ? 'page' : 'false',
					(int) $page
				);
			}

			if ( $current < $max_pages ) {
				printf(
					'<button class="blog-pagination__next" data-page="%d" aria-label="%s">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
							<path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>',
					absint( $current + 1 ),
					esc_attr__( 'Next page', 'wp-rig' )
				);
			}
			?>
		</nav>
		<?php
		return ob_get_clean();
	}

	/**
	 * Returns an array of page numbers + 'ellipsis' markers to display.
	 *
	 * @param int $current   Current page.
	 * @param int $max_pages Total pages.
	 * @return array<int|string>
	 */
	private static function get_page_range( int $current, int $max_pages ): array {
		if ( $max_pages <= 7 ) {
			return range( 1, $max_pages );
		}

		$pages = array();

		// Always include 1, 2, 3.
		$always_show = array_unique( array_filter( array( 1, 2, 3, $current - 1, $current, $current + 1, $max_pages ) ) );
		sort( $always_show );

		$prev = null;
		foreach ( $always_show as $page ) {
			if ( $page < 1 || $page > $max_pages ) {
				continue;
			}
			if ( null !== $prev && $page - $prev > 1 ) {
				$pages[] = 'ellipsis';
			}
			$pages[] = $page;
			$prev    = $page;
		}

		return $pages;
	}
}
