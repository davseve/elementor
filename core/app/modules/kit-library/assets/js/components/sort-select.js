import { Select, Button } from '@elementor/app-ui';
import { useState, useEffect } from 'react';

import './sort-select.scss';

export default function SortSelect( props ) {
	const getSelectedOptionDetails = ( value ) => {
		return props.options.find( ( option ) => option.value === value );
	};

	const [ selectedSortBy, setSelectedSortBy ] = useState( getSelectedOptionDetails( props.value.by ) );

	useEffect( () => {
		props.onChange( { by: selectedSortBy.value, direction: selectedSortBy.defaultOrder ?? props.value.direction } );
	}, [ selectedSortBy ] );

	return (
		<div className="eps-sort-select">
			<div className="eps-sort-select__select-wrapper">
				<Select
					options={ props.options }
					value={ props.value.by }
					onChange={ ( e ) => {
						const value = e.target.value;
						setSelectedSortBy( getSelectedOptionDetails( value ) );
						elementorCommon.events.eventTracking(
							'kit-library/change-sort-type',
							{
								placement: 'kit library',
								event: 'kit sort type select',
							},
							{
								source: 'home page',
								sort_type: value,
							} );
						props.onChange( { by: value, direction: props.value.direction } );
					} }
					className="eps-sort-select__select"

					// TODO: Add onBlur handler
					onClick={ () => {
						props.onChange( {
							by: props.value.by,
							direction: 'asc' === props.value.direction ? 'desc' : 'asc',
						} );
						elementorCommon.events.eventTracking(
							'kit-library/change-sort-type',
							{
								placement: 'kit library',
								event: 'kit sort type dropdown',
								version: 'v1',
							},
							{
								source: 'home page',
								action: 'expand',
							} );
					} }
				/>
			</div>
			{
				! selectedSortBy.orderDisabled &&
					<Button
						text={ 'asc' === props.value.direction ? __( 'Sort Descending', 'elementor' ) : __( 'Sort Ascending', 'elementor' ) }
						hideText={ true }
						icon={ 'asc' === props.value.direction ? 'eicon-arrow-up' : 'eicon-arrow-down' }
						className="eps-sort-select__button"
						onClick={ () => {
							const direction = 'asc' === props.value.direction ? 'desc' : 'asc';
							elementorCommon.events.eventTracking(
								'kit-library/change-sort-direction',
								{
									placement: 'kit library',
									event: 'kit sort direction',
								},
								{
									source: 'home page',
									sort_direction: direction,
								} );
							props.onChange( {
								by: props.value.by,
								direction: 'asc' === props.value.direction ? 'desc' : 'asc',
							} );
						} }
					/>
			}
		</div>
	);
}

SortSelect.propTypes = {
	options: PropTypes.arrayOf( PropTypes.shape( {
		label: PropTypes.string.isRequired,
		value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ).isRequired,
	} ) ).isRequired,
	value: PropTypes.shape( {
		direction: PropTypes.oneOf( [ 'asc', 'desc' ] ).isRequired,
		by: PropTypes.string.isRequired,
	} ).isRequired,
	onChange: PropTypes.func.isRequired,
};
