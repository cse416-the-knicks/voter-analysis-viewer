type CssUnit = 'px' | 'em' | 'rem' | 'vw' | 'vh' | '%';
type CssUnitValue = `${number}${CssUnit}`;

export type {
    CssUnitValue,
    CssUnit
};
