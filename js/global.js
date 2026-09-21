"use strict";


/* ==========================================================
   GLOBAL COMPONENT LOADER
========================================================== */


async function loadComponent(element) {

  const path = element.dataset.component;

  if (!path) {
    return;
  }


  try {

    const response = await fetch(path);


    if (!response.ok) {
      throw new Error(
        `Could not load component: ${path}`
      );
    }


    element.innerHTML = await response.text();


  } catch (error) {

    console.error(error);

  }

}



async function loadGlobalComponents() {

  const components = document.querySelectorAll(
    "[data-component]"
  );


  await Promise.all(
    [...components].map(loadComponent)
  );


  initialiseNavbar();

  setCurrentYear();

}



document.addEventListener(
  "DOMContentLoaded",
  loadGlobalComponents
);



/* ==========================================================
   NAVBAR
========================================================== */


function initialiseNavbar() {

  const navbar = document.querySelector(
    ".site-navbar"
  );


  if (!navbar) {
    return;
  }


  const updateNavbar = () => {

    navbar.classList.toggle(
      "navbar-scrolled",
      window.scrollY > 35
    );

  };


  updateNavbar();


  window.addEventListener(
    "scroll",
    updateNavbar,
    {
      passive: true
    }
  );


  /*
   Highlight current page.
  */

  const currentPage =
    window.location.pathname
      .split("/")
      .pop() || "index.html";


  navbar
    .querySelectorAll(".nav-link")
    .forEach(link => {

      const href = link
        .getAttribute("href")
        ?.split("/")
        .pop();


      if (
        href === currentPage ||
        (
          currentPage === "" &&
          href === "index.html"
        )
      ) {

        link.classList.add("active");

      }

    });

}



/* ==========================================================
   FOOTER YEAR
========================================================== */


function setCurrentYear() {

  document
    .querySelectorAll("[data-current-year]")
    .forEach(element => {

      element.textContent =
        new Date().getFullYear();

    });

}



/* ==========================================================
   COOKIE CONSENT
========================================================== */


const COOKIE_STORAGE_KEY =
  "lr_cookie_consent_v1";


document.addEventListener(
  "DOMContentLoaded",
  () => {

    const banner =
      document.getElementById("cookieBanner");

    const acceptButton =
      document.getElementById("cookieAccept");

    const rejectButton =
      document.getElementById("cookieReject");

    const saveButton =
      document.getElementById(
        "saveCookiePreferences"
      );

    const analyticsToggle =
      document.getElementById(
        "analyticsConsent"
      );


    if (!banner) {
      return;
    }


    const existingConsent =
      getCookieConsent();


    if (!existingConsent) {

      banner.hidden = false;

    } else {

      banner.hidden = true;

      if (analyticsToggle) {
        analyticsToggle.checked =
          existingConsent.analytics === true;
      }


      applyCookieConsent(
        existingConsent
      );

    }



    acceptButton?.addEventListener(
      "click",
      () => {

        saveCookieConsent({
          essential: true,
          analytics: true
        });


        banner.hidden = true;

      }
    );



    rejectButton?.addEventListener(
      "click",
      () => {

        saveCookieConsent({
          essential: true,
          analytics: false
        });


        banner.hidden = true;

      }
    );



    saveButton?.addEventListener(
      "click",
      () => {

        const consent = {
          essential: true,
          analytics:
            Boolean(
              analyticsToggle?.checked
            )
        };


        saveCookieConsent(consent);

        banner.hidden = true;


        const modalElement =
          document.getElementById(
            "cookiePreferencesModal"
          );


        if (modalElement) {

          const modal =
            bootstrap.Modal.getInstance(
              modalElement
            );


          modal?.hide();

        }

      }
    );

  }
);



function getCookieConsent() {

  try {

    const stored =
      localStorage.getItem(
        COOKIE_STORAGE_KEY
      );


    return stored
      ? JSON.parse(stored)
      : null;


  } catch {

    return null;

  }

}



function saveCookieConsent(consent) {

  localStorage.setItem(
    COOKIE_STORAGE_KEY,
    JSON.stringify({
      ...consent,
      updated:
        new Date().toISOString()
    })
  );


  applyCookieConsent(consent);

}



function applyCookieConsent(consent) {

  /*
   Add Google Analytics, Meta Pixel or other
   non-essential scripts HERE later.

   Example:

   if (consent.analytics) {
     loadAnalytics();
   }

   Nothing optional is currently loaded before
   consent, so Reject genuinely leaves analytics off.
  */

  if (!consent.analytics) {

    return;

  }

}

/* ==========================================================
   MOBILE CUSTOM SELECTS
========================================================== */


document.addEventListener(
  "DOMContentLoaded",
  initialiseMobileSelects
);



function initialiseMobileSelects() {

  const selects =
    document.querySelectorAll(
      ".quote-field select"
    );


  selects.forEach(
    (
      select,
      index
    ) => {

      /*
         Prevent duplicate setup.
      */

      if (
        select.dataset.mobileSelectReady ===
        "true"
      ) {

        return;

      }


      select.dataset.mobileSelectReady =
        "true";


      select.classList.add(
        "mobile-select-native"
      );



      /* ======================================================
         WRAPPER
      ====================================================== */

      const wrapper =
        document.createElement(
          "div"
        );


      wrapper.className =
        "mobile-select";



      /* ======================================================
         VISIBLE TRIGGER
      ====================================================== */

      const trigger =
        document.createElement(
          "button"
        );


      trigger.type =
        "button";


      trigger.className =
        "mobile-select-trigger";


      trigger.setAttribute(
        "aria-haspopup",
        "listbox"
      );


      trigger.setAttribute(
        "aria-expanded",
        "false"
      );


      const triggerValue =
        document.createElement(
          "span"
        );


      triggerValue.className =
        "mobile-select-trigger-value";


      const triggerIcon =
        document.createElement(
          "span"
        );


      triggerIcon.className =
        "mobile-select-trigger-icon";


      triggerIcon.setAttribute(
        "aria-hidden",
        "true"
      );


      triggerIcon.innerHTML =
        '<i class="bi bi-chevron-down"></i>';


      trigger.append(
        triggerValue,
        triggerIcon
      );



      /* ======================================================
         BACKDROP
      ====================================================== */

      const backdrop =
        document.createElement(
          "div"
        );


      backdrop.className =
        "mobile-select-backdrop";


      backdrop.setAttribute(
        "aria-hidden",
        "true"
      );



      /* ======================================================
         POPUP
      ====================================================== */

      const popup =
        document.createElement(
          "div"
        );


      popup.className =
        "mobile-select-popup";


      popup.setAttribute(
        "role",
        "dialog"
      );


      popup.setAttribute(
        "aria-modal",
        "true"
      );



      /* ======================================================
         POPUP HEADER
      ====================================================== */

      const header =
        document.createElement(
          "div"
        );


      header.className =
        "mobile-select-popup-header";


      const title =
        document.createElement(
          "p"
        );


      title.className =
        "mobile-select-popup-title";


      /*
         Get the visible field label automatically.
      */

      const field =
        select.closest(
          ".quote-field"
        );


      const label =
        field?.querySelector(
          "label"
        );


      title.textContent =
        label?.textContent.trim() ||
        "Select an option";


      const closeButton =
        document.createElement(
          "button"
        );


      closeButton.type =
        "button";


      closeButton.className =
        "mobile-select-close";


      closeButton.setAttribute(
        "aria-label",
        "Close options"
      );


      closeButton.innerHTML =
        '<i class="bi bi-x-lg" aria-hidden="true"></i>';


      header.append(
        title,
        closeButton
      );



      /* ======================================================
         OPTIONS
      ====================================================== */

      const optionsContainer =
        document.createElement(
          "div"
        );


      optionsContainer.className =
        "mobile-select-options";


      optionsContainer.setAttribute(
        "role",
        "listbox"
      );


      const optionButtons = [];



      Array.from(
        select.options
      ).forEach(
        option => {

          /*
             Skip placeholder / disabled options
             from the actual popup.
          */

          if (
            option.disabled ||
            option.value === ""
          ) {

            return;

          }


          const optionButton =
            document.createElement(
              "button"
            );


          optionButton.type =
            "button";


          optionButton.className =
            "mobile-select-option";


          optionButton.dataset.value =
            option.value;


          optionButton.setAttribute(
            "role",
            "option"
          );


          const text =
            document.createElement(
              "span"
            );


          text.textContent =
            option.textContent.trim();


          const check =
            document.createElement(
              "span"
            );


          check.className =
            "mobile-select-option-check";


          check.setAttribute(
            "aria-hidden",
            "true"
          );


          check.innerHTML =
            '<i class="bi bi-check2"></i>';


          optionButton.append(
            text,
            check
          );


          optionButton.addEventListener(
            "click",
            () => {

              select.value =
                option.value;


              /*
                 Trigger standard events so any
                 other JS still knows the field changed.
              */

              select.dispatchEvent(
                new Event(
                  "input",
                  {
                    bubbles: true
                  }
                )
              );


              select.dispatchEvent(
                new Event(
                  "change",
                  {
                    bubbles: true
                  }
                )
              );


              select.classList.remove(
                "is-invalid"
              );


              updateSelection();


              closePopup();

            }
          );


          optionButtons.push(
            optionButton
          );


          optionsContainer.append(
            optionButton
          );

        }
      );



      /* ======================================================
         BUILD
      ====================================================== */

      popup.append(
        header,
        optionsContainer
      );


      backdrop.append(
        popup
      );


      wrapper.append(
        trigger,
        backdrop
      );


      select.insertAdjacentElement(
        "afterend",
        wrapper
      );



      /* ======================================================
         SYNC VISIBLE VALUE
      ====================================================== */

      function updateSelection() {

        const selectedOption =
          select.options[
            select.selectedIndex
          ];


        const hasValue =
          Boolean(
            select.value
          );


        triggerValue.textContent =
          selectedOption
            ?.textContent
            ?.trim() ||
          "Select option";


        trigger.classList.toggle(
          "is-placeholder",
          !hasValue
        );


        optionButtons.forEach(
          optionButton => {

            const selected =
              optionButton.dataset.value ===
              select.value;


            optionButton.classList.toggle(
              "is-selected",
              selected
            );


            optionButton.setAttribute(
              "aria-selected",
              selected
                ? "true"
                : "false"
            );

          }
        );

      }



      /* ======================================================
         OPEN
      ====================================================== */

      function openPopup() {

        /*
           Custom popup only needed on mobile.
        */

        if (
          window.innerWidth > 767
        ) {

          return;

        }


        /*
           Close another dropdown first.
        */

        document
          .querySelectorAll(
            ".mobile-select-backdrop.is-open"
          )
          .forEach(
            openBackdrop => {

              if (
                openBackdrop !==
                backdrop
              ) {

                openBackdrop.classList.remove(
                  "is-open"
                );

              }

            }
          );


        backdrop.classList.add(
          "is-open"
        );


        backdrop.setAttribute(
          "aria-hidden",
          "false"
        );


        trigger.setAttribute(
          "aria-expanded",
          "true"
        );


        document.body.classList.add(
          "mobile-select-open"
        );


        /*
           If something is already selected,
           scroll that option into view.
        */

        const selectedButton =
          optionsContainer.querySelector(
            ".mobile-select-option.is-selected"
          );


        window.setTimeout(
          () => {

            selectedButton
              ?.scrollIntoView({
                block:
                  "nearest"
              });

          },
          40
        );

      }



      /* ======================================================
         CLOSE
      ====================================================== */

      function closePopup() {

        backdrop.classList.remove(
          "is-open"
        );


        backdrop.setAttribute(
          "aria-hidden",
          "true"
        );


        trigger.setAttribute(
          "aria-expanded",
          "false"
        );


        document.body.classList.remove(
          "mobile-select-open"
        );

      }



      /* ======================================================
         EVENTS
      ====================================================== */

      trigger.addEventListener(
        "click",
        openPopup
      );


      closeButton.addEventListener(
        "click",
        closePopup
      );


      /*
         Click outside popup.
      */

      backdrop.addEventListener(
        "click",
        event => {

          if (
            event.target ===
            backdrop
          ) {

            closePopup();

          }

        }
      );


      /*
         Escape key.
      */

      document.addEventListener(
        "keydown",
        event => {

          if (
            event.key ===
              "Escape" &&
            backdrop.classList.contains(
              "is-open"
            )
          ) {

            closePopup();

            trigger.focus();

          }

        }
      );


      /*
         Keep custom control synced if
         another script modifies the select.
      */

      select.addEventListener(
        "change",
        updateSelection
      );


      /*
         Your Web3Forms code calls form.reset()
         after successful submission.

         Sync the custom mobile field afterwards.
      */

      select.form?.addEventListener(
        "reset",
        () => {

          window.setTimeout(
            updateSelection,
            0
          );

        }
      );


      updateSelection();

    }
  );

}