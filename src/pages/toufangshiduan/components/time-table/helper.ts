import { isEmpty } from 'lodash';
import { DotTypes, LabelTypes } from './data';

export const dots2label = (dots: DotTypes[]) => {
  return dots.reduce((total: LabelTypes[], current: DotTypes) => {
    const last: LabelTypes = total.length > 0 ? total[total.length - 1] : {};
    const currentTime = [current.time, current.time + 1];
    if (last.week !== current.week) {
      const value = {
        week: current.week,
        weekLabel: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'][current.week],
        time: [currentTime],
      };
      total.push(value);
    } else {
      const { time = [] } = last;
      const arrIndex = time
        ?.findIndex((t: number[]) => current.time >= t[0] && current.time <= t[1]) ?? -1;
      if (arrIndex >= 0) {
        const [min, max] = time[arrIndex];
        const min1 = Math.min(min, currentTime[0]);
        const max1 = Math.max(max, currentTime[1]);
        time[arrIndex] = [min1, max1];
      } else {
        time.push(currentTime);
      }
      const time1 = time.reduce((total: number[][], current: number[]) => {
        let last = total.length ? total[total.length - 1] : [];
        if (isEmpty(last)) {
          total.push(current);
        } else if (current[0] > last[1]) {
          // 没交集的情况
          // current一定比last大
          // 没有交集
          total.push(current);
        } else {
          // 有交集，合并
          const min = Math.min(current[0], last[0]);
          const max = Math.max(current[1], last[1]);
          last = [min, max];
        }
        return total;
      }, []);
      last.time = time1;
    }
    return total.map((item: LabelTypes) => ({
      ...item,
      timeLabel: item.time
        ?.map((time: number[]) => {
          const [min, max] = time;
          return `${num2hour(min)}~${num2hour(max)}`;
        }).join('、'),
    }));
  }, []);
};

/**
 * 0 - 00:00
 * 1 - 00:30
 * 2 - 01:00
 * @param num
 */
const num2hour = (num: number) => {
  let res = num;
  if (num % 2 === 0) {
    // 偶数
    res = num / 2;
    if (res < 10) {
      return `0${res}:00`;
    }
    return `${res}:00`;
  }
  // 奇数
  res = Math.floor(num / 2);
  if (res < 10) {
    return `0${res}:30`;
  }
  return `${res}:30`;
};
