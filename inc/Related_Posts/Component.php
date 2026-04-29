<?php
/**
 * WP_Rig\WP_Rig\Related_Posts\Component class
 *
 * Handles the AJAX endpoint for the related-posts block and enqueues
 * the related-posts.js + single-toc.js scripts on single post pages.
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig\Related_Posts;

use WP_Rig\WP_Rig\Component_Interface;
use WP_Query;
use function add_action;
use function is_single;
use function wp_enqueue_script;
use function wp_localize_script;
use function wp_create_nonce;
use function wp_send_json_success;
use function wp_send_json_error;
use function check_ajax_referer;
use function sanitize_text_field;
use function wp_unslash;
use function absint;
use function admin_url;
use function get_theme_file_uri;
use function get_theme_file_path;
use function get_the_category;
use function get_the_permalink;
use function get_the_title;
use function get_the_date;
use function get_the_ID;
use function wp_get_attachment_image_url;
use function get_post_thumbnail_id;
use function wp_reset_postdata;
use function file_exists;
use function filemtime;
use function esc_url;

/**
 * Class for Related Posts component.
 */
class Component implements Component_Interface {

	/**
	 * Gets the unique identifier for the theme component.
	 *
	 * @return string Component slug.
	 */
	public function get_slug(): string {
		return 'related-posts';
	}

	/**
	 * Adds the action and filter hooks to integrate with WordPress.
	 */
	public function initialize(): void {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'wp_ajax_wp_rig_related_posts', array( $this, 'ajax_get_related_posts' ) );
		add_action( 'wp_ajax_nopriv_wp_rig_related_posts', array( $this, 'ajax_get_related_posts' ) );
	}

	/**
	 * Enqueues the TOC and related-posts JS on single post pages.
	 */
	public function enqueue_assets(): void {
		if ( ! is_single() ) {
			return;
		}

		$js_dir = get_theme_file_path( 'assets/js' );

		$toc_src  = get_theme_file_uri( 'assets/js/single-toc.min.js' );
		$toc_path = $js_dir . '/single-toc.min.js';
		if ( file_exists( $toc_path ) ) {
			wp_enqueue_script(
				'wp-rig-single-toc',
				$toc_src,
				array(),
				(string) filemtime( $toc_path ),
				true
			);
		}

		$rp_src  = get_theme_file_uri( 'assets/js/related-posts.min.js' );
		$rp_path = $js_dir . '/related-posts.min.js';
		if ( file_exists( $rp_path ) ) {
			wp_enqueue_script(
				'wp-rig-related-posts',
				$rp_src,
				array(),
				(string) filemtime( $rp_path ),
				true
			);
			wp_localize_script(
				'wp-rig-related-posts',
				'wpRigRelatedPosts',
				array(
					'ajaxUrl' => esc_url( admin_url( 'admin-ajax.php' ) ),
					'nonce'   => wp_create_nonce( 'wp_rig_related_posts' ),
				)
			);
		}
	}

	/**
	 * AJAX handler — returns 3 random posts from the same categories.
	 *
	 * Expected POST params: nonce, post_id, term_ids (comma-separated), count.
	 */
	public function ajax_get_related_posts(): void {
		check_ajax_referer( 'wp_rig_related_posts', 'nonce' );

		$current_id = absint( wp_unslash( $_POST['post_id'] ?? 0 ) );
		$raw_ids    = sanitize_text_field( wp_unslash( $_POST['term_ids'] ?? '' ) );
		$count      = absint( wp_unslash( $_POST['count'] ?? 3 ) );
		$count      = max( 1, min( 6, $count ) );

		$term_ids = array_filter(
			array_map( 'absint', explode( ',', $raw_ids ) )
		);

		$query_args = array(
			'post_type'           => 'post',
			'post_status'         => 'publish',
			'posts_per_page'      => $count,
			'orderby'             => 'rand',
			'ignore_sticky_posts' => true,
		);

		if ( $current_id ) {
			$query_args['post__not_in'] = array( $current_id );
		}

		if ( ! empty( $term_ids ) ) {
			$query_args['category__in'] = array_values( $term_ids );
		}

		$query = new WP_Query( $query_args );
		$posts = array();

		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();

				$thumb_url = '';
				$thumb_id  = (int) get_post_thumbnail_id();
				if ( $thumb_id ) {
					$sized_url = wp_get_attachment_image_url( $thumb_id, 'blog-card-thumb' );
					if ( ! $sized_url ) {
						$sized_url = wp_get_attachment_image_url( $thumb_id, 'medium' );
					}
					if ( $sized_url ) {
						$thumb_url = $sized_url;
					}
				}

				$categories  = get_the_category();
				$primary_cat = ! empty( $categories ) ? $categories[0]->name : '';

				$posts[] = array(
					'id'       => (int) get_the_ID(),
					'title'    => get_the_title(),
					'url'      => get_the_permalink(),
					'date'     => get_the_date( 'd.m.Y' ),
					'dateISO'  => get_the_date( 'c' ),
					'category' => $primary_cat,
					'thumb'    => $thumb_url,
				);
			}
			wp_reset_postdata();
		}

		wp_send_json_success( array( 'posts' => $posts ) );
	}
}
