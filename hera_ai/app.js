const filterButtons = document.querySelectorAll(".filter-button");
const resourceCards = document.querySelectorAll(".resource-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    resourceCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.type === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});
