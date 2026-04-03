const { __ }                                       = wp.i18n;
const { InspectorControls, useBlockProps, MediaUpload } = wp.blockEditor;
const { PanelBody, Button, TextControl, TextareaControl, Notice } = wp.components;
const { useState } = wp.element;

const MAX_TABS = 5;

function makeTab() {
	return {
		label:    '',
		imageId:  0,
		imageUrl: '',
		imageAlt: '',
		heading:  '',
		body:     '',
	};
}

export default function Edit( { attributes, setAttributes } ) {
	const blockProps  = useBlockProps( { className: 'philosophy-tabs-editor' } );
	const { tabs }    = attributes;
	const [ active, setActive ] = useState( 0 );

	const currentTab  = tabs[ active ] ?? makeTab();
	const safeActive  = Math.min( active, tabs.length - 1 );

	function updateTab( index, patch ) {
		const next = tabs.map( ( t, i ) => ( i === index ? { ...t, ...patch } : t ) );
		setAttributes( { tabs: next } );
	}

	function addTab() {
		if ( tabs.length >= MAX_TABS ) return;
		const next = [ ...tabs, makeTab() ];
		setAttributes( { tabs: next } );
		setActive( next.length - 1 );
	}

	function removeTab( index ) {
		if ( tabs.length <= 1 ) return;
		const next = tabs.filter( ( _, i ) => i !== index );
		setAttributes( { tabs: next } );
		setActive( Math.min( index, next.length - 1 ) );
	}

	return (
		<div { ...blockProps }>

			{ /* ── Sidebar ── */ }
			<InspectorControls>
				<PanelBody title={ __( 'Tabs', 'wp-rig' ) } initialOpen={ true }>

					{ tabs.length >= MAX_TABS && (
						<Notice status="warning" isDismissible={ false }>
							{ __( 'Maximum of 5 tabs reached.', 'wp-rig' ) }
						</Notice>
					) }

					{ tabs.map( ( tab, i ) => (
						<div key={ i } className="pt-editor-tab-row">
							<Button
								variant={ active === i ? 'primary' : 'secondary' }
								onClick={ () => setActive( i ) }
								className="pt-editor-tab-select-btn"
							>
								{ tab.label || __( `Tab ${ i + 1 }`, 'wp-rig' ) }
							</Button>
							{ tabs.length > 1 && (
								<Button
									isDestructive
									onClick={ () => removeTab( i ) }
									icon="trash"
									label={ __( 'Remove tab', 'wp-rig' ) }
									showTooltip
								/>
							) }
						</div>
					) ) }

					<Button
						variant="primary"
						onClick={ addTab }
						disabled={ tabs.length >= MAX_TABS }
						className="pt-editor-add-btn"
					>
						{ __( '+ Add Tab', 'wp-rig' ) }
					</Button>
				</PanelBody>

				<PanelBody title={ __( 'Active Tab Settings', 'wp-rig' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Tab Label (uppercase)', 'wp-rig' ) }
						value={ currentTab.label }
						onChange={ ( v ) => updateTab( safeActive, { label: v } ) }
					/>

					<TextControl
						label={ __( 'Heading', 'wp-rig' ) }
						value={ currentTab.heading }
						onChange={ ( v ) => updateTab( safeActive, { heading: v } ) }
					/>

					<TextareaControl
						label={ __( 'Body Copy', 'wp-rig' ) }
						value={ currentTab.body }
						onChange={ ( v ) => updateTab( safeActive, { body: v } ) }
						rows={ 5 }
					/>

					<p className="pt-editor-label">{ __( 'Tab Image', 'wp-rig' ) }</p>
					{ currentTab.imageUrl && (
						<img
							src={ currentTab.imageUrl }
							alt={ currentTab.imageAlt }
							className="pt-editor-thumb"
						/>
					) }
					<MediaUpload
						onSelect={ ( media ) =>
							updateTab( safeActive, {
								imageId:  media.id,
								imageUrl: media.url,
								imageAlt: media.alt || '',
							} )
						}
						allowedTypes={ [ 'image' ] }
						value={ currentTab.imageId }
						render={ ( { open } ) => (
							<Button variant="secondary" onClick={ open }>
								{ currentTab.imageUrl
									? __( 'Replace Image', 'wp-rig' )
									: __( 'Select Image', 'wp-rig' ) }
							</Button>
						) }
					/>
					{ currentTab.imageUrl && (
						<Button
							isDestructive
							onClick={ () =>
								updateTab( safeActive, {
									imageId:  0,
									imageUrl: '',
									imageAlt: '',
								} )
							}
						>
							{ __( 'Remove Image', 'wp-rig' ) }
						</Button>
					) }
				</PanelBody>
			</InspectorControls>

			{ /* ── Canvas preview ── */ }
			<div className="pt-editor-canvas">

				{ /* Image preview */ }
				<div className="pt-editor-image-wrap">
					{ currentTab.imageUrl ? (
						<img
							src={ currentTab.imageUrl }
							alt={ currentTab.imageAlt }
							className="pt-editor-image"
						/>
					) : (
						<div className="pt-editor-image-placeholder">
							{ __( 'Select an image in the sidebar →', 'wp-rig' ) }
						</div>
					) }
				</div>

				{ /* Tab buttons row */ }
				<div className="pt-editor-controls">
					<div className="pt-editor-tab-nav">
						{ tabs.map( ( tab, i ) => (
							<button
								key={ i }
								className={ `pt-editor-btn${ i === safeActive ? ' is-active' : '' }` }
								onClick={ () => setActive( i ) }
								type="button"
							>
								{ tab.label || __( `Tab ${ i + 1 }`, 'wp-rig' ) }
							</button>
						) ) }
					</div>
					<hr className="pt-editor-divider" />
				</div>

				{ /* Content row */ }
				<div className="pt-editor-content">
					<h3 className="pt-editor-heading">
						{ currentTab.heading || __( 'Tab Heading', 'wp-rig' ) }
					</h3>
					<p className="pt-editor-body">
						{ currentTab.body || __( 'Tab body copy…', 'wp-rig' ) }
					</p>
				</div>

			</div>
		</div>
	);
}
