import React, { useMemo, Children } from "react";

export const Series = ({ length, data=[], component, isZeroPrefixed }) => {
    const dataArr = useMemo(() => data?.length ? data : Array(length).fill(true), [length, data]);
    
    return Children.map(dataArr, (val, ind) => {
        const zeroOrEmpty = ind.toString().length == 1 && isZeroPrefixed ? '0' : '';
        const selectedVal = data?.length ? val : ind;
        const finalValue = `${zeroOrEmpty}${selectedVal}`;
        
        return component(finalValue, ind);
    })
};