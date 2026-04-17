<?php
/**
 * Shop FAQ Accordion Section
 *
 * Consumes aggregated FAQ data from all product categories.
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<section class="shop-faq" data-node-id="694-1898">
	<div class="shop-faq__inner">
		<div class="shop-faq__header">
			<h2 class="shop-faq__title"><?php esc_html_e( "FAQ'S", 'wp-rig' ); ?></h2>
		</div>

		<div class="shop-faq__accordion">
			<!-- FAQ items rendered via JavaScript from aggregated data -->
			<div id="shop-faq-container">
				<noscript><?php esc_html_e( 'FAQs require JavaScript to display.', 'wp-rig' ); ?></noscript>
			</div>
		</div>
	</div>
</section><!-- .shop-faq -->
