import React from 'react';
import DocumentTitle from 'react-document-title';
import { enquireScreen } from 'enquire-js';
import CanvasNest from 'canvas-nest.js';
import Header from './Header';
import Banner from './Banner';
import Page1 from './Page1';
import Footer from './Footer';
import './static/style';

let isMobile;

enquireScreen((b) => {
  isMobile = b;
});

class Home extends React.PureComponent {
  cn;

  state = {
    isMobile,
  };

  componentDidMount() {
    enquireScreen((b) => {
      this.setState({
        isMobile: !!b,
      });
    });
    this.cn = new CanvasNest(document.querySelector('.home-wrapper'), {});
  }

  componentWillUnmount() {
    this.cn.destroy();
  }

  render() {
    return (
      <DocumentTitle title="Ant Design - pro">
        <div>
          <Header isMobile={this.state.isMobile} />
          <div className="home-wrapper">
            <Banner isMobile={this.state.isMobile} />
            <Page1 isMobile={this.state.isMobile} />
          </div>
          <Footer />
          <div className="canvasNest" />
        </div>
      </DocumentTitle>
    );
  }
}

export default Home;
