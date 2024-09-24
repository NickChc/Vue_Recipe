export function scrollToTop(element: Node | null) {
  if (element == null) return;

  let parent = element.parentElement;

  // Traverse up the DOM tree
  while (parent) {
    // Check if the parent has a scrollbar
    const overflowY = window.getComputedStyle(parent).overflowY;
    const isScrollable = overflowY === "auto" || overflowY === "scroll";

    if (isScrollable) {
      parent.scrollTop = 0; // Scroll to the top of the scrollable parent
      return; // Exit the function after scrolling
    }

    parent = parent.parentElement; // Move to the next parent
  }

  // If no scrollable parent found, scroll the window to the top
  window.scrollTo({ top: 0, behavior: "smooth" });
}
