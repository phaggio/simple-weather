import PropTypes from 'prop-types';
import React from 'react';

const Container = ({ fluid, children }) => {
	return <div className={`container${fluid ? `-fluid` : ``}`}>{children}</div>;
}
Container.propTypes = {
	children: PropTypes.node,
	fluid: PropTypes.string
};

const Row = ({ fluid, cols, children }) => {
	return (
		<div className={`row${fluid ? `-fluid` : ``} ${cols ? `row-cols-${cols}` : ``}`} >
			{children}
		</div>
	);
}
Row.propTypes = {
	fluid: PropTypes.string,
	cols: PropTypes.string,
	children: PropTypes.node
};

const Col = ({ size, children }) => {
	return (
		<div
			className={size
				.split(` `)
				.map(size => `col-${size}`)
				.join(` `)}
		>
			{children}
		</div>
	);
}
Col.propTypes = {
	children: PropTypes.node,
	size: PropTypes.string
};

export {
	Container,
	Col,
	Row
}