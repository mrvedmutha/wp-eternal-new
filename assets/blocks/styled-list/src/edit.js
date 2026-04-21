import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { items } = attributes;
	const blockProps = useBlockProps( { className: 'styled-list-editor' } );

	const updateItem = ( index, content ) => {
		const next = items.map( ( item, i ) =>
			i === index ? { ...item, content } : item
		);
		setAttributes( { items: next } );
	};

	const addItem = () => {
		setAttributes( { items: [ ...items, { content: '' } ] } );
	};

	const removeItem = ( index ) => {
		setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );
	};

	return (
		<div { ...blockProps }>
			<ul className="styled-list__items">
				{ items.map( ( item, index ) => (
					<li key={ index } className="styled-list__item">
						<RichText
							tagName="span"
							value={ item.content }
							onChange={ ( content ) => updateItem( index, content ) }
							placeholder={ __( 'List item…', 'wp-rig' ) }
							allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
						/>
						<Button
							className="styled-list__remove-btn"
							icon="no-alt"
							label={ __( 'Remove item', 'wp-rig' ) }
							size="small"
							isDestructive
							onClick={ () => removeItem( index ) }
						/>
					</li>
				) ) }
			</ul>
			<Button
				variant="secondary"
				onClick={ addItem }
				style={ { marginTop: '12px' } }
			>
				{ __( '+ Add Item', 'wp-rig' ) }
			</Button>
		</div>
	);
}
