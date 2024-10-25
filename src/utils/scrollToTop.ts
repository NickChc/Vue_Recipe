export function scrollToTop(element: Node | null) {
  if (element == null) return;

  let parent = element.parentElement;

  // Iterate over DOM tree
  while (parent) {
    // Check if the parent has a scrollbar
    const overflowY = window.getComputedStyle(parent).overflowY;
    const isScrollable = overflowY === "auto" || overflowY === "scroll";

    if (isScrollable) {
      parent.scrollTop = 0;
      return;
    }

    parent = parent.parentElement;
  }

  // If no scrollable parent found, scroll the window to the top
  window.scrollTo({ top: 0, behavior: "smooth" });
}
