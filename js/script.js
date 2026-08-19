document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const collapseElement = document.getElementById("navbarContent");

  // Theme
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle?.querySelector(".material-icons-outlined");
  const savedTheme = localStorage.getItem("theme") || "light";

  document.documentElement.setAttribute("data-theme", savedTheme);

  const updateThemeIcon = (theme) => {
    if (themeIcon) {
      themeIcon.textContent = theme === "dark" ? "light_mode" : "dark_mode";
    }
  };

  updateThemeIcon(savedTheme);

  themeToggle?.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  // Navbar glass effect on scroll + active section
  const handleScroll = () => {
    nav?.classList.toggle("scrolled", window.scrollY > 30);

    let current = "home";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 180;
      if (window.scrollY >= sectionTop) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Close mobile navbar after clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (
        window.innerWidth < 992 &&
        collapseElement?.classList.contains("show")
      ) {
        bootstrap.Collapse.getOrCreateInstance(collapseElement).hide();
      }
    });
  });

  // Reveal-on-scroll animation
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("show"));
  }

  // Contact form
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = contactForm.querySelector("button[type='submit']");
      const originalText = submitButton.innerHTML;

      submitButton.disabled = true;
      submitButton.innerHTML = "Sending...";
      if (formStatus) formStatus.textContent = "";

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbwY5uXbXlBZ4-9nA06RnOaKKg8lSxkQUvkBe4UHXn3STy4mcKg2lxu212fCPuwlPr5DsA/exec",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        if (formStatus) formStatus.textContent = "Message sent successfully!";
        contactForm.reset();
      } catch (error) {
        console.error(error);
        if (formStatus) {
          formStatus.textContent =
            "Unable to send the message. Please try again.";
        }
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
  }
});
