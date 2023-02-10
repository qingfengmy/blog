import React from 'react';
import PropTypes from 'prop-types';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import Parallax from 'rc-scroll-anim/lib/ScrollParallax';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import { history } from "umi";

const { TweenOneGroup } = TweenOne;

const featuresCN = [
  {
    title: '分时折扣',
    content: '以星期的维度去做折扣设置',
    src: 'https://gw.alipayobjects.com/zos/rmsportal/VriUmzNjDnjoFoFFZvuh.svg',
    color: '#13C2C2',
    shadowColor: 'rgba(19,194,194,.12)',
    path: '/fenshizhekou'
  },
  {
    title: '投放时段',
    content: '以星期的维度去做投放设置',
    src: 'https://gw.alipayobjects.com/zos/rmsportal/smwQOoxCjXVbNAKMqvWk.svg',
    color: '#2F54EB',
    shadowColor: 'rgba(47,84,235,.12)',
    path: '/toufangshiduan'
  },
  // {
  //   title: 'echarts和bmap',
  //   content: 'echarts中用百度地图',
  //   src: 'https://gw.alipayobjects.com/zos/rmsportal/hBbIHzUsSbSxrhoRFYzi.svg',
  //   color: '#F5222D',
  //   shadowColor: 'rgba(245,34,45,.12)',
  //   path: '/demos/echartsbmap'
  // },
  // {
  //   title: '进度弹窗',
  //   content: '一个进度条的弹窗',
  //   src: 'https://gw.alipayobjects.com/zos/rmsportal/BISfzKcCNCYFmTYcUygW.svg',
  //   color: '#1AC44D',
  //   shadowColor: 'rgba(26,196,77,.12)',
  //   path: '/demos/progressmodal'
  // },
  // {
  //   title: 'svg',
  //   content: '复杂svg实践',
  //   src: 'https://gw.alipayobjects.com/zos/rmsportal/XxqEexmShHOofjMYOCHi.svg',
  //   color: '#FAAD14',
  //   shadowColor: 'rgba(250,173,20,.12)',
  //   path: '/demos/svg'
  // },
  // {
  //   title: '国际化',
  //   content: '内建业界通用的国际化方案（敬请期待）',
  //   src: 'https://gw.alipayobjects.com/zos/rmsportal/JsixxWSViARJnQbAAPkI.svg',
  //   color: '#722ED1',
  //   shadowColor: 'rgba(114,46,209,.12)',
  // },
  // {
  //   title: '最佳实践',
  //   content: '良好的工程实践助你持续产出高质量代码',
  //   src: 'https://gw.alipayobjects.com/zos/rmsportal/pbmKMSFpLurLALLNliUQ.svg',
  //   color: '#FA8C16',
  //   shadowColor: 'rgba(250,140,22,.12)',
  // },
  // {
  //   title: 'Mock 数据',
  //   content: '实用的本地数据调试方案',
  //   src: 'https://gw.alipayobjects.com/zos/rmsportal/aLQyKyUyssIUhHTZqCIb.svg',
  //   color: '#EB2F96',
  //   shadowColor: 'rgba(235,45,150,.12)',
  // },
  // {
  //   title: 'UI 测试',
  //   content: '自动化测试保障前端产品质量',
  //   src: 'https://gw.alipayobjects.com/zos/rmsportal/RpJIQitGbSCHwLMimybX.svg',
  //   color: '#1890FF',
  //   shadowColor: 'rgba(24,144,255,.12)',
  // },
];

const pointPos = [
  { x: -30, y: -10 },
  { x: 20, y: -20 },
  { x: -65, y: 15 },
  { x: -45, y: 80 },
  { x: 35, y: 5 },
  { x: 50, y: 50, opacity: 0.2 },
];

class Page1 extends React.PureComponent {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      hoverNum: null,
    };
  }
  onMouseOver = (i) => {
    this.setState({
      hoverNum: i,
    });
  };
  onMouseOut = () => {
    this.setState({
      hoverNum: null,
    });
  };
  getEnter = (e) => {
    const i = e.index;
    const r = Math.random() * 2 - 1;
    const y = Math.random() * 10 + 5;
    const delay = Math.round(Math.random() * (i * 50));
    return [
      {
        delay,
        opacity: 0.4,
        ...pointPos[e.index],
        ease: 'easeOutBack',
        duration: 300,
      },
      {
        y: r > 0 ? `+=${y}` : `-=${y}`,
        duration: Math.random() * 1000 + 2000,
        yoyo: true,
        repeat: -1,
      },
    ];
  };
  render() {
    const { hoverNum } = this.state;
    let children = [[], [], []];
    featuresCN.forEach((item, i) => {
      const isHover = hoverNum === i;
      const child = (
        <li key={i.toString()}>
          <div
            className="page1-box"
            onMouseEnter={() => {
              this.onMouseOver(i);
            }}
            onMouseLeave={this.onMouseOut}
          >
            <div
              className="page1-image"
              style={{
                cursor: 'pointer',
                boxShadow: `${isHover ? '0 12px 24px' : '0 6px 12px'} ${item.shadowColor}`,
              }}
              onClick={()=>{
                // window._hmt.push(['_trackEvent', item.title, 'click']);
                history.push(item.path);
              }}
            >
              <img src={item.src} alt="img" style={i === 4 ? { marginLeft: -15 } : {}} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </div>
        </li>
      );
      children[Math.floor(i / 3)].push(child);
    });

    children = children.map((item, i) => (
      <QueueAnim
        className="page1-box-wrapper"
        key={i.toString()}
        type="bottom"
        leaveReverse
        delay={[i * 100, (children.length - 1 - i) * 100]}
        component="ul"
      >
        {item}
      </QueueAnim>
    ));
    console.log('children', children);
    return (
      <div className="home-page page1">
        <div className="home-page-wrapper" id="page1-wrapper">
          <h2>
            <span>组件列表</span>
          </h2>
          <div className="title-line-wrapper page1-line">
            <div className="title-line" />
          </div>
          {children}
        </div>
      </div>
    );
  }
}

export default Page1;
