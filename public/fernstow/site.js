const tablist = document.querySelector('.example-tabs');
const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));

function selectTab(tab, focus = false) {
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  }
  if (focus) tab.focus();
}

tablist.hidden = false;
for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (event) => {
    const destinations = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    selectTab(tabs[destinations[event.key]], true);
  });
}
