import React from "react";

const withAnimation = Wrapped => class WithAnimation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      t: 0
    };
  }

  componentDidMount() {
    const loop = t => {
      this.setState({t});
      this.rafHandle = requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop)
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafHandle);
  }

  render() {
    return <Wrapped {...this.props} t={this.state.t}/>
  }
};

export default withAnimation;