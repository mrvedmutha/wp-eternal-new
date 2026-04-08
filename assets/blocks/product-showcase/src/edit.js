import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, SelectControl, RangeControl, Spinner } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const ORDER_OPTIONS = [
	{ value: 'rand',       label: 'Random (new set on each load)' },
	{ value: 'date',       label: 'Newest' },
	{ value: 'popularity', label: 'Best Sellers' },
	{ value: 'rating',     label: 'Top Rated' },
	{ value: 'on_sale',    label: 'On Sale' },
	{ value: 'featured',   label: 'Featured' },
];

export default function Edit( { name, attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { heading, body, category, orderby, limit } = attributes;

	const [ categories, setCategories ] = useState( [] );
	const [ loadingCats, setLoadingCats ] = useState( true );

	useEffect( () => {
		apiFetch( { path: '/wp/v2/product_cat?per_page=100&orderby=name&order=asc&hide_empty=false' } )
			.then( ( cats ) => {
				const options = [
					{ value: '', label: 'All Categories' },
					...cats.map( ( c ) => ( { value: c.slug, label: c.name } ) ),
				];
				setCategories( options );
				setLoadingCats( false );
			} )
			.catch( () => {
				setCategories( [ { value: '', label: 'All Categories' } ] );
				setLoadingCats( false );
			} );
	}, [] );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Content" initialOpen={ true }>
					<TextControl
						label="Heading"
						value={ heading }
						onChange={ ( val ) => setAttributes( { heading: val } ) }
					/>
					<TextareaControl
						label="Body"
						value={ body }
						onChange={ ( val ) => setAttributes( { body: val } ) }
						rows={ 3 }
						help="Optional paragraph shown below the heading."
					/>
				</PanelBody>

				<PanelBody title="Products" initialOpen={ true }>
					{ loadingCats ? (
						<Spinner />
					) : (
						<SelectControl
							label="Category"
							value={ category }
							options={ categories }
							onChange={ ( val ) => setAttributes( { category: val } ) }
						/>
					) }

					<SelectControl
						label="Order / Grouping"
						value={ orderby }
						options={ ORDER_OPTIONS }
						onChange={ ( val ) => setAttributes( { orderby: val } ) }
					/>

					<RangeControl
						label="Number of Products"
						value={ limit }
						onChange={ ( val ) => setAttributes( { limit: val } ) }
						min={ 3 }
						max={ 18 }
						step={ 3 }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</>
	);
}
