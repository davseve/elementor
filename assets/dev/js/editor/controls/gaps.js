import {areNewControlValuesEmpty, getOldControlName, updateNewControlWithOldControlValues} from '../../editor/utils/control-replacement.js';
// eslint-disable-next-line prefer-const
let ControlDimensionsView = require( 'elementor-controls/dimensions' ),
	ControlGapItemView;

// eslint-disable-next-line prefer-const
ControlGapItemView = ControlDimensionsView.extend( {

	ui() {
		// eslint-disable-next-line prefer-const
		const ui = ControlDimensionsView.prototype.ui.apply( this, arguments );

		ui.controls = '.elementor-control-gap > input:enabled';
		ui.link = 'button.elementor-link-gaps';

		return ui;
	},

	getPossibleDimensions() {
		return [
			'row',
			'column',
		];
	},

	onReady() {
		var self = this,
			control = this.model.attributes,
			currentValue = self.getControlValue();

		if( control.old_format && areNewControlValuesEmpty( control?.old_format.new_props, currentValue ) ) {
			const oldControlName = getOldControlName( control ),
				oldControlValue = self.getControlValue( null, oldControlName );

			if ( !! oldControlValue ) {
				currentValue.unit = oldControlValue.unit;
				_.each( control.old_format.new_props, ( newProp ) => {
					// currentValue[ newProp ] = oldControlValue;
					// Second param should check if the old_prop is an array and if si that iterate over it and set the value
					this.setValue( newProp, oldControlValue[ control.old_format.old_prop ] );
				} );
			}
		// } else {
		// 	return super.fillEmptyDimensions();
		}
	},
} );

module.exports = ControlGapItemView;
