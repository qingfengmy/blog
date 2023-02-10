/*
 * 时间段选择控件：通过react-selectable-fast插件实现
 * @Author: tao.zhang@leyantech.com
 * @Date: 2021-03-16 10:44:18
 * @Last Modified by: tao.zhang@leyantech.com
 * @Last Modified time: 2021-04-26 17:50:09
 */
import React, {
  useRef, useMemo, useCallback,
} from 'react';
import './index.less';
import { isEmpty, isNil } from 'lodash';
import { SelectableGroup } from 'react-selectable-fast';
import { PropTypes, DotTypes, LabelTypes } from './data';
import Dot from './dot';
import { dots2label } from './helper';

const TimeTable = (props: PropTypes) => {
  const {
    value, style, className, onChange,
  } = props;
  // 24个小时的常量
  const HOURS_REF = useRef([...Array(24).keys()]);
  // 每半个小时是一个值，7天是2*24*7
  const defaultValue = useRef([...Array(2 * 24 * 7).keys()].map(() => 0).join(''));
  // 星期的常量
  const WEEKS_REF = useRef(['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']);

  // selectionRef
  const selectionRef = useRef<any>();

  // 文字提示
  const labelRef = useRef<LabelTypes[]>([]);
  // dot数组缓存一份
  const dotsRef = useRef<DotTypes[] | null>(null);

  // string形式的value渲染成dot数组
  const dots: DotTypes[] = useMemo(() => {
    const result = (isNil(value) ? defaultValue.current : value).split('').map((item: string) => Number(item));
    let week = 0;
    let time1 = 0;
    const dots = result.map((time: number) => {
      // time值为0或1，0为default, 1为selected
      const result: DotTypes = {
        checked: time,
        week,
        time: time1,
      };
      time1 += 1;
      // 每半个小时一个值，一天48个值
      if (time1 === 48) {
        week += 1;
        time1 = 0;
      }
      return result;
    });
    dotsRef.current = dots;
    labelRef.current = dots2label(dots.filter((dot: DotTypes) => dot.checked));
    return dots;
  }, [value]);

  // 清空
  const handleClear = useCallback(
    () => {
      if (onChange) {
        onChange(defaultValue.current);
      }
    },
    [onChange],
  );
  // 选择完毕
  const handleSelectionFinish = useCallback(
    (selectedItems: any) => {
      // dom
      if (isEmpty(selectedItems)) {
        // 容错
        return;
      }
      // 已选中的dots
      const selectedDots = selectedItems.map((dom: any) => dom.props.data);
      const { onChange } = props;
      const result = dotsRef.current?.map((dot: DotTypes) => {
        if (selectedDots
          .find((item: any) => item.week === dot.week && item.time === dot.time)) {
          // 符合要求，取反
          return { ...dot, checked: dot.checked ? 0 : 1 };
        }
        return dot;
      }).map((dot: DotTypes) => dot.checked).join('');

      if (onChange) {
        onChange(result);
        selectionRef.current.clearSelection();
      }
    },
    [props],
  );
  return (
    <div className={`byted-weektime ${className}`} style={style}>
      <div className="byted-schedule byted-schedule-normal">
        <span />
        <div className="byted-schedule-calendar">
          {/* <!----> */}
          <div className="tableWrap">
            <SelectableGroup onSelectionFinish={handleSelectionFinish} ref={selectionRef}>
              <table className="byted-schedule-calendar-table">
                <thead>
                  <tr className="byted-schedule-calendar-time-all">
                    <th rowSpan={8} className="byted-schedule-week-td">星期/时间</th>
                    <th colSpan={24} className="byted-schedule-calendar-time">00:00 - 12:00</th>
                    <th colSpan={24} className="byted-schedule-calendar-time">12:00 - 24:00</th>
                  </tr>
                  <tr className="byted-schedule-calendar-time-item">
                    {
                      HOURS_REF.current
                        .map((hour: number) => <td colSpan={2} key={hour}>{hour}</td>)
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    WEEKS_REF.current.map((week: string, index: number) => (
                      <tr key={week}>
                        <td>
                          {week}
                        </td>
                        {
                          dots
                            .filter((dot: DotTypes) => dot.week === index)
                            .map((dot: DotTypes) => {
                              return (
                                <Dot data={dot} key={dot.time} />
                              );
                            })
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </SelectableGroup>
            <div style={{ padding: '0 12px 0 19px', marginTop: 1 }}>
              <div className="byted-schedule-table-tip">
                <div className="clearfix" style={{ margin: '8px 0' }}>
                  {
                    isEmpty(labelRef.current)
                      ? <p className="byted-schedule-no-selected-time">可拖动鼠标选择时间段</p>
                      : (
                        <>
                          <span className="pull-left byted-schedule-tip-text">已选择时间段</span>
                          <div className="pull-right byted-link byted-link-md" onClick={handleClear}>清空</div>
                        </>
                      )
                  }
                </div>
                <div className="byted-schedule-selected-time">
                  <div>
                    {
                      labelRef.current.map((labelItem: LabelTypes) => {
                        return (
                          <p key={labelItem.weekLabel}>
                            <span className="byted-schedule-tip-text">
                              {labelItem.weekLabel}
                            </span>
                            <span>{labelItem.timeLabel}</span>
                          </p>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bui-schedule-tooltip byted-popover-wrapper">
            <div className="bui-popper byted-popover" style={{ width: 'auto', display: 'none' }}>
              <div x-arrow="" className="bui-popover-arrow" style={{ left: 68 }} />
              <div className="bui-popover-panel">
                {/* <!----> */}
                <div className="bui-popover-body">
                  {/* <!----> */}
                </div>
                {/* <!----> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTable;
