const { __ } = wp.i18n;
const { InspectorControls, useBlockProps, MediaUpload } = wp.blockEditor;
const { PanelBody, Button, TextControl, TextareaControl, Notice } = wp.components;
const { useState } = wp.element;

const MAX_ITEMS = 10;

function makeItem() {
	return { title: '', body: '' };
}

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps( { className: 'pfa-editor' } );
	const { eyebrow, imageId, imageUrl, imageAlt, items } = attributes;
	const [ active, setActive ] = useState( 0 );

	const currentItem = items[ active ] ?? makeItem();
	const safeActive  = Math.min( active, items.length - 1 );

	function updateItem( index, patch ) {
		const next = items.map( ( it, i ) => ( i === index ? { ...it, ...patch } : it ) );
		setAttributes( { items: next } );
	}

	function addItem() {
		if ( items.length >= MAX_ITEMS ) return;
		const next = [ ...items, makeItem() ];
		setAttributes( { items: next } );
		setActive( next.length - 1 );
	}

	function removeItem( index ) {
		if ( items.length <= 1 ) return;
		const next = items.filter( ( _, i ) => i !== index );
		setAttributes( { items: next } );
		setActive( Math.min( index, next.length - 1 ) );
	}

	return (
		<div { ...blockProps }>

			{ /* ── Sidebar ── */ }
			<InspectorControls>

				<PanelBody title={ __( 'Section Image', 'wp-rig' ) } initialOpen={ true }>
					{ imageUrl && (
						<img
							src={ imageUrl }
							alt={ imageAlt }
							className="pfa-editor__thumb"
						/>
					) }
					<MediaUpload
						onSelect={ ( media ) =>
							setAttributes( {
								imageId:  media.id,
								imageUrl: media.url,
								imageAlt: media.alt || '',
							} )
						}
						allowedTypes={ [ 'image' ] }
						value={ imageId }
						render={ ( { open } ) => (
							<Button variant="secondary" onClick={ open }>
								{ imageUrl
									? __( 'Replace Image', 'wp-rig' )
									: __( 'Select Image', 'wp-rig' ) }
							</Button>
						) }
					/>
					{ imageUrl && (
						<Button
							isDestructive
							onClick={ () =>
								setAttributes( { imageId: 0, imageUrl: '', imageAlt: '' } )
							}
							style={ { marginTop: '8px' } }
						>
							{ __( 'Remove Image', 'wp-rig' ) }
						</Button>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Value Items', 'wp-rig' ) } initialOpen={ true }>

					{ items.length >= MAX_ITEMS && (
						<Notice status="warning" isDismissible={ false }>
							{ __( 'Maximum of 10 items reached.', 'wp-rig' ) }
						</Notice>
					) }

					{ items.map( ( item, i ) => (
						<div key={ i } className="pfa-editor__item-row">
							<Button
								variant={ active === i ? 'primary' : 'secondary' }
								onClick={ () => setActive( i ) }
								className="pfa-editor__item-select-btn"
							>
								{ item.title || __( `Item ${ i + 1 }`, 'wp-rig' ) }
							</Button>
							{ items.length > 1 && (
								<Button
									isDestructive
									onClick={ () => removeItem( i ) }
									icon="trash"
									label={ __( 'Remove item', 'wp-rig' ) }
									showTooltip
								/>
							) }
						</div>
					) ) }

					<Button
						variant="primary"
						onClick={ addItem }
						disabled={ items.length >= MAX_ITEMS }
						className="pfa-editor__add-btn"
					>
						{ __( '+ Add Item', 'wp-rig' ) }
					</Button>
				</PanelBody>

				<PanelBody title={ __( 'Active Item Settings', 'wp-rig' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Title', 'wp-rig' ) }
						value={ currentItem.title }
						onChange={ ( v ) => updateItem( safeActive, { title: v } ) }
					/>
					<TextareaControl
						label={ __( 'Body Copy', 'wp-rig' ) }
						value={ currentItem.body }
						onChange={ ( v ) => updateItem( safeActive, { body: v } ) }
						rows={ 5 }
					/>
				</PanelBody>

			</InspectorControls>

			{ /* ── Canvas preview ── */ }
			<div className="pfa-editor__canvas">

				{ /* Left panel */ }
				<div className="pfa-editor__left">
					<div className="pfa-editor__eyebrow-wrap">
						<input
							className="pfa-editor__eyebrow-input"
							type="text"
							value={ eyebrow }
							placeholder={ __( 'Section eyebrow…', 'wp-rig' ) }
							onChange={ ( e ) => setAttributes( { eyebrow: e.target.value } ) }
						/>
					</div>
					<ul className="pfa-editor__items">
						{ items.map( ( item, i ) => (
							<li
								key={ i }
								className={ `pfa-editor__item${ i === safeActive ? ' is-active' : '' }` }
								onClick={ () => setActive( i ) }
							>
								<h3 className="pfa-editor__item-title">
									{ item.title || __( `Item ${ i + 1 }`, 'wp-rig' ) }
								</h3>
								<div className="pfa-editor__item-divider" aria-hidden="true">
									<span className="pfa-editor__item-progress"></span>
								</div>
								{ i === safeActive && item.body && (
									<p className="pfa-editor__item-body">{ item.body }</p>
								) }
							</li>
						) ) }
					</ul>
				</div>

				{ /* Right image */ }
				<div className="pfa-editor__right">
					{ imageUrl ? (
						<img
							src={ imageUrl }
							alt={ imageAlt }
							className="pfa-editor__image"
						/>
					) : (
						<div className="pfa-editor__image-placeholder">
							{ __( '← Select an image in the sidebar', 'wp-rig' ) }
						</div>
					) }
				</div>

			</div>

		</div>
	);
}
