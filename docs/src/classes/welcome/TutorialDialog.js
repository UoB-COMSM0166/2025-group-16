class TutorialDialog extends Dialog {
  constructor(params) {
    super({
      ...params,
      title: 'START TUTORIAL?',
      isOpen: localStorage.getItem(Constants.TutorialCompletedKey) !== 'true',
      options: [{ label: 'Yes' }, { label: 'No' }],
      onClose: () => {
        params?.onClose();
        localStorage.setItem(Constants.TutorialCompletedKey, 'true');
      },
    });

    this.selectingIdx = 0;
  }

  onSelect(index) {
    if (index === 0) {
      Controller.changePage(new Tutorial(), Constants.Page.TUTORIAL);
    } else {
      this.close();
    }
  }
}
