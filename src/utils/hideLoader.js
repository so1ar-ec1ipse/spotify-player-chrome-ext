const loader = document.querySelector("[data-js=loader]")

export const hideLoader = () => {
  loader.classList.add("fade-out")
  setTimeout(() => loader.style.display = "none", 100)
}

export const showLoader = () => {
  loader.classList.remove("fade-out");
  loader.style.display = "";
}