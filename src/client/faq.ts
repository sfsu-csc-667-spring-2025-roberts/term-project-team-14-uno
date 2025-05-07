document.addEventListener("DOMContentLoaded", () => {
  const questions = document.querySelectorAll(".faq-question");

  questions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling as HTMLElement;

      if (answer.style.maxHeight) {
        // Collapse answer
        answer.style.maxHeight = "";
        answer.classList.remove("open");
      } else {
        // Expand answer
        answer.style.maxHeight = answer.scrollHeight + "px";
        answer.classList.add("open");
      }
    });
  });
});
