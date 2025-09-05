import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useTranslation } from 'react-i18next';
const NonAuthLayout = ({ children }: any) => {
    const { i18n } = useTranslation();
    const selectLayoutState = (state: any) => state.Layout;
    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (layout) => ({
            layoutThemeType: layout.layoutThemeType,
            layoutModeType: layout.layoutModeType,
        })
    );
    // Inside your component
    const {
        layoutModeType,
        layoutThemeType,
    } = useSelector(selectLayoutProperties);
    useEffect(() => {
        document.body.setAttribute("data-theme", layoutThemeType);
        document.body.setAttribute("dir", i18n.language === 'ar' ? 'rtl' : 'ltr');
        if (layoutModeType === "dark") {
            document.body.setAttribute("data-bs-theme", "dark");
        } else {
            document.body.setAttribute("data-bs-theme", "light");
        }
        return () => {
            document.body.removeAttribute("data-bs-theme");
            document.body.removeAttribute("data-theme");
            document.body.removeAttribute("dir");
        };
    }, [layoutModeType, layoutThemeType, i18n.language]);
    return (
        <div>
            {children}
        </div>
    )
}
export default NonAuthLayout