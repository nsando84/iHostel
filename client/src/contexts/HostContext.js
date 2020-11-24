import React, { createContext, useState } from 'react';

export const HostContext = createContext()
export const HostContextProvider = (props) => {
    const [host, setHost] = useState({
        price: null,
        description: null,
        title: null,
        address: {
            addressOne: null,
            addressTwo: null,
            city: null,
            state: null,
            zip: null
        },
        images: [],
        dates: [],
    })

    return (
        <HostContext.Provider value={{ host, setHost}}>
            {props.children}
        </HostContext.Provider>
    )

}

export default HostContext