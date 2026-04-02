<?php
/**
 * Deploy cache-purge hook.
 * Called automatically after each FTP deploy to flush LiteSpeed cache.
 * Protected by a secret key — do not remove.
 */
if ( empty( $_GET['key'] ) || $_GET['key'] !== 'eternal_purge_2026' ) {
	http_response_code( 403 );
	exit;
}

// Tell LiteSpeed to purge its entire cache (memory + disk).
header( 'X-LiteSpeed-Purge: *' );
header( 'Content-Type: text/plain' );
echo 'Cache purged.';
