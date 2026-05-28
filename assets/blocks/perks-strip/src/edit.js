const { __ } = wp.i18n;
const { InspectorControls, useBlockProps, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, TextareaControl, Button } = wp.components;
const ServerSideRender = wp.serverSideRender;
const { Fragment } = wp.element;

function ItemPanel( { number, iconUrl, title, desc, setAttributes } ) {
	const iconKey  = `item${ number }IconUrl`;
	const titleKey = `item${ number }Title`;
	const descKey  = `item${ number }Desc`;

	return (
		<PanelBody title={ `${ __( 'Item', 'wp-rig' ) } ${ number }` } initialOpen={ number === 1 }>

			<div style={ { marginBottom: '12px' } }>
				<p style={ { fontSize: '11px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' } }>
					{ __( 'Icon', 'wp-rig' ) }
				</p>
				{ iconUrl && (
					<img
						src={ iconUrl }
						alt=""
						style={ { width: '40px', height: '40px', objectFit: 'contain', display: 'block', marginBottom: '6px' } }
					/>
				) }
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) => setAttributes( { [ iconKey ]: media.url } ) }
						allowedTypes={ [ 'image' ] }
						value={ iconUrl }
						render={ ( { open } ) => (
							<Button onClick={ open } variant="secondary">
								{ iconUrl ? __( 'Change Icon', 'wp-rig' ) : __( 'Upload Icon', 'wp-rig' ) }
							</Button>
						) }
					/>
				</MediaUploadCheck>
				{ iconUrl && (
					<Button
						variant="link"
						isDestructive
						onClick={ () => setAttributes( { [ iconKey ]: '' } ) }
						style={ { display: 'block', marginTop: '4px', fontSize: '11px' } }
					>
						{ __( 'Remove', 'wp-rig' ) }
					</Button>
				) }
			</div>

			<TextControl
				label={ __( 'Title', 'wp-rig' ) }
				value={ title }
				onChange={ ( v ) => setAttributes( { [ titleKey ]: v } ) }
			/>
			<TextareaControl
				label={ __( 'Description', 'wp-rig' ) }
				value={ desc }
				rows={ 2 }
				onChange={ ( v ) => setAttributes( { [ descKey ]: v } ) }
			/>
		</PanelBody>
	);
}

export default function Edit( props ) {
	const { name, attributes = {}, setAttributes } = props || {};
	const {
		item1IconUrl = '', item1Title = 'FREE SHIPPING',        item1Desc = '',
		item2IconUrl = '', item2Title = 'GIFTS WITH PURCHASE',  item2Desc = '',
		item3IconUrl = '', item3Title = 'FLEXIBLE DELIVERY',    item3Desc = '',
		item4IconUrl = '', item4Title = 'ONLINE CONSULTATION',  item4Desc = '',
	} = attributes;

	const blockProps = useBlockProps( { className: 'perks-strip-wrapper' } );

	const items = [
		{ number: 1, iconUrl: item1IconUrl, title: item1Title, desc: item1Desc },
		{ number: 2, iconUrl: item2IconUrl, title: item2Title, desc: item2Desc },
		{ number: 3, iconUrl: item3IconUrl, title: item3Title, desc: item3Desc },
		{ number: 4, iconUrl: item4IconUrl, title: item4Title, desc: item4Desc },
	];

	return (
		<Fragment>
			<InspectorControls>
				{ items.map( ( item ) => (
					<ItemPanel
						key={ item.number }
						{ ...item }
						setAttributes={ setAttributes }
					/>
				) ) }
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</Fragment>
	);
}
