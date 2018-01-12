import { Component } from 'preact';
import style from './style';

export default class Field extends Component {
	state = {
		value: this.props.value
	};

	handleChange = e => {
		let { id, value, onChange } = this.props;
		if (e.target.value===value) return;
		value = e.target.value;
		this.setState({ value });
		onChange({ id, value });
	};

	componentWillReceiveProps({ value }) {
		if (value!==this.state.value) this.setState({ value });
	}

	render({ id }, { value }) {
		return (
			<span class={style.field}>
				<span class={style.value}>{value || id}&nbsp;</span>
				<input type="text" class={style.input} onInput={this.handleChange} value={value} placeholder={id} />
			</span>
		);
	}
}