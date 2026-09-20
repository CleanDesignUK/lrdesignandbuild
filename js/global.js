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