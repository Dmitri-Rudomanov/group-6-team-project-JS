(() => {
    const refs = {
      openModalTeamBtn: document.querySelector('[data-modal-team-open]'),
      closeModalTeamBtn: document.querySelector('[data-modal-team-close]'),
      modalTeam: document.querySelector('[data-modal-team]'),
    };
  
    refs.openModalTeamBtn.addEventListener('click', toggleModalTeam);
    refs.closeModalTeamBtn.addEventListener('click', toggleModalTeam);
  
    function toggleModalTeam() {
      refs.modalTeam.classList.toggle('is-hidden');
    }
  })();