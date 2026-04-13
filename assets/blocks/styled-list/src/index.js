// Use WP globals
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const { registerBlockType } = (wp).blocks;
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const { __ } = (wp).i18n;
import Edit from './edit';
import { InnerBlocks } from '@wordpress/block-editor';

registerBlockType('wp-rig/styled-list', {
	apiVersion: 2,
	title: __('Styled List', 'wp-rig'),
	edit: Edit,
	save({ attributes }) {
		return (
		<div className="styled-list">
			<ul className="styled-list__items">
				<InnerBlocks.Content />
			</ul>
		</div>
	);
	},
});
