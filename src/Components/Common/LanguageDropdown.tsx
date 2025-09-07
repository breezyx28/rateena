import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { get } from "lodash";

//i18n
import i18n from "../../i18n";
import languages from "../../common/languages";
import { t } from "i18next";

const LanguageDropdown = () => {
  // Declare a new state variable, which we'll call "menu"
  const [selectedLang, setSelectedLang] = useState("");

  useEffect(() => {
    const currentLanguage: any = localStorage.getItem("I18N_LANGUAGE");
    setSelectedLang(currentLanguage);
    // Set initial body direction
    updateBodyDirection(currentLanguage);
    // Load initial RTL styles if needed
    toggleRTLStyles(currentLanguage);
  }, []);

  const toggleRTLStyles = (lang: string) => {
    const existingRTL = document.getElementById("rtl-styles");

    if (lang === "ar") {
      // Add RTL styles if not already present
      if (!existingRTL) {
        const rtlLink = document.createElement("link");
        rtlLink.id = "rtl-styles";
        rtlLink.rel = "stylesheet";
        rtlLink.href = "/src/assets/scss/themes.scss";
        document.head.appendChild(rtlLink);
      }
    } else {
      // Remove RTL styles if present
      if (existingRTL) {
        existingRTL.remove();
      }
    }
  };

  const updateBodyDirection = (lang: string) => {
    const body = document.body;
    if (lang === "ar") {
      body.setAttribute("dir", "rtl");
    } else {
      body.setAttribute("dir", "ltr");
    }
  };

  const changeLanguageAction = (lang: any) => {
    //set language as i18n
    i18n.changeLanguage(lang);
    localStorage.setItem("I18N_LANGUAGE", lang);
    setSelectedLang(lang);
    // Update body direction when language changes
    updateBodyDirection(lang);
    // Toggle RTL styles when language changes
    toggleRTLStyles(lang);
  };

  const [isLanguageDropdown, setIsLanguageDropdown] = useState<boolean>(false);
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdown(!isLanguageDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isLanguageDropdown}
        toggle={toggleLanguageDropdown}
        className="ms-1 topbar-head-dropdown header-item"
      >
        <DropdownToggle
          className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
          tag="button"
        >
          <img
            src={get(languages, `${selectedLang}.flag`)}
            alt="Header Language"
            height="20"
            className="rounded"
          />
        </DropdownToggle>
        <DropdownMenu className="notify-item language py-2">
          {Object.keys(languages).map((key) => (
            <DropdownItem
              key={key}
              onClick={() => changeLanguageAction(key)}
              className={`notify-item ${
                selectedLang === key ? "active" : "none"
              }`}
            >
              <img
                src={get(languages, `${key}.flag`)}
                alt="Skote"
                className="me-2 rounded"
                height="18"
              />
              <span className="align-middle">
                {t(get(languages, `${key}.label`) ?? "")}
              </span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default LanguageDropdown;
