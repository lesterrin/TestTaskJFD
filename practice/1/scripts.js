addEventListener("DOMContentLoaded", () => {
    const selector = document.querySelector('.custom-selector');
    const menu = selector.querySelector('.context-menu');
    const arrow = selector.querySelector('.arrow');
    const trigger = selector.querySelector('.trigger');
    const modal = document.getElementById('modal');
    const blackBack = document.querySelector('.darkBg');

    const validForm = ({direction, orgName, phone, email, logo}) => (
        Boolean(direction && orgName && phone && email && logo)
    )

    const changeSelector = (displayValue, transformValue) => {
        menu.style.display = displayValue;
        arrow.style.transform = transformValue;
    }

    const closeModal = () => {
        modal.style.display = 'none';
        blackBack.style.display = 'none';
        document.querySelector('body').style.height = '100%';
    }

    const sendForm = (data) => {
        closeModal();
        alert('Форма валидна. Отправка формы');
    }

    menu.querySelectorAll('li').forEach(dir => dir.addEventListener('click', e => {
        trigger.value = e.target.innerHTML;
        changeSelector('none', 'rotate(0)');
    }));

    trigger.addEventListener('click', () => {
        if (getComputedStyle(menu).display === 'none') changeSelector('block', 'rotate(180deg)');
        else changeSelector('none', 'rotate(0)');
    });

    document.getElementById('form').addEventListener('submit', e => {
        e.preventDefault();
        const inputs = e.target.querySelectorAll('input[name]');
        const formData = {};
        inputs.forEach(input => {
            if (input.name !== 'logo') formData[input.name] = input.value;
            else formData[input.name] = input.files[0];
        });
        if (validForm(formData)) sendForm(formData);
        else alert('Форма не валидна. Отправка невозможна');
    });

    document.getElementById('cancel-logo').addEventListener('click', () => {
        document.querySelector('input[name=logo]').value = '';
    });

    document.getElementById('cancel-form-btn').addEventListener('click', closeModal);

    document.getElementById('openModal').addEventListener('click', () => {
        modal.style.display = 'block';
        /*изменение высоты body после того, как страница стала больше, из-за появления модального окна*/
        const winHeight = modal.offsetHeight + 202;
        document.querySelector('body').style.height = `${winHeight}px`;
        /*--*/
        blackBack.style.display = 'block';
    });

});


