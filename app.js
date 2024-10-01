class Input {
  constructor(input) {
    this.input = input;
    this.setValidationEvents();
  }

  setValidationEvents = () => {
    ['blur', 'invalid'].forEach(event => this.input.addEventListener(event, this.validation));
  };

  validation = event => {
    const isValid = this.input.validity.valid;
    const classValid = 'is-valid';
    const classInvalid = 'is-invalid';

    event.preventDefault();
    this.input.setCustomValidity('');
    this.input.classList.add(isValid ? classValid : classInvalid);
    this.input.classList.remove(isValid ? classInvalid : classValid);
    this.updateErrorMessage(isValid ? false : this.getErrorMessage());
  };

  updateErrorMessage = handler => {
    const feedback = this.input.parentElement.querySelector('.invalid-feedback');

    if (handler !== false) feedback ? (feedback.innerText = handler) : this.createFeedback(handler);
    else if (feedback) feedback.remove();
  };

  createFeedback = msg => {
    const feedback = document.createElement('span');

    feedback.classList.add('invalid-feedback');
    feedback.textContent = msg;
    this.input.parentElement.insertBefore(feedback, this.input.nextSibling);
  };

  getErrorMessage = () => {
    if (this.input.validity.valueMissing) return `O campo não pode estar vazio.`;

    if (this.input.validity.rangeUnderflow || this.input.validity.tooShort) return `O valor inserido é menor do que o especificado.`;

    if (this.input.validity.rangeOverflow || this.input.validity.tooLong) return `O valor inserido é maior do que o especificado.`;

    return `O valor inserido é inválido.`;
  };
}

class InputBitrh extends Input {
  constructor(input) {
    super(input);

    this.setDeadline();
  }

  setDeadline = () => {
    this.input.setAttribute('max', new Date().toISOString().slice(0, 10));
  };
}

class InputTel extends Input {
  constructor(input) {
    super(input);

    this.input.addEventListener('input', this.setMask);
  }

  setMask = () => {
    const currentValue = this.input.value;

    if (!currentValue) return;

    this.input.value = currentValue
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2');
  };
}

class InputCpf extends Input {
  constructor(input) {
    super(input);

    this.input.addEventListener('input', this.setMask);
  }

  setMask = () => {
    const currentValue = this.input.value;

    if (!currentValue) return;

    this.input.value = currentValue
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2');
  };
}

class InputCep extends Input {
  constructor(input) {
    super(input);

    this.input.addEventListener('input', this.setMask);
  }

  setMask = () => {
    const currentValue = this.input.value;

    if (!currentValue) return;

    this.input.value = currentValue
      .replace(/\D/g, '')
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, '$1-$2');
  };
}

window.addEventListener('DOMContentLoaded', () => {
  const inputTypeList = {
    default: Input,
    birth: InputBitrh,
    tel: InputTel,
    cpf: InputCpf,
    cep: InputCep,
  };

  document.querySelectorAll('input').forEach(input => {
    const InputType = inputTypeList[input.name] || inputTypeList['default'];
    new InputType(input);
  });
});
