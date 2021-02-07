import { useState } from 'react';
import styles from './registration.module.css';

function Registration() {
  const [login, setLogin] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginErrorUnique, setLoginErrorUnique] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorUnique, setEmailErrorInique] = useState(false);
  const [pass, setPass] = useState('');
  const [passError, setPassError] = useState(false);
  const [passConfirmError, setPassConfirmError] = useState(false);

  const validateLogin = (ev) => {
    const maskLogin = /^[a-zA-Z][a-zA-Z\.]{2,20}$/;
    const isValidLogin = maskLogin.test(String(ev.target.value));
    if (!isValidLogin) {
      setLoginError(true);
      setLogin('');
    } else {
      // код для проверки уникальности Login в БД
      setLoginError(false);
      setLogin(ev.target.value);
    }                  
  }

  const validateEmail = (ev) => {
    const maskEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    const isValidEmail = maskEmail.test(String(ev.target.value).toLowerCase());
    if (!isValidEmail) {
      setEmailError(true);
      setEmail('');
    } else {
      // код для проверки уникальности email в БД
      setEmailError(false);
      setEmail(ev.target.value);
    }         
  }

  const validatePass = (ev) => {
    const maskPass = /(?=.*\d)(?=.*[a-z]).{8,}/;
    const isValidPass = maskPass.test(String(ev.target.value));
    !isValidPass ? setPassError(true) : setPassError(false)   
    setPass(ev.target.value)
  }

  const validatePassConfirm = (ev) => {
    if (ev.target.value !== pass) {
      setPassConfirmError(true)
    } else {
      setPassConfirmError(false)
    }
  }

  const clearErrorLogin = (ev) => {
    setLoginError(false);       
  }

  const clearErrorEmail = (ev) => {
    setEmailError(false);       
  }

  const createUser = () => {
    if (login && email && pass) {
      console.log('Логин: ', login);
      console.log('Email: ', email);
      console.log('Пароль: ', pass);
    } else {
      !login ? setLoginError(true) : setLoginError(false);
      !email ? setEmailError(true) : setEmailError(false);
      !pass ? setPassError(true) : setPassError(false);
      console.log('Заполните поля!');
    }     
  }


  const handleBlurLogin = (ev) => {
    validateLogin(ev);
  }
  const handleChangeLogin = () => {
    clearErrorLogin(); 
  }
  const handleBlurEmail = (ev) => {
    validateEmail(ev);
  }
  const handleChangeEmail = () => {
    clearErrorEmail(); 
  }
  const handleBlurPass = (ev) => {
    validatePass(ev); 
  }
  const handleBlurPassConfirm = (ev) => {
    validatePassConfirm(ev); 
  }
  const handleClickReg = () => {
    createUser()
  }

  return (
    <div className={styles.reg}>
      <h1 className={styles.title}>Регистрация</h1>

      <label className={styles.label}>
        Ваш логин:
        <input
          className={loginError ? [styles.input, styles.inputError].join(' ') : styles.input}
          type="text"
          placeholder="Логин"
          maxLength="50"
          onBlur={(ev) => handleBlurLogin(ev)}
          onChange={() => handleChangeLogin()}
        />
        <p 
          className={loginError ? styles.errorText : [styles.errorText, styles.errorTextHide].join(' ')}
        >
          {(loginError && loginErrorUnique) ? 'Пользователь с таким Login уже существует' : 'Минимум 3 символа (только буквы)'}
        </p>
      </label>
      
      <label className={styles.label}>
        Ваш email:
        <input 
          className={emailError ? [styles.input, styles.inputError].join(' ') : styles.input}
          type="email"
          placeholder="Email"
          maxLength="50"
          onBlur={(ev) => handleBlurEmail(ev)}
          onChange={() => handleChangeEmail()}
        />
        <p 
          className={emailError ? styles.errorText : [styles.errorText, styles.errorTextHide].join(' ')}
        >
          {(emailError && emailErrorUnique) ? 'Пользователь с таким Email уже существует' : 'Некорректный Email'}
        </p>
      </label>

      <label className={styles.label}>
        Пароль:
        <input
          className={passError ? [styles.input, styles.inputError].join(' ') : styles.input}
          type="password"
          placeholder="Пароль"
          maxLength="20"
          onBlur={(ev) => handleBlurPass(ev)}
        />
        <p 
          className={passError ? styles.errorText : [styles.errorText, styles.errorTextHide].join(' ')}
        >
          Минимум 8 символов (цифры и буквы)
        </p>
      </label>

      <label className={styles.label}>
        Подтвердите пароль:
        <input
          className={passConfirmError ? [styles.input, styles.inputError].join(' ') : styles.input}
          type="password"
          placeholder="Подтвердите пароль"
          maxLength="20"
          onBlur={(ev) => handleBlurPassConfirm(ev)}
        />
        <p 
          className={passConfirmError ? styles.errorText : [styles.errorText, styles.errorTextHide].join(' ')}
        >
          Пароли не совпадают
        </p>
      </label>

      <div className={styles.controls}>
        <button 
          className={[styles.regBtn, styles.btn].join(' ')}
          onClick={() => handleClickReg()}
        >
          Регистрация
        </button>

        <button className={[styles.cancelBtn, styles.btn].join(' ')}>
          Отмена
        </button>
      </div>
      
    </div>
  );
}

export default Registration;
 