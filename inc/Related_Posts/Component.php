<?php
/**
 * WP_Rig\WP_Rig\Related_Posts\Component class
 *
 * Handles the AJAX endpoint for the related-posts block. The frontend JS is
 * loaded automatically by WordPress via the block's viewScript declaration —
 * no manual enqueue needed.
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig\Related_Posts;

use WP_Rig\WP_Rig\Component_Interface;
use WP_Query;
use function add_action;
use function is_single;
use function wp_enqueue_script;
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
	 * Enqueues the TOC script on single post pages.
	 * The related-posts view script is handled by block.json viewScript.
	 */
	public function enqueue_assets(): void {
		if ( ! is_single() ) {
			return;
		}

		$js_dir   = get_theme_file_path( 'assets/js' );
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
	}

	/**
	 * AJAX handler — returns posts based on mode.
	 *
	 * Mode "related" returns posts from the same categories, falling back to
	 * latest if fewer results than requested. Mode "latest" returns the most
	 * recent published posts ordered by date.
	 *
	 * Expected POST params: nonce, post_id, term_ids (comma-separated), count, mode.
	 */
	public function ajax_get_related_posts(): void {
		check_ajax_referer( 'wp_rig_related_posts', 'nonce' );

		$current_id = absint( wp_unslash( $_POST['post_id'] ?? 0 ) );
		$raw_ids    = sanitize_text_field( wp_unslash( $_POST['term_ids'] ?? '' ) );
		$count      = absint( wp_unslash( $_POST['count'] ?? 3 ) );
		$count      = max( 1, min( 6, $count ) );
		$mode       = sanitize_text_field( wp_unslash( $_POST['mode'] ?? 'latest' ) );

		$term_ids = array_filter(
			array_map( 'absint', explode( ',', $raw_ids ) )
		);

		$posts = array();

		if ( 'related' === $mode && ! empty( $term_ids ) ) {
			$posts = $this->query_posts(
				array(
					'post_status'         => 'publish',
					'posts_per_page'      => $count,
					'orderby'             => 'rand',
					'ignore_sticky_posts' => true,
					'post__not_in'        => $current_id ? array( $current_id ) : array(),
					'category__in'        => array_values( $term_ids ),
				)
			);

			// Fill remaining slots with latest posts if not enough category matches.
			if ( count( $posts ) < $count ) {
				$remaining   = $count - count( $posts );
				$exclude_ids = array_merge(
					$current_id ? array( $current_id ) : array(),
					array_column( $posts, 'id' )
				);

				$latest = $this->query_posts(
					array(
						'post_status'         => 'publish',
						'posts_per_page'      => $remaining,
						'orderby'             => 'date',
						'order'               => 'DESC',
						'ignore_sticky_posts' => true,
						'post__not_in'        => $exclude_ids,
					)
				);

				$posts = array_merge( $posts, $latest );
			}
		} else {
			// Latest mode: homepage, pages, archives, etc.
			$exclude = $current_id ? array( $current_id ) : array();

			$posts = $this->query_posts(
				array(
					'post_status'         => 'publish',
					'posts_per_page'      => $count,
					'orderby'             => 'date',
					'order'               => 'DESC',
					'ignore_sticky_posts' => true,
					'post__not_in'        => $exclude,
				)
			);
		}

		wp_send_json_success( array( 'posts' => $posts ) );
	}

	/**
	 * Runs a WP_Query and maps posts to the response shape.
	 *
	 * @param array<string,mixed> $args WP_Query args (post_type and post_status defaults applied).
	 * @return array<int,array<string,mixed>>
	 */
	private function query_posts( array $args ): array {
		$args['post_type'] = 'post';

		$query  = new WP_Query( $args );
		$result = array();

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

				$result[] = array(
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

		return $result;
	}
}
