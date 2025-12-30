const facts = document.querySelectorAll('.fact');

const formatLabel = (value, selected) => {
  const mark = selected ? '[x]' : '[ ]';
  return `${mark} ${value === 'truth' ? 'Truth' : 'Lie'}`;
};

facts.forEach((fact) => {
  const picks = fact.querySelectorAll('.fact-pick');
  const revealOutput = fact.querySelector('.fact-reveal');
  const answer = fact.dataset.answer;

  if (!picks.length || !revealOutput || !answer) {
    return;
  }

  const updatePickLabels = (selectedValue) => {
    picks.forEach((btn) => {
      const value = btn.dataset.value;
      const isSelected = value === selectedValue;
      btn.textContent = formatLabel(value, isSelected);
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });
  };

  const applyReveal = () => {
    const selectedValue = fact.dataset.selected;
    revealOutput.textContent = `Answer: ${answer === 'truth' ? 'Truth' : 'Lie'}`;
    revealOutput.hidden = false;
    fact.classList.add('is-revealed');
    fact.classList.remove('is-correct', 'is-wrong');

    if (selectedValue) {
      fact.classList.add(selectedValue === answer ? 'is-correct' : 'is-wrong');
    }
  };

  picks.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedValue = btn.dataset.value;
      fact.dataset.selected = selectedValue;
      fact.classList.add('has-guess');
      updatePickLabels(selectedValue);
      applyReveal();
    });
  });

  updatePickLabels();
});
