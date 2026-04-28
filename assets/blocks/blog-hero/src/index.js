const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
import Edit from './edit';

registerBlockType( 'wp-rig/blog-hero', {
	apiVersion: 2,
	title: __( 'Blog Hero', 'wp-rig' ),
	edit: Edit,
	save() {
		return null;
	},
} );
