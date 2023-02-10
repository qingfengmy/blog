export type PropTypes = {
    value: any,
    onChange: any,
    style?: any,
    className?: any,
};

export type DotTypes = {
    week: number,
    time: number,
    checked?: number,
};

export type LabelTypes = {
    week?: number,
    time?: number[][], // [[0,1],[3,4]]
    weekLabel?: string,
    timeLabel?: string,
};
