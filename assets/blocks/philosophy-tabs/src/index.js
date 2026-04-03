const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
import Edit from './edit';

registerBlockType( 'wp-rig/philosophy-tabs', {
	apiVersion: 2,
	title: __( 'Philosophy Tabs', 'wp-rig' ),
	edit: Edit,
	// Server-side rendered — no client-side save needed.
	save: () => null,
} );
