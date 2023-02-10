import React from 'react';
import { createSelectable } from 'react-selectable-fast';
import styles from './index.less';
import { handleGetBgColor } from './helper';

const Dot = (props: any) => {
  const { selectableRef, item, isSelecting, isSelected, ...others } = props;
  return (
    <li
      ref={selectableRef}
      key={item.id}
      className={styles.dotItem}
      style={{
        width: 31,
        height: 40,
        backgroundColor: handleGetBgColor(item.discount),
      }}
      {...others}
    />
  );
};

export default createSelectable<any>(Dot);
