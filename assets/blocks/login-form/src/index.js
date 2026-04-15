/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import metadata from '../block.json';
import edit from './edit';

const { name } = metadata;

registerBlockType( name, {
	...metadata,
	edit,
	save: () => null, // Render callback handles output.
} );
