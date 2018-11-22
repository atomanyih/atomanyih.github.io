import React from "react";

const withVelocity = propNames => Wrapped => class WithVelocity extends React.Component {
  constructor(props) {
    super(props);

    this.values = propNames.reduce((acc, propName) => {
      acc[propName] = 0;
      return acc;
    }, {});
  }

  componentDidMount() {
    this.handle = setInterval(() => {
      this.values = propNames.reduce((acc, propName) => {
        acc[propName] = this.values[propName] + (this.props[propName] - this.values[propName]) / 20;
        return acc;
      }, {});
    }, 10)
  }

  componentWillUnmount() {
    clearInterval(this.handle)
  }

  render() {
    return (
      <Wrapped {...this.props} {...this.values}/>
    )
  }
};

export default withVelocity;