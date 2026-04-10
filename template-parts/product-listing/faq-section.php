<?php
/**
 * FAQ Accordion Section
 *
 * Consumes FAQ data from Eternal Product Category FAQ plugin.
 * Plugin outputs data to: window.eternalCategoryFAQ
 *
 * @package wp_rig
 */

// Only show on product category pages.
if ( ! is_product_category() ) {
	return;
}
?>

<section class="plp-faq" data-node-id="694-1898">
	<div class="plp-faq__inner">
		<div class="plp-faq__header">
			<h2 class="plp-faq__title"><?php esc_html_e( "FAQ'S", 'wp-rig' ); ?></h2>
		</div>

		<div class="plp-faq__accordion">
			<!-- FAQ items rendered via JavaScript from plugin data -->
			<div id="plp-faq-container">
				<noscript><?php esc_html_e( 'FAQs require JavaScript to display.', 'wp-rig' ); ?></noscript>
			</div>
		</div>
	</div>
</section><!-- .plp-faq -->
