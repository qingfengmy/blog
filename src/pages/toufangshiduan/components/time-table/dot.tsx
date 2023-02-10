import React from 'react';
import { createSelectable } from 'react-selectable-fast';

const Dot = (props: any) => {
  const {
    selectableRef, data = {}, isSelecting, isSelected,
  } = props;
  let className = '';
  if (isSelecting) {
    className = 'byted-schedule-calendar-hovered';
  } else if (isSelected || data.checked) {
    className = 'byted-schedule-calendar-selected';
  }
  return (
    <td
      ref={selectableRef}
      key={data.time}
      data-week={data.week}
      data-time={data.time}
      className={`byted-schedule-calendar-atom-time ${className}`}
    />
  );
};

export default createSelectable(Dot);
