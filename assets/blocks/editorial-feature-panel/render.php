<?php
/**
 * Editorial Feature Panel block — frontend render.
 *
 * Passes block attributes into the shared pdp-feature template part.
 *
 * @package wp_rig
 */

defined( 'ABSPATH' ) || exit;

$attributes = is_array( $attributes ?? null ) ? $attributes : array();

?>
<div class="pdp-features">
<?php
get_template_part(
	'template-parts/product/part-pdp',
	'feature',
	array(
		'image_id'  => isset( $attributes['mediaId'] ) ? (int) $attributes['mediaId'] : 0,
		'image_url' => $attributes['mediaUrl'] ?? '',
		'heading'   => $attributes['heading'] ?? '',
		'body'      => $attributes['body'] ?? '',
		'hashtag'   => $attributes['hashtag'] ?? '',
		'cta_label' => $attributes['ctaLabel'] ?? '',
		'cta_url'   => $attributes['ctaUrl'] ?? '',
	)
);
?>
</div>
