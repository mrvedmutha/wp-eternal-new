const { __ } = wp.i18n;
const { InspectorControls, useBlockProps, MediaUpload } = wp.blockEditor;
const { PanelBody, Button, TextControl, TextareaControl, Notice, SelectControl } = wp.components;
const { useState } = wp.element;

const MAX_ITEMS = 10;

function makeItem() {
	return { heading: '', body: '' };
}

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps( { className: 'pfm-editor' } );
	const { eyebrow, mediaType, mediaId, mediaUrl, mediaAlt, items } = attributes;
	const [ active, setActive ] = useState( 0 );

	const safeActive  = Math.min( active, items.length - 1 );
	const currentItem = items[ safeActive ] ?? makeItem();

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

				<PanelBody title={ __( 'Right Panel Media', 'wp-rig' ) } initialOpen={ true }>
					<SelectControl
						label={ __( 'Media type', 'wp-rig' ) }
						value={ mediaType }
						options={ [
							{ label: 'Video', value: 'video' },
							{ label: 'Image', value: 'image' },
						] }
						onChange={ ( v ) => setAttributes( { mediaType: v, mediaId: 0, mediaUrl: '', mediaAlt: '' } ) }
					/>

					{ mediaUrl && mediaType === 'image' && (
						<img src={ mediaUrl } alt={ mediaAlt } className="pfm-editor__thumb" />
					) }
					{ mediaUrl && mediaType === 'video' && (
						<video src={ mediaUrl } className="pfm-editor__thumb" muted />
					) }

					<MediaUpload
						onSelect={ ( media ) =>
							setAttributes( {
								mediaId:  media.id,
								mediaUrl: media.url,
								mediaAlt: media.alt || '',
							} )
						}
						allowedTypes={ mediaType === 'video' ? [ 'video' ] : [ 'image' ] }
						value={ mediaId }
						render={ ( { open } ) => (
							<Button variant="secondary" onClick={ open }>
								{ mediaUrl
									? __( 'Replace Media', 'wp-rig' )
									: __( 'Select Media', 'wp-rig' ) }
							</Button>
						) }
					/>
					{ mediaUrl && (
						<Button
							isDestructive
							onClick={ () => setAttributes( { mediaId: 0, mediaUrl: '', mediaAlt: '' } ) }
							style={ { marginTop: '8px' } }
						>
							{ __( 'Remove Media', 'wp-rig' ) }
						</Button>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Pillar Items', 'wp-rig' ) } initialOpen={ true }>

					{ items.length >= MAX_ITEMS && (
						<Notice status="warning" isDismissible={ false }>
							{ __( 'Maximum of 10 items reached.', 'wp-rig' ) }
						</Notice>
					) }

					{ items.map( ( item, i ) => (
						<div key={ i } className="pfm-editor__item-row">
							<Button
								variant={ active === i ? 'primary' : 'secondary' }
								onClick={ () => setActive( i ) }
								className="pfm-editor__item-select-btn"
							>
								{ item.heading || __( `Item ${ i + 1 }`, 'wp-rig' ) }
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
						className="pfm-editor__add-btn"
					>
						{ __( '+ Add Item', 'wp-rig' ) }
					</Button>
				</PanelBody>

				<PanelBody title={ __( 'Active Item', 'wp-rig' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Heading', 'wp-rig' ) }
						value={ currentItem.heading }
						onChange={ ( v ) => updateItem( safeActive, { heading: v } ) }
					/>
					<TextareaControl
						label={ __( 'Body', 'wp-rig' ) }
						value={ currentItem.body }
						onChange={ ( v ) => updateItem( safeActive, { body: v } ) }
						rows={ 4 }
					/>
				</PanelBody>

			</InspectorControls>

			{ /* ── Canvas preview ── */ }
			<div className="pfm-editor__canvas">

				{ /* Left */ }
				<div className="pfm-editor__left">
					<input
						className="pfm-editor__eyebrow-input"
						type="text"
						value={ eyebrow }
						placeholder={ __( 'Section eyebrow…', 'wp-rig' ) }
						onChange={ ( e ) => setAttributes( { eyebrow: e.target.value } ) }
					/>
					<ul className="pfm-editor__items">
						{ items.map( ( item, i ) => (
							<li
								key={ i }
								className={ `pfm-editor__item${ i === safeActive ? ' is-active' : '' }` }
								onClick={ () => setActive( i ) }
							>
								<h3 className="pfm-editor__item-heading">
									{ item.heading || __( `Item ${ i + 1 }`, 'wp-rig' ) }
								</h3>
								{ i === safeActive && item.body && (
									<p className="pfm-editor__item-body">{ item.body }</p>
								) }
							</li>
						) ) }
					</ul>
				</div>

				{ /* Right */ }
				<div className="pfm-editor__right">
					{ mediaUrl && mediaType === 'video' && (
						<video
							src={ mediaUrl }
							className="pfm-editor__media"
							muted
							loop
							autoPlay
						/>
					) }
					{ mediaUrl && mediaType === 'image' && (
						<img
							src={ mediaUrl }
							alt={ mediaAlt }
							className="pfm-editor__media"
						/>
					) }
					{ ! mediaUrl && (
						<div className="pfm-editor__media-placeholder">
							{ __( '← Select media in the sidebar', 'wp-rig' ) }
						</div>
					) }
				</div>

			</div>

		</div>
	);
}
