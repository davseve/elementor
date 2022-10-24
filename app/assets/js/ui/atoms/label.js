import Icon from 'elementor-app/ui/atoms/icon';

export default function Label( props ) {
	const icon = props.icon && <Icon className={ props.icon } aria-hidden="true" />;

		return (
			<span className={ props?.className } >
				{ icon }
				{ props?.text }
			</span>
		);
	}

Label.propTypes = {
	className: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
};
