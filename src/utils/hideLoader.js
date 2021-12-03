const loader = document.querySelector("[data-js=loader]")

export const hideLoader = () => {
  loader.classList.add("fade-out")
  setTimeout(() => loader.style.display = "none", 200)
}