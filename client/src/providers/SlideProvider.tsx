"use client"

import React, { createContext, useState } from 'react'

type ChildrenType = {
    children: React.ReactNode
}

type ValueType = {
    toggleSide: boolean,
    setToggleSide: React.Dispatch<React.SetStateAction<boolean>>
}

const SliderContext = createContext<ValueType | null>(null);
const SlideProvider = ({ children }: ChildrenType) => {

    const [toggleSide, setToggleSide] = useState(false);

    const value: ValueType = {
        // state
        toggleSide,


        // setter
        setToggleSide,
    }

    return (
        <SliderContext.Provider value={value} >
            {children}
        </SliderContext.Provider>
    )
}

export const useSlider = () => {
    const context = React.useContext(SliderContext);
    if (!context) {
        throw new Error("useSlider must be used inside SlideProvider");
    }
    return context;
};

export default SlideProvider