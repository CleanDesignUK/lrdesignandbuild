"use strict";


/* ==========================================================
   FORM INITIALISATION
========================================================== */


document.addEventListener(
  "DOMContentLoaded",
  () => {

    initialiseForms();

    initialiseHorizontalRails();

  }
);



function initialiseForms() {

  const forms =
    document.querySelectorAll(
      ".web3form"
    );


  forms.forEach(form => {

    const startedAt =
      form.querySelector(
        'input[name="started_at"]'
      );


    if (startedAt) {

      startedAt.value =
        Date.now().toString();

    }


    form.addEventListener(
      "submit",
      handleFormSubmission
    );

  });

}



/* ==========================================================
   EMAIL VALIDATION
========================================================== */


function isValidEmail(email) {

  const cleaned =
    email.trim().toLowerCase();


  /*
   Reasonably strict browser-side format check.
   This verifies structure, not whether the mailbox
   itself genuinely exists.
  */

  const pattern =
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;


  if (!pattern.test(cleaned)) {
    return false;
  }


  const domain =
    cleaned.split("@")[1];


  if (!domain) {
    return false;
  }


  const extension =
    domain.split(".").pop();


  if (
    !extension ||
    extension.length < 2
  ) {

    return false;

  }


  /*
   Reject obvious dummy values.
  */

  const invalidEmails = [
    "test@test.com",
    "test@example.com",
    "example@example.com",
    "email@email.com",
    "fake@fake.com"
  ];


  if (
    invalidEmails.includes(cleaned)
  ) {

    return false;

  }


  return true;

}



/* ==========================================================
   PHONE VALIDATION
========================================================== */


function isValidPhone(phone) {

  const raw =
    phone.trim();


  /*
   Allow +, spaces, brackets and hyphens only.
  */

  if (
    !/^[+\d\s()-]+$/.test(raw)
  ) {

    return false;

  }


  const digits =
    raw.replace(/\D/g, "");


  /*
   UK and international plausible length.
  */

  if (
    digits.length < 9 ||
    digits.length > 15
  ) {

    return false;

  }


  /*
   Reject repeated digit 4 or more times.
   Examples:
   0000
   1111
   77777
  */

  if (
    /(\d)\1{3,}/.test(digits)
  ) {

    return false;

  }


  /*
   Reject one repeated digit across
   the entire number.
  */

  if (
    /^(\d)\1+$/.test(digits)
  ) {

    return false;

  }


  /*
   Reject obvious sequences.
  */

  const obviousSequences = [
    "0123456789",
    "1234567890",
    "123456789",
    "987654321",
    "0987654321"
  ];


  if (
    obviousSequences.some(
      sequence =>
        digits.includes(sequence)
    )
  ) {

    return false;

  }


  return true;

}



/* ==========================================================
   FIELD ERROR HANDLING
========================================================== */


function markInvalid(
  field,
  message
) {

  field.classList.add(
    "is-invalid"
  );


  field.focus();


  Swal.fire({
    icon: "warning",
    title: "Please check your details",
    text: message,
    confirmButtonText: "Okay",
    confirmButtonColor: "#90f7f9",
    background: "#0d0d0d",
    color: "#ffffff"
  });

}



function clearInvalidState(form) {

  form
    .querySelectorAll(
      ".is-invalid"
    )
    .forEach(field => {

      field.classList.remove(
        "is-invalid"
      );

    });

}



/* ==========================================================
   WEB3FORMS SUBMISSION
========================================================== */


async function handleFormSubmission(event) {

  event.preventDefault();


  const form =
    event.currentTarget;


  clearInvalidState(form);


  const accessKey =
    form.querySelector(
      'input[name="access_key"]'
    )?.value.trim();


  if (
    !accessKey ||
    accessKey ===
      "YOUR_WEB3FORMS_ACCESS_KEY"
  ) {

    Swal.fire({
      icon: "info",
      title: "Form setup required",
      text: "Add your Web3Forms access key before publishing the website.",
      confirmButtonText: "Okay",
      confirmButtonColor: "#90f7f9",
      background: "#0d0d0d",
      color: "#ffffff"
    });

    return;

  }



  const nameField =
    form.querySelector(
      'input[name="name"]'
    );

  const emailField =
    form.querySelector(
      'input[name="email"]'
    );

  const phoneField =
    form.querySelector(
      'input[name="phone"]'
    );

  const locationField =
    form.querySelector(
      'input[name="project_location"]'
    );

  const projectTypeField =
    form.querySelector(
      '[name="project_type"]'
    );

  const planningField =
    form.querySelector(
      '[name="planning_status"]'
    );

  const timescaleField =
    form.querySelector(
      '[name="timescale"]'
    );

  const messageField =
    form.querySelector(
      '[name="message"]'
    );



  /*
   Native required validation.
  */

  if (!form.checkValidity()) {

    const firstInvalid =
      form.querySelector(
        ":invalid"
      );


    if (firstInvalid) {

      markInvalid(
        firstInvalid,
        "Please complete all required fields before submitting your enquiry."
      );

    }


    return;

  }



  /*
   Name.
  */

  if (
    !nameField ||
    nameField.value.trim().length < 2
  ) {

    markInvalid(
      nameField,
      "Please enter your name."
    );

    return;

  }



  /*
   Email.
  */

  if (
    !emailField ||
    !isValidEmail(
      emailField.value
    )
  ) {

    markInvalid(
      emailField,
      "Please enter a valid email address."
    );

    return;

  }



  /*
   Phone.
  */

  if (
    !phoneField ||
    !isValidPhone(
      phoneField.value
    )
  ) {

    markInvalid(
      phoneField,
      "Please enter a valid phone number. Repeated or obviously fake numbers cannot be submitted."
    );

    return;

  }



  /*
   Location.
  */

  if (
    !locationField ||
    locationField.value
      .trim()
      .length < 2
  ) {

    markInvalid(
      locationField,
      "Please enter the town or postcode for the project."
    );

    return;

  }



  /*
   Project fields.
  */

  if (
    !projectTypeField?.value
  ) {

    markInvalid(
      projectTypeField,
      "Please select the type of project."
    );

    return;

  }


  if (
    !planningField?.value
  ) {

    markInvalid(
      planningField,
      "Please tell us the current planning or drawings status."
    );

    return;

  }


  if (
    !timescaleField?.value
  ) {

    markInvalid(
      timescaleField,
      "Please select your preferred project timescale."
    );

    return;

  }



  /*
   Message.
  */

  if (
    !messageField ||
    messageField.value
      .trim()
      .length < 10
  ) {

    markInvalid(
      messageField,
      "Please provide a short description of the work you are considering."
    );

    return;

  }



  /*
   Basic bot timing protection.

   Genuine humans are unlikely to complete
   the entire form in under 3 seconds.
  */

  const startedAt =
    Number(
      form.querySelector(
        'input[name="started_at"]'
      )?.value
    );


  if (
    startedAt &&
    Date.now() - startedAt < 3000
  ) {

    Swal.fire({
      icon: "warning",
      title: "Please try again",
      text: "The form was submitted too quickly.",
      confirmButtonColor: "#90f7f9",
      background: "#0d0d0d",
      color: "#ffffff"
    });

    return;

  }



  const submitButton =
    form.querySelector(
      'button[type="submit"]'
    );


  const originalButtonText =
    submitButton?.textContent;


  if (submitButton) {

    submitButton.disabled = true;

    submitButton.textContent =
      "Sending...";

  }



  try {

    const formData =
      new FormData(form);


    const response =
      await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: formData
        }
      );


    const result =
      await response.json();



    if (
      response.ok &&
      result.success
    ) {

      await Swal.fire({
        icon: "success",
        title: "Thank you!",
        text: "Our team will be in touch with you soon.",
        confirmButtonText: "Close",
        confirmButtonColor: "#90f7f9",
        background: "#0d0d0d",
        color: "#ffffff"
      });


      form.reset();


      const startedField =
        form.querySelector(
          'input[name="started_at"]'
        );


      if (startedField) {

        startedField.value =
          Date.now().toString();

      }


    } else {

      throw new Error(
        result.message ||
        "Submission failed"
      );

    }


  } catch (error) {

    console.error(error);


    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: "We couldn't send your enquiry. Please try again or contact L&R Design & Build directly.",
      confirmButtonText: "Okay",
      confirmButtonColor: "#90f7f9",
      background: "#0d0d0d",
      color: "#ffffff"
    });


  } finally {

    if (submitButton) {

      submitButton.disabled = false;

      submitButton.textContent =
        originalButtonText;

    }

  }

}



/* ==========================================================
   MOBILE HORIZONTAL RAILS
========================================================== */


function initialiseHorizontalRails() {

  document
    .querySelectorAll(
      "[data-scroll-target]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const targetId =
            button.dataset.scrollTarget;

          const direction =
            Number(
              button.dataset.direction
            ) || 1;

          const rail =
            document.getElementById(
              targetId
            );


          if (!rail) {
            return;
          }


          const card =
            rail.firstElementChild;


          const amount =
            card
              ? card.getBoundingClientRect().width + 12
              : rail.clientWidth * 0.85;


          rail.scrollBy({
            left:
              amount * direction,
            behavior: "smooth"
          });

        }
      );

    });

}

/* ==========================================================
   ABOUT CARDS
   DESKTOP SLOW SCROLL SPREAD
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const stage =
    document.getElementById("aboutCardStage");


  if (!stage) {
    return;
  }


  const leftCard =
    stage.querySelector(
      '[data-about-card="left"]'
    );


  const centreCard =
    stage.querySelector(
      '[data-about-card="centre"]'
    );


  const rightCard =
    stage.querySelector(
      '[data-about-card="right"]'
    );


  if (
    !leftCard ||
    !centreCard ||
    !rightCard
  ) {
    return;
  }


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  let ticking = false;



  /* ========================================================
     HELPERS
  ======================================================== */

  const clamp = (
    value,
    min,
    max
  ) => {

    return Math.min(
      Math.max(value, min),
      max
    );

  };


  const lerp = (
    start,
    end,
    progress
  ) => {

    return (
      start +
      (
        end - start
      ) *
      progress
    );

  };


  /*
    Smoothstep makes the movement slower
    at the beginning and the end.

    This feels much more deliberate than
    immediately throwing the cards apart.
  */

  const smoothstep = (progress) => {

    return (
      progress *
      progress *
      (
        3 -
        2 * progress
      )
    );

  };



  /* ========================================================
     FINAL DESKTOP POSITION
  ======================================================== */

  const setFinalPositions = () => {

    if (window.innerWidth < 992) {

      leftCard.style.transform = "";
      centreCard.style.transform = "";
      rightCard.style.transform = "";

      return;
    }


    const cardWidth =
      centreCard.getBoundingClientRect().width;


    const gap = 20;


    const spread =
      cardWidth + gap;


    leftCard.style.transform =
      `
        translateX(
          calc(-50% - ${spread}px)
        )
        translateY(0)
        rotate(0deg)
        scale(1)
      `;


    centreCard.style.transform =
      `
        translateX(-50%)
        translateY(0)
        rotate(0deg)
        scale(1)
      `;


    rightCard.style.transform =
      `
        translateX(
          calc(-50% + ${spread}px)
        )
        translateY(0)
        rotate(0deg)
        scale(1)
      `;

  };



  /* ========================================================
     SCROLL ANIMATION
  ======================================================== */

  const animateCards = () => {

    ticking = false;


    /*
      Desktop only.
    */

    if (window.innerWidth < 992) {

      leftCard.style.transform = "";
      centreCard.style.transform = "";
      rightCard.style.transform = "";

      return;
    }


    if (reducedMotion.matches) {

      setFinalPositions();

      return;
    }


    const rect =
      stage.getBoundingClientRect();


    const viewportHeight =
      window.innerHeight;



    /*
      IMPORTANT:

      Previously this started at around 92%
      of the viewport, which was too early.

      Now the cards have to travel much further
      into the viewport before they move.

      START:
      stage top reaches 66% down the viewport.

      END:
      stage top reaches about 2% from the top.

      This means the user sees the stacked cards,
      scrolls further, and THEN watches them spread.
    */

    const animationStart =
      viewportHeight * 0.66;


    const animationEnd =
      viewportHeight * 0.02;



    /*
      Convert scroll position to 0 → 1.
    */

    const rawProgress =
      (
        animationStart -
        rect.top
      ) /
      (
        animationStart -
        animationEnd
      );


    const progress =
      clamp(
        rawProgress,
        0,
        1
      );



    /*
      Slower, smoother movement.
    */

    const eased =
      smoothstep(progress);



    /*
      Calculate exact final spread.

      At 100% progress:
      all three cards have the same width,
      no rotation and a 20px gap.
    */

    const cardWidth =
      centreCard.getBoundingClientRect().width;


    const gap = 20;


    const finalSpread =
      cardWidth + gap;



    /* ======================================================
       LEFT CARD
    ====================================================== */

    const leftOffset =
      lerp(
        -22,
        -finalSpread,
        eased
      );


    const leftY =
      lerp(
        58,
        0,
        eased
      );


    const leftRotation =
      lerp(
        -5,
        0,
        eased
      );


    const leftScale =
      lerp(
        0.94,
        1,
        eased
      );


    leftCard.style.transform =
      `
        translateX(
          calc(-50% + ${leftOffset}px)
        )
        translateY(${leftY}px)
        rotate(${leftRotation}deg)
        scale(${leftScale})
      `;



    /* ======================================================
       CENTRE CARD
    ====================================================== */

    const centreY =
      lerp(
        26,
        0,
        eased
      );


    const centreScale =
      lerp(
        1.025,
        1,
        eased
      );


    centreCard.style.transform =
      `
        translateX(-50%)
        translateY(${centreY}px)
        scale(${centreScale})
      `;



    /* ======================================================
       RIGHT CARD
    ====================================================== */

    const rightOffset =
      lerp(
        22,
        finalSpread,
        eased
      );


    const rightY =
      lerp(
        58,
        0,
        eased
      );


    const rightRotation =
      lerp(
        5,
        0,
        eased
      );


    const rightScale =
      lerp(
        0.94,
        1,
        eased
      );


    rightCard.style.transform =
      `
        translateX(
          calc(-50% + ${rightOffset}px)
        )
        translateY(${rightY}px)
        rotate(${rightRotation}deg)
        scale(${rightScale})
      `;

  };



  /* ========================================================
     REQUEST FRAME
  ======================================================== */

  const requestAnimation = () => {

    if (ticking) {
      return;
    }


    ticking = true;


    window.requestAnimationFrame(
      animateCards
    );

  };



  /* ========================================================
     EVENTS
  ======================================================== */

  window.addEventListener(
    "scroll",
    requestAnimation,
    {
      passive: true
    }
  );


  window.addEventListener(
    "resize",
    requestAnimation
  );


  reducedMotion.addEventListener?.(
    "change",
    requestAnimation
  );


  /*
    Calculate initial state immediately.
  */

  requestAnimation();

});

/* ==========================================================
   PROJECT GALLERY
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const mainImage =
    document.getElementById(
      "projectGalleryMainImage"
    );


  const mainCategory =
    document.getElementById(
      "projectGalleryCategory"
    );


  const mainTitle =
    document.getElementById(
      "projectGalleryImageTitle"
    );


  const galleryMain =
    document.querySelector(
      ".project-gallery-main"
    );


  const projectButtons =
    document.querySelectorAll(
      ".project-gallery-project"
    );


  const thumbnails =
    document.querySelectorAll(
      ".project-gallery-thumb"
    );


  if (
    !mainImage ||
    !mainCategory ||
    !mainTitle ||
    !galleryMain
  ) {
    return;
  }


  const projects = {

    extension: {
      image:
        "https://images.pexels.com/photos/8134821/pexels-photo-8134821.jpeg?auto=compress&cs=tinysrgb&w=1800",

      category:
        "HOUSE EXTENSION",

      title:
        "Double-Storey House Extension",

      alt:
        "Contemporary house extension project"
    },


    "new-build": {
      image:
        "https://images.pexels.com/photos/9976121/pexels-photo-9976121.jpeg?auto=compress&cs=tinysrgb&w=1800",

      category:
        "NEW BUILD HOME",

      title:
        "New Build Construction",

      alt:
        "Contemporary new build residential property"
    },


    external: {
      image:
        "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1800",

      category:
        "EXTERIOR IMPROVEMENTS",

      title:
        "Driveways & Property Improvements",

      alt:
        "Residential exterior and driveway improvement project"
    }

  };


  const selectProject = (key) => {

    const project =
      projects[key];


    if (!project) {
      return;
    }


    galleryMain.classList.add(
      "is-changing"
    );


    window.setTimeout(() => {

      mainImage.src =
        project.image;


      mainImage.alt =
        project.alt;


      mainCategory.textContent =
        project.category;


      mainTitle.textContent =
        project.title;


      galleryMain.classList.remove(
        "is-changing"
      );

    }, 160);


    projectButtons.forEach(
      button => {

        const active =
          button.dataset.project === key;


        button.classList.toggle(
          "active",
          active
        );


        button.setAttribute(
          "aria-pressed",
          active
            ? "true"
            : "false"
        );

      }
    );


    thumbnails.forEach(
      button => {

        const active =
          button.dataset.project === key;


        button.classList.toggle(
          "active",
          active
        );


        button.setAttribute(
          "aria-pressed",
          active
            ? "true"
            : "false"
        );

      }
    );

  };


  projectButtons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          selectProject(
            button.dataset.project
          );

        }
      );

    }
  );


  thumbnails.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          selectProject(
            button.dataset.project
          );

        }
      );

    }
  );

});

/* ==========================================================
   CUSTOMER REVIEWS
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const panel =
    document.getElementById("reviewsPanel");


  if (!panel) {
    return;
  }


  const slides =
    Array.from(
      panel.querySelectorAll(
        "[data-review-slide]"
      )
    );


  const previousButton =
    document.getElementById(
      "reviewsPrev"
    );


  const nextButton =
    document.getElementById(
      "reviewsNext"
    );

 if (
  !slides.length ||
  !previousButton ||
  !nextButton
) {
  return;
}

  let currentIndex = 0;



  /* ========================================================
     RESET ONE REVIEW
  ======================================================== */

  const collapseReview = (slide) => {

    slide.classList.remove(
      "is-expanded"
    );


    const button =
      slide.querySelector(
        ".review-read-toggle"
      );


    const copy =
      slide.querySelector(
        ".review-copy"
      );


    if (button) {

      button.textContent =
        "Read more";


      button.setAttribute(
        "aria-expanded",
        "false"
      );

    }


    if (copy) {
      copy.scrollTop = 0;
    }

  };



  /* ========================================================
     SHOW REVIEW
  ======================================================== */

  const showReview = (index) => {

    currentIndex =
      (
        index +
        slides.length
      ) %
      slides.length;


    slides.forEach(
      (
        slide,
        slideIndex
      ) => {

        const isActive =
          slideIndex ===
          currentIndex;


        if (isActive) {

          slide.hidden = false;

          slide.classList.add(
            "active"
          );


          slide.setAttribute(
            "aria-hidden",
            "false"
          );

        }

        else {

          collapseReview(
            slide
          );


          slide.hidden = true;

          slide.classList.remove(
            "active"
          );


          slide.setAttribute(
            "aria-hidden",
            "true"
          );

        }

      }
    );

  };



  /* ========================================================
     READ MORE / READ LESS
  ======================================================== */

  slides.forEach(
    slide => {

      const button =
        slide.querySelector(
          ".review-read-toggle"
        );


      if (!button) {
        return;
      }


      button.addEventListener(
        "click",
        () => {

          const expanded =
            slide.classList.toggle(
              "is-expanded"
            );


          button.textContent =
            expanded
              ? "Read less"
              : "Read more";


          button.setAttribute(
            "aria-expanded",
            expanded
              ? "true"
              : "false"
          );


          if (!expanded) {

            const copy =
              slide.querySelector(
                ".review-copy"
              );


            if (copy) {
              copy.scrollTop = 0;
            }

          }

        }
      );

    }
  );



  /* ========================================================
     PREVIOUS
  ======================================================== */

  previousButton.addEventListener(
    "click",
    () => {

      showReview(
        currentIndex - 1
      );

    }
  );



  /* ========================================================
     NEXT
  ======================================================== */

  nextButton.addEventListener(
    "click",
    () => {

      showReview(
        currentIndex + 1
      );

    }
  );



  /* ========================================================
     INITIAL
  ======================================================== */

  showReview(0);

});

/* ==========================================================
   ABOUT CARD MOBILE / TABLET CAROUSEL
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const stage =
    document.getElementById(
      "aboutCardStage"
    );

  const previousButton =
    document.getElementById(
      "aboutCardsPrev"
    );

  const nextButton =
    document.getElementById(
      "aboutCardsNext"
    );


  if (
    !stage ||
    !previousButton ||
    !nextButton
  ) {
    return;
  }


  const scrollCards = (direction) => {

    if (
      window.innerWidth > 991
    ) {
      return;
    }


    const card =
      stage.querySelector(
        ".about-card"
      );


    if (!card) {
      return;
    }


    const cardWidth =
      card.getBoundingClientRect().width;


    const styles =
      window.getComputedStyle(
        stage
      );


    const gap =
      parseFloat(
        styles.columnGap ||
        styles.gap ||
        "0"
      );


    stage.scrollBy({
      left:
        direction *
        (
          cardWidth +
          gap
        ),

      behavior:
        "smooth"
    });

  };


  previousButton.addEventListener(
    "click",
    () => {
      scrollCards(-1);
    }
  );


  nextButton.addEventListener(
    "click",
    () => {
      scrollCards(1);
    }
  );

});