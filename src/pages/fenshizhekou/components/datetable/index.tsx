/**
 * 使用react-selectable-fast组件重构
 */
import React from 'react';
import { Button, Radio, InputNumber } from 'antd';
import { SelectableGroup } from 'react-selectable-fast';
import { isEmpty } from 'lodash';
import styles from './index.less';
import {
  PropTypes, StateTypes, DotType, SelectRectType,
} from './data';
import Dot from './dot';
import {
  data2dot, dot2data, getEmptyDots, getStartDot, getEndDot,
  WEEKS, HOURS,
} from './helper';

class TestPage extends React.Component<PropTypes, StateTypes> {
  contentRef: React.RefObject<any>;

  getSelectableGroupRef: React.RefObject<any>;

  constructor(props: PropTypes) {
    super(props);
    this.state = {
      dots: getEmptyDots(),
      emptyDots: [],
      formValues: {
        radioType: 1,
        discount: undefined,
      },
      isSelect: false,
      isSelecting: false,
      selectRect: {} as SelectRectType,
      startDot: {} as DotType,
      endDot: {} as DotType,
      currentTip: {},
      showTip: false,
    };
    this.contentRef = React.createRef();
    this.getSelectableGroupRef = React.createRef();
  }

  componentDidMount() {
    const emptyDots = getEmptyDots();

    const { value } = this.props;
    let defaultPropsDots = emptyDots;
    if (!isEmpty(value)) {
      // 如果有value，则用value的值，否则用默认的值
      defaultPropsDots = data2dot(value);
    }
    this.setState({
      emptyDots,
      dots: defaultPropsDots,
    });

    this.handleCalcSelectableBoxDisplay();
  }

  componentDidUpdate(prevProps: PropTypes) {
    const { value } = this.props;
    if (!isEmpty(value) && JSON.stringify(value) !== JSON.stringify(prevProps.value)) {
      const dots = data2dot(value);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        dots,
        isSelect: false,
        formValues: {
          radioType: 1,
          discount: undefined,
        },
      });
    }
  }

  // 解决react-selectable-fast的一个bug，宽高为0时，display应该为none
  handleCalcSelectableBoxDisplay = () => {
    const targetNode: any = document.querySelector('.selectable-selectbox');
    if (targetNode?.style.width === '0px' && targetNode.style.height === '0px') {
      targetNode.style.display = 'none';
    }
  }

  // 选择期间，如果还是none，置成空
  handleSelecting = () => {
    const targetNode: any = document.querySelector('.selectable-selectbox');
    if (targetNode?.style.display === 'none') {
      targetNode.style.display = '';
    }
    const { isSelecting, showTip } = this.state;
    if (!isSelecting) {
      this.setState({ isSelecting: true });
    }
    if (showTip) {
      this.setState({ showTip: false });
    }
  }

  // 修改数据时的radio的change事件
  handleRadioType = (e: any) => {
    const { formValues } = this.state;
    const radioType = e.target.value;
    this.setState({
      formValues: {
        ...formValues,
        radioType,
      },
    });
  };

  // 修改数据时的input的change事件
  handleDiscountChange = (value: any) => {
    const { formValues } = this.state;

    this.setState({
      formValues: {
        ...formValues,
        discount: value,
      },
    });
  };

  // 修改数据时的ok事件
  handleDotFormOk = async () => {
    // 给选中的dots赋discount值
    const {
      startDot, endDot, formValues, dots,
    } = this.state;

    const newDots = dots.map((_item: any) => {
      let item = { ..._item };
      // 在区间范围内
      if (
        item.week >= startDot.week
        && item.week <= endDot.week
        && item.hour >= startDot.hour
        && item.hour <= endDot.hour
      ) {
        let discount = 0;
        if (formValues.radioType === 3) {
          discount = 0;
        } else if (formValues.radioType === 2) {
          discount = 100;
        } else if (formValues.radioType === 1) {
          discount = formValues.discount || 0;
        }
        item = { ...item, discount };
      }
      return item;
    });
    this.setState({ isSelect: false, dots: newDots }, this.handleChange);
  };

  // 修改数据时的cancel事件
  handleDotFormCancel = () => {
    this.setState({ isSelect: false });
  };

  // 清除dot
  handleClear = () => {
    const { emptyDots } = this.state;

    this.setState({ dots: emptyDots }, this.handleChange);
  };

  // 统一处理更新
  handleChange = () => {
    const { dots } = this.state;
    const arr = dot2data(dots);
    const { onChange } = this.props;
    if (onChange) {
      onChange(arr);
    }
  };

  // 校验: 只要有一个不为0就通过
  // true:通过，false:不通过
  validate = () => {
    const { dots } = this.state;
    return dots.some((item: any) => item.discount !== 0);
  }

  // 选中操作结束，使用里面的值，存储为自己的值，之后清空掉组件内部的值
  handleSelectionFinish = (selectedItems: any) => {
    this.handleCalcSelectableBoxDisplay();
    if (isEmpty(selectedItems)) {
      return;
    }
    const dotWidth = 32;
    const dotHeight = 40;
    const selectedDots = selectedItems.map((node: any) => node.props.item);
    const startDot = getStartDot(selectedDots) as DotType;
    const endDot = getEndDot(selectedDots) as DotType;
    const left = (startDot?.hour ?? 0) * dotWidth;
    const right = ((endDot?.hour ?? 1) + 1) * dotWidth;
    const top = ((startDot?.week ?? 1) - 1) * dotHeight;
    const bottom = (endDot?.week ?? 0) * dotHeight;
    this.setState({
      isSelecting: false,
      isSelect: true,
      startDot,
      endDot,
      selectRect: {
        left,
        right,
        top,
        bottom,
        centerX: left + (right - left) / 2,
        centerY: top + (bottom - top) / 2,
      },
    }, () => {
      this.getSelectableGroupRef.current.clearSelection();
    });
  }

  handleShowTip = (item: any) => {
    const { isSelect, isSelecting } = this.state;
    if (isSelect || isSelecting) {
      return;
    }
    this.setState({ showTip: true, currentTip: item });
  };

  handleHideTip = (item: any) => {
    const { isSelect, isSelecting } = this.state;
    if (isSelect || isSelecting) {
      return;
    }
    this.setState({ showTip: false, currentTip: {} });
  };

  render() {
    const {
      dots,
      selectRect,
      isSelect,
      startDot,
      endDot,
      formValues,
      currentTip,
      showTip,
    } = this.state;
    const { disabled } = this.props;
    console.log('render', this.state);
    // 折扣输入框是否正常
    const discountDanger = formValues.radioType === 1
      && (formValues.discount === undefined
        || formValues.discount < 30 || formValues.discount > 250);
    const dotWidth = 32;
    const dotHeight = 40;
    const weekNames = ['--', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    return (
      <div className={styles.container}>
        <div style={{ width: 800 }} className={styles.innerContainer}>
          {/* 选中区域的展示 */}
          {isSelect && (
            <>
              <div
                className={styles.currentArea}
                id="selectArea"
                style={{
                  // display: (isSelect ? 'absolute' : 'none'),
                  top: 64 + selectRect.top,
                  left: 32 + selectRect.left,
                  height: selectRect.bottom - selectRect.top,
                  width: selectRect.right - selectRect.left,
                  minHeight: 2,
                  minWidth: 2,
                }}
              />
              <div
                style={{
                  top: 64 + selectRect.centerY,
                  left: 32 + selectRect.centerX,
                  display: isSelect ? '' : 'none',
                }}
                className={styles.popContainer}
              >
                <div className={styles.formContent}>
                  <div className={styles.title}>
                    <span>
                      {WEEKS[(startDot?.week ?? 1) - 1].fullName}
                      -
                      {WEEKS[(endDot?.week ?? 1) - 1].fullName}
                    </span>
                    :
                    <strong style={{ marginLeft: 5 }}>
                      {startDot.hour}
                      :00 -
                      {endDot.hour}
                      :00
                    </strong>
                  </div>
                  <Radio.Group
                    className={styles.radios}
                    value={formValues.radioType}
                    onChange={this.handleRadioType}
                  >
                    <Radio value={1}>
                      自定义
                      <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
                        <InputNumber
                          value={formValues.discount}
                          onChange={this.handleDiscountChange}
                          disabled={formValues.radioType !== 1}
                          size="small"
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                            borderColor: discountDanger ? '#d52112' : '',
                          }}
                        />
                        {discountDanger && <span style={{ color: '#d52112' }}>范围:30-250的整数</span>}
                      </div>
                      <span>%</span>
                    </Radio>
                    <Radio value={2}>无折扣</Radio>
                    <Radio value={3}>不投放</Radio>
                  </Radio.Group>
                </div>
                <div className={styles.btns}>
                  <Button disabled={discountDanger} size="small" onClick={this.handleDotFormOk} type="primary">
                    确定
                  </Button>
                  <Button size="small" onClick={this.handleDotFormCancel} style={{ marginLeft: 5 }}>
                    取消
                  </Button>
                </div>
              </div>
            </>
          )}
          {/* dot的详情 */}
          <div
            style={{
              top: 62 + (currentTip.week || 0) * dotHeight,
              left: 32 + ((currentTip.hour || 0) + 1) * dotWidth,
              display: showTip ? '' : 'none',
            }}
            className={styles.popContainer}
          >
            <div className={styles.formContent}>
              <div className={styles.title} style={{ display: 'flex', flexDirection: 'column' }}>
                <span>{weekNames[currentTip.week]}</span>
                <strong>{`${currentTip.hour}:00 - ${currentTip.hour + 1}:00`}</strong>
                <strong>{`${currentTip.discount}%折扣`}</strong>
              </div>
            </div>
          </div>
          {/* 表格内容 */}
          <div className={styles.content} style={{ width: 800 }}>
            <ul className={styles.weekList} style={{ width: 32 }}>
              <li key="星期" className={styles.weekItem} style={{ height: 61, lineHeight: '60px' }}>
                星期
              </li>
              {WEEKS.map((item: any) => (
                <li
                  key={item.name}
                  className={styles.weekItem}
                  style={{ height: 40, lineHeight: '40px' }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
            <div className={styles.rightContent} style={{ width: 768 }}>
              <ul className={styles.timeList}>
                {['00:00 - 06:00', '06:00 - 12:00', '12:00 - 18:00', '18:00 - 24:00'].map(
                  (item) => (
                    <li
                      key={item}
                      className={styles.timeItem}
                      style={{ width: 192, height: 30, lineHeight: '30px' }}
                    >
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <ul className={styles.hourList}>
                {HOURS.map((item: any) => (
                  <li
                    key={item}
                    className={styles.hourItem}
                    style={{ width: 32, height: 30, lineHeight: '30px' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <SelectableGroup
                ref={this.getSelectableGroupRef}
                className="main"
                // clickClassName="tick"
                enableDeselect
                disabled={disabled}
                // tolerance={0}
                // deselectOnEsc
                allowClickWithoutSelected={false}
                duringSelection={this.handleSelecting}
                // onSelectionClear={this.handleSelectionClear}
                onSelectionFinish={this.handleSelectionFinish}
              // onSelectedItemUnmount={this.handleSelectedItemUnmount}
              // ignoreList={['.not-selectable']}
              >
                <ul className={styles.dotList} ref={this.contentRef}>
                  {dots.map((item) => (
                    <Dot
                      key={item.id}
                      item={item}
                      onMouseOver={() => this.handleShowTip(item)}
                      onMouseOut={() => this.handleHideTip(item)}
                    />
                  ))}
                </ul>
              </SelectableGroup>

            </div>
          </div>
          <div className={styles.footer}>
            <Button
              size="small"
              style={{ marginRight: 10 }}
              type="primary"
              onClick={this.handleClear}
            >
              清空
            </Button>
            {/* <Button size="small" type="primary">重置</Button> */}
            <span className="fr lh28 color-c">
              <span
                className={styles.helpDot}
                style={{ backgroundColor: 'rgba(97,199,242,0.2)' }}
              />
              <span className={styles.helpText}>30-100%</span>
              <span
                className={styles.helpDot}
                style={{ backgroundColor: 'rgba(77,166,255,0.4)' }}
              />
              <span className={styles.helpText}>100-200%</span>
              <span
                className={styles.helpDot}
                style={{ backgroundColor: 'rgba(134,115,230,0.4)' }}
              />
              <span className={styles.helpText}>200-250%</span>
              {/* <i className="mc-iconfont displacement-2"></i> */}
              <span className={styles.helpTip}>可以拖拽鼠标选择投放时段</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default TestPage;
