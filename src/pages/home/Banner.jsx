import React from 'react';
import PropTypes from 'prop-types';
// import GitHubButton from 'react-github-button';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import { Button } from 'antd';
// import BannerSVGAnim from './component/BannerSVGAnim';

function Banner(props) {
  return (
    <div className="banner-wrapper">
      {props.isMobile && (
        <TweenOne animation={{ opacity: 1 }} className="banner-image-wrapper">
          <div className="home-banner-image">
            <img
              alt="banner"
              src={require('../../../public/avator.jpg')}
              width="100%"
            />
          </div>
        </TweenOne>
      )}
      <QueueAnim className="banner-title-wrapper" type={props.isMobile ? 'bottom' : 'right'}>
        <div key="line" className="title-line-wrapper">
          <div className="title-line" style={{ transform: 'translateX(-64px)' }} />
        </div>
        <h1 key="h1">清风明月</h1>
        <p key="content">
          他强任他强，清风拂山岗；他横任他横，明月照大江；他自强来他自横，我自一口真气足。
        </p>
        {/* <div key="button" className="button-wrapper">
          <a href="http://preview.pro.ant.design" target="_blank" rel="noopener noreferrer">
            <Button type="primary">
              预览
            </Button>
          </a>
          <Button style={{ margin: '0 16px' }} type="primary" ghost>
            开始使用
          </Button>
          <GitHubButton
            key="github-button"
            type="stargazers"
            namespace="ant-design"
            repo="ant-design-pro"
          />
        </div> */}
      </QueueAnim>
      {!props.isMobile && (
        <TweenOne animation={{ opacity: 1 }} className="banner-image-wrapper">
          {/* <BannerSVGAnim /> */}
          <img
            src={require('../../../public/avator.jpg')}
            style={{ width: 598, height: 324, objectFit: 'contain' }}
          />
        </TweenOne>
      )}
    </div>
  );
}

Banner.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

export default Banner;
