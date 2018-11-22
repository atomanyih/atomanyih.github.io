import React from "react";

const withAnimation = Wrapped => class WithAnimation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      t: 0
    };
  }

  componentDidMount() {
    const update = t => this.setState({t});

    const loop = t => {
      update(t);
      this.rafHandle = requestAnimationFrame(loop);
    };

    loop()
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafHandle);
  }

  render() {
    return <Wrapped {...this.props} t={this.state.t}/>
  }
};

export default withAnimation;