import { useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";

const currentFocus: focusType = true;

let globalGetHidden = () => {
    return false; // on init should return false
};

export const useWindowFocused = singletonHook(currentFocus, () => {
    const currentFocus = document.hidden;

    const [hidden, setHidden] = useState<focusType>(currentFocus);

    useEffect(() => {
        const tabListener = function () {
            setHidden(document.hidden);
        };
        window.addEventListener("visibilitychange", tabListener);

        return () => {
            window.removeEventListener("visibilitychange", tabListener);
        }
    }, [])
    //@ts-ignore
    globalGetHidden = () => {
        return hidden;
    };
    return hidden;
});

export type focusType = true | false;
export const getTabHidden = () => {
    return globalGetHidden();
}
// export const getStoredValue = () => window.localStorage.getItem('currency') as currencyType || initCurrency
