const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
import Edit from './edit';

registerBlockType( 'wp-rig/simple-rich-text', {
	apiVersion: 2,
	title: __( 'Simple Rich Text', 'wp-rig' ),
	edit: Edit,
	// Server-side rendered — no client-side save needed.
	save: () => null,
} );
