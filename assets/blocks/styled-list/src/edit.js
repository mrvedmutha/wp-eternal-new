import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = ['core/list-item'];

const TEMPLATE = [
	['core/list-item', { content: 'First list item with custom bullet style' }],
	['core/list-item', { content: 'Second list item with custom bullet style' }],
	['core/list-item', { content: 'Third list item with custom bullet style' }],
];

export default function Edit(props) {
	const blockProps = useBlockProps({
		className: 'styled-list-editor',
	});

	return (
		<div {...blockProps}>
			<ul className="styled-list__items">
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					template={TEMPLATE}
					templateLock={false}
					orientation="vertical"
				/>
			</ul>
		</div>
	);
}
