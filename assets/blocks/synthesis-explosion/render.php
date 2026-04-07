<?php
/**
 * Synthesis Explosion block — frontend render.
 *
 * @package wp_rig
 */

defined( 'ABSPATH' ) || exit;

$attributes = is_array( $attributes ?? null ) ? $attributes : array();

$heading      = $attributes['heading'] ?? '';
$body         = $attributes['body'] ?? '';
$caption      = $attributes['caption'] ?? '';
$marquee_text = $attributes['marqueeText'] ?? '';
$media_id     = isset( $attributes['mediaId'] ) ? (int) $attributes['mediaId'] : 0;
$media_url    = $attributes['mediaUrl'] ?? '';
$media_alt    = $attributes['mediaAlt'] ?? '';

// Build marquee items from comma-separated string.
$marquee_items = array();
if ( $marquee_text ) {
	$raw_items = explode( ',', $marquee_text );
	foreach ( $raw_items as $item ) {
		$trimmed = trim( $item );
		if ( '' !== $trimmed ) {
			$marquee_items[] = esc_html( $trimmed );
		}
	}
}

// Resolve image URL from media ID if available.
if ( $media_id && ! $media_url ) {
	$fetched_url = wp_get_attachment_url( $media_id );
	$media_url   = $fetched_url ? $fetched_url : '';
}
if ( $media_id && ! $media_alt ) {
	$fetched_alt = get_post_meta( $media_id, '_wp_attachment_image_alt', true );
	$media_alt   = $fetched_alt ? $fetched_alt : '';
}

if ( ! $heading && ! $body && ! $media_url ) {
	return;
}
?>
<section class="synthesis-explosion alignfull">

	<div class="synthesis-explosion__content">
		<?php if ( $heading ) : ?>
			<h2 class="synthesis-explosion__heading"><?php echo esc_html( $heading ); ?></h2>
		<?php endif; ?>

		<?php if ( $body ) : ?>
			<p class="synthesis-explosion__body"><?php echo wp_kses_post( nl2br( esc_html( $body ) ) ); ?></p>
		<?php endif; ?>

		<?php if ( $caption ) : ?>
			<p class="synthesis-explosion__caption"><?php echo wp_kses_post( nl2br( esc_html( $caption ) ) ); ?></p>
		<?php endif; ?>
	</div>

	<?php if ( $media_url ) : ?>
		<div class="synthesis-explosion__image-wrap">
			<img
				class="synthesis-explosion__image"
				src="<?php echo esc_url( $media_url ); ?>"
				alt="<?php echo esc_attr( $media_alt ); ?>"
				loading="lazy"
			/>

			<?php if ( ! empty( $marquee_items ) ) : ?>
				<div class="synthesis-explosion__marquee" aria-hidden="true">
					<div class="synthesis-explosion__marquee-track">
						<?php
						// Render items twice to create the seamless loop.
						for ( $pass = 0; $pass < 2; $pass++ ) :
							foreach ( $marquee_items as $item ) :
								?>
								<span class="synthesis-explosion__marquee-item">
									<?php echo esc_html( $item ); ?>
								</span>
								<span class="synthesis-explosion__marquee-sep" aria-hidden="true">·</span>
								<?php
							endforeach;
						endfor;
						?>
					</div>
				</div>
			<?php endif; ?>
		</div>
	<?php endif; ?>

</section>
