import { isEmpty } from 'lodash';
import { DotType } from './data';

const defaultData = [
  {
    timeSpanList: [
      {
        time: '00:00-24:00',
        discount: 0,
      },
    ],
  },
  {
    timeSpanList: [
      {
        time: '00:00-24:00',
        discount: 0,
      },
    ],
  },
  {
    timeSpanList: [
      {
        time: '00:00-24:00',
        discount: 0,
      },
    ],
  },
  {
    timeSpanList: [
      {
        time: '00:00-24:00',
        discount: 0,
      },
    ],
  },
  {
    timeSpanList: [
      {
        time: '00:00-24:00',
        discount: 0,
      },
    ],
  },
  {
    timeSpanList: [
      {
        time: '00:00-24:00',
        discount: 0,
      },
    ],
  },
  {
    timeSpanList: [
      {
        time: '00:00-24:00',
        discount: 0,
      },
    ],
  },
];

// 默认星期数组
export const WEEKS = [
  {
    week: 1,
    name: '一',
    fullName: '星期一',
  },
  {
    week: 2,
    name: '二',
    fullName: '星期二',
  },
  {
    week: 3,
    name: '三',
    fullName: '星期三',
  },
  {
    week: 4,
    name: '四',
    fullName: '星期四',
  },
  {
    week: 5,
    name: '五',
    fullName: '星期五',
  },
  {
    week: 6,
    name: '六',
    fullName: '星期六',
  },
  {
    week: 7,
    name: '七',
    fullName: '星期七',
  }];

// 默认小时数组
export const HOURS = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
];

// 前面加零
function addZero(num: number) {
  if (num > 9) {
    return num;
  }
  return `${0}${num}`;
}

// 获取空的dots
export function getEmptyDots() {
  const arr: any[] = [];
  WEEKS.forEach((week: any) => {
    HOURS.forEach((hour: any) => {
      arr.push({
        id: `w${week.week}-${hour}`,
        week: week.week,
        hour,
        isSelect: false,
        radioType: 1,
        discount: 0,
      });
    });
  });
  return arr;
}

let defaultLaunchPeriodStr: string;

export function getDefaultLaunchPeriod() {
  return defaultLaunchPeriodStr;
}

// 获取默认的dots
export function getDefaultDots(defaultLaunchPeriod: string) {
  // console.log('getDefaultDots', defaultLaunchPeriod);
  if (defaultLaunchPeriod) {
    defaultLaunchPeriodStr = defaultLaunchPeriod;
    let data = [];
    try {
      data = JSON.parse(defaultLaunchPeriod);
    } catch (error) {
      console.error(error);
    }
    // console.log('data', data);
    return data2dot(data);
  }
  return data2dot(defaultData);
}

// data转dot
export function data2dot(data: any) {
  const defaultDots = getEmptyDots();
  if (isEmpty(data)) {
    return defaultDots;
  }
  const finalDefaultDots = defaultDots.map((_dot) => {
    const dot = { ..._dot };
    const week = data[dot.week - 1];
    const item = week.timeSpanList.find((timeSpan: any) => {
      // [0-9]:[9-12]:[12-24]
      const hours = timeSpan.time.split('-');
      const start = Number(hours[0].split(':')[0]);
      const end = Number(hours[1].split(':')[0]);
      // 0-1:实际是0点；1-3：实际是1点和2点，也就是含头不含尾
      const result = dot.hour >= start && dot.hour < end;
      return result;
    });
    // console.log('----', dot, item);
    if (!item) {
      dot.discount = 0;
    } else {
      dot.discount = item.discount;
    }
    return dot;
  });
  return finalDefaultDots;
}

// dot转data
export function dot2data(dots: any) {
  const initialData: any = [];
  return dots.reduce((total: any, currentDot: any) => {
    // 当前的data
    const currentData = total[currentDot.week - 1];
    if (isEmpty(currentData)) {
      // 还没有，初始化
      return [
        ...total,
        {
          // 结束的hour要加1
          timeSpanList: [{ time: `${addZero(currentDot.hour)}:00-${addZero(currentDot.hour + 1)}:00`, discount: currentDot.discount }],
        }];
    }
    // 前几个data
    const restData = total.slice(0, total.length - 1);
    // 当前的time
    const lastItem = currentData.timeSpanList[currentData.timeSpanList.length - 1];
    // 前几个
    const restItem = currentData.timeSpanList.slice(0, currentData.timeSpanList.length - 1);
    if (lastItem.discount === currentDot.discount) {
      // 相邻的discount相同，改结束时间
      const hours = lastItem.time.split('-');
      return [...restData, { timeSpanList: [...restItem, { ...lastItem, time: `${hours[0]}-${addZero(currentDot.hour + 1)}:00` }] }];
    }
    // 相邻的discount不同，新增一个
    return [
      ...restData,
      {
        timeSpanList: [
          ...currentData.timeSpanList,
          { time: `${addZero(currentDot.hour)}:00-${addZero(currentDot.hour + 1)}:00`, discount: currentDot.discount }],
      }];
  }, initialData);
}

// dot转data
// export function dot2data1(dots: any) {
// const arr = [];
// for (let week = 1; week <= weeks.length; week += 1) {
//   const timeSpanList: any[] = [];
//   const obj = { timeSpanList };
//   let pre: any = dots[(week - 1) * 24];
//   let preValue = [pre.hour];
//   for (let hour = 1; hour < 24; hour += 1) {
//     const dot: any = dots[(week - 1) * 24 + hour];
//     // console.log('dot&pre', pre, dot)
//     if (dot.discount === pre.discount) {
//       preValue.push(dot.hour);
//       if (hour === hours.length - 1) {
//         // 最后一个
//         // console.log('最后一个', preValue);
//         obj.timeSpanList.push({
//           time:
//             preValue.length === 1
//               ? `${addZero(preValue[0])}:00-${addZero(preValue[0] + 1)}:00`
//               : `${addZero(preValue[0])}:00-${addZero(preValue[preValue.length - 1] + 1)}:00`,
//           discount: dot.discount,
//         });
//       }
//     } else {
//       // console.log('111', preValue);
//       obj.timeSpanList.push({
//         time:
//           preValue.length === 1
//             ? `${addZero(preValue[0])}:00-${addZero(preValue[0] + 1)}:00`
//             : `${addZero(preValue[0])}:00-${addZero(preValue[preValue.length - 1] + 1)}:00`,
//         discount: pre.discount || 0,
//       });
//       pre = dot;
//       preValue = [dot.hour];
//       if (hour === hours.length - 1) {
//         // 最后一个
//         obj.timeSpanList.push({
//           time:
//             preValue.length === 1
//               ? `${addZero(preValue[0])}:00-${addZero(preValue[0] + 1)}:00`
//               : `${addZero(preValue[0])}:00-${addZero(preValue[preValue.length - 1] + 1)}:00`,
//           discount: pre.discount || 0,
//         });
//       }
//     }
//   }
//   arr.push(obj);
// }
// return arr;
// }

// 计算元素的left

export function handleGetBgColor(discount: number) {
  if (discount >= 30 && discount <= 100) {
    // 30-0.05;40-0.1;50-0.15;100-0.4
    return `rgba(97,199,242,${(discount / 10 - 3) * 0.05 + 0.05})`;
  }
  if (discount > 100 && discount < 200) {
    // 110-0.2;120-0.25;190-0.6
    return `rgba(77,166,255,${(discount / 10 - 2) * 0.05 + 0.2})`;
  }
  if (discount >= 200 && discount <= 250) {
    // 200-0.3;210-0.35;250-0.55
    return `rgba(134,115,230,${(discount / 10 - 2) * 0.05 + 0.3})`;
  }
  // 0 和 其他
  return '#ffffff';
}

export function getStartDot(dotList: DotType[]) {
  const minWeek = isEmpty(dotList)
    ? 1
    : Math.min(...(dotList.map((item: DotType) => (item.week || 1))));
  const minHour = isEmpty(dotList)
    ? 0
    : Math.min(...(dotList.map((item: DotType) => (item.hour || 0))));

  return dotList.find((item: DotType) => item.week === minWeek && item.hour === minHour);
}

export function getEndDot(dotList: DotType[]) {
  const maxWeek = isEmpty(dotList)
    ? 1
    : Math.max(...(dotList.map((item: DotType) => (item.week || 1))));
  const maxHour = isEmpty(dotList)
    ? 0
    : Math.max(...(dotList.map((item: DotType) => (item.hour || 0))));

  return dotList.find((item: DotType) => item.week === maxWeek && item.hour === maxHour);
}
