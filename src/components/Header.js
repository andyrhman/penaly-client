import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { VscClose } from "react-icons/vsc";
import { BsChevronLeft } from "react-icons/bs";
import { IoMailOutline } from "react-icons/io5";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Alert from "./Alert";
import Spinner from "./Spinner";
import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";

export function Header({ user }) {
  const router = useRouter();

  const [signup, setsignup] = useState(false);
  const [error, setError] = useState('');
  const [sign, setsign] = useState(0);
  const [usersetting, setusersetting] = useState(false);

  const displayName = user && user.namaLengkap;

  // * Sign up
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [loading, setLoading] = useState(false);

  const [strength, setStrength] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    setEmailError(false);
    setLoading(true);
    setPasswordError('');
    setConfirmPasswordError('');
    setError('');

    if (confirmPassword !== password) {
      setConfirmPasswordError('Password tidak sama!');
      return;
    }

    try {
      await axios.post('register', {
        namaLengkap: fullName,
        email,
        password,
        username,
        password_confirm: confirmPassword
      });
      window.location.reload();
      sessionStorage.setItem('updateSuccess', '1');
    } catch (error) {
      console.error(error.response);
      if (error.response && error.response.data && error.response.data.message) {
        window.scrollTo(0, 0);
        const errorMessage = error.response.data.message;
        setError(errorMessage);

        if (errorMessage.includes('Password')) {
          setPasswordError(errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };


  function checkPasswordStrength(password) {
    let strength = 0;
    if (password.match(/[a-z]/)) strength++; // lower case letter
    if (password.match(/[A-Z]/)) strength++; // upper case letter
    if (password.match(/[0-9]/)) strength++; // number
    if (password.match(/[^a-zA-Z0-9]/)) strength++; // special character
    if (password.length >= 6) strength++; // length 8 or more
    return strength;
  }

  const validatePassword = (value) => {
    setPassword(value);
    setPasswordError('');
    const strength = checkPasswordStrength(value);
    setStrength(strength);

    if (!value) {
      setPasswordError('Password harus diisi');
    } else if (value.length < 6) {
      setPasswordError('Password harus memiliki 6 huruf maksimal');
    }
  };
  const validateConfirmPassword = (value) => {
    setConfirmPassword(value);
    setConfirmPasswordError('');

    if (!value) {
      setConfirmPasswordError('Konfirmasi Password harus diisi');
    } else if (value !== password) {
      setConfirmPasswordError('Password tidak sama');
    }
  };

  const strengthBarColor = () => {
    switch (strength) {
      case 1: return 'red';
      case 2: return 'orange';
      case 3: return 'yellow';
      case 4: return 'lime';
      case 5: return 'green';
      default: return 'gray';
    }
  }

  const strengthText = () => {
    switch (strength) {
      case 1: return 'Terlalu Pendek';
      case 2: return 'Lemah';
      case 3: return 'Okay';
      case 4: return 'Bagus';
      case 5: return 'Kuat';
      default: return '';
    }
  }

  // * login
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [usernameOrEmailError, setUsernameOrEmailError] = useState(false);
  const [passwordLogin, setPasswordLogin] = useState('');

  const [rememberMe, setRememberMe] = useState(false);

  const submitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUsernameOrEmailError(false);
    setPasswordError('');
    setError('');

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    const isEmail = emailRegex.test(usernameOrEmail);

    try {
      await axios.post('login', {
        email: isEmail ? usernameOrEmail : undefined,
        username: isEmail ? undefined : usernameOrEmail,
        password: passwordLogin,
        rememberMe
      });
      window.location.reload();

    } catch (error) {
      console.error(error.response);
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessage = error.response.data.message;
        setError(errorMessage);
        if (errorMessage.includes('Username or Email')) {
          setUsernameOrEmailError(errorMessage);
        }
        if (errorMessage.includes('Password')) {
          setPasswordError(errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const validateLoginPassword = (value) => {
    setPasswordLogin(value);
    setPasswordError('');

    if (!value) {
      setPasswordError('Password harus diisi');
    }
  };

  useEffect(() => {
    const updateSuccess = sessionStorage.getItem('updateSuccess');
    if (updateSuccess === '1') {
      toast.success('Akun berhasil terdaftar!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide
      });
      sessionStorage.removeItem('updateSuccess');
    }
  }, []);

  const logout = async () => {
    await axios.post('logout', {});
    window.location.reload();
  }
  return (
    <div className="bg-white fixed inset-x-0 top-0 shadow-lg z-10">
      <header className="flex justify-between font-poppins items-center p-3 sm:p-5 wrapper">
        <div className="flex items-center space-x-0 sm:space-x-2">
          <Link passHref href="/">
            <Image
              width={1368}
              height={672}
              src="/images/penaly.png"
              alt="Penaly"
              className="w-full h-12 hidden sm:block cursor-pointer"
            />
          </Link>
          <Link passHref href="/">
            <img
              src="/images/fountain-pen.png"
              alt=""
              className="h-14 sm:hidden cursor-pointer"
            />
          </Link>
          <div className="hidden md:inline-flex items-center space-x-5">
            <h3 className="cursor-pointer">About</h3>
            <h3 className="cursor-pointer">Contact</h3>
            <Link href={'/categories'} className="cursor-pointer">Kategori</Link>
          </div>
        </div>
        <div className="flex items-center space-x-5 text-green-600 ">
          {user && (
            <div className="relative flex items-center space-x-2">
              <span className="text-right">
                <h2 className="text-gray-900 text-sm capitalize">
                  {user.username}
                </h2>
                <h3 className="text-gray-600 text-sm">
                  {user.email}
                </h3>
              </span>
              <div
                onClick={() => setusersetting(!usersetting)}
                className="w-10 h-10 cursor-pointer  rounded-full"
              >
                {user.foto ? (
                  <Image src={user.foto} class="w-9 h-9 rounded-full"
                    width={9}
                    height={9}
                    unoptimized={true}
                    alt={user.namaLengkap}
                  />
                ) : (
                  <div className="bg-green-600  cursor-pointer flex justify-center items-center rounded-full h-10 w-10">
                    <span className="text-white cursor-pointer uppercase">
                      {displayName?.slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>
              <div
                onClick={() => setusersetting(false)}
                className={usersetting ? " fixed  inset-0 z-30" : ""}
              ></div>
              <div
                className={`${usersetting
                  ? "bg-gray-200 z-50 translate-x-[0%] opacity-100 duration-300 ease-in-out  w-[20rem] sm:w-[25rem] px-10 py-8 rounded-lg shadow-lg absolute top-20 right-0  "
                  : "bg-gray-200 z-50  translate-x-[200%] opacity-0 duration-300 ease-in-out   w-[20rem] sm:w-[25rem] px-10 py-8 rounded-lg shadow-lg absolute top-20 right-0  "
                  }`}
              >
                <Link
                  href={'/articles'}
                  className="mb-2 flex items-center gap-2 text-gray-500 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-journal-richtext" viewBox="0 0 16 16">
                    <path d="M7.5 3.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m-.861 1.542 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047L11 4.75V7a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 7v-.5s1.54-1.274 1.639-1.208M5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
                    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
                  </svg>
                  Artikel Saya
                </Link>
                <Link
                  href={'/articles/create'}
                  className="mb-2 flex items-center gap-2 text-gray-500 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-file-earmark-plus" viewBox="0 0 16 16">
                    <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5" />
                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z" />
                  </svg>
                  Buat Artikel
                </Link>
                <Link
                  href={'/settings'}
                  className="flex items-center gap-2 text-gray-500 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
                  <svg
                    className="fill-current"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.8656 8.86874C20.5219 8.49062 20.0406 8.28437 19.525 8.28437H19.4219C19.25 8.28437 19.1125 8.18124 19.0781 8.04374C19.0437 7.90624 18.975 7.80312 18.9406 7.66562C18.8719 7.52812 18.9406 7.39062 19.0437 7.28749L19.1125 7.21874C19.4906 6.87499 19.6969 6.39374 19.6969 5.87812C19.6969 5.36249 19.525 4.88124 19.1469 4.50312L17.8062 3.12812C17.0844 2.37187 15.8469 2.33749 15.0906 3.09374L14.9875 3.16249C14.8844 3.26562 14.7125 3.29999 14.5406 3.23124C14.4031 3.16249 14.2656 3.09374 14.0937 3.05937C13.9219 2.99062 13.8187 2.85312 13.8187 2.71562V2.54374C13.8187 1.47812 12.9594 0.618744 11.8937 0.618744H9.96875C9.45312 0.618744 8.97187 0.824994 8.62812 1.16874C8.25 1.54687 8.07812 2.02812 8.07812 2.50937V2.64687C8.07812 2.78437 7.975 2.92187 7.8375 2.99062C7.76875 3.02499 7.73437 3.02499 7.66562 3.05937C7.52812 3.12812 7.35625 3.09374 7.25312 2.99062L7.18437 2.88749C6.84062 2.50937 6.35937 2.30312 5.84375 2.30312C5.32812 2.30312 4.84687 2.47499 4.46875 2.85312L3.09375 4.19374C2.3375 4.91562 2.30312 6.15312 3.05937 6.90937L3.12812 7.01249C3.23125 7.11562 3.26562 7.28749 3.19687 7.39062C3.12812 7.52812 3.09375 7.63124 3.025 7.76874C2.95625 7.90624 2.85312 7.97499 2.68125 7.97499H2.57812C2.0625 7.97499 1.58125 8.14687 1.20312 8.52499C0.824996 8.86874 0.618746 9.34999 0.618746 9.86562L0.584371 11.7906C0.549996 12.8562 1.40937 13.7156 2.475 13.75H2.57812C2.75 13.75 2.8875 13.8531 2.92187 13.9906C2.99062 14.0937 3.05937 14.1969 3.09375 14.3344C3.12812 14.4719 3.09375 14.6094 2.99062 14.7125L2.92187 14.7812C2.54375 15.125 2.3375 15.6062 2.3375 16.1219C2.3375 16.6375 2.50937 17.1187 2.8875 17.4969L4.22812 18.8719C4.95 19.6281 6.1875 19.6625 6.94375 18.9062L7.04687 18.8375C7.15 18.7344 7.32187 18.7 7.49375 18.7687C7.63125 18.8375 7.76875 18.9062 7.94062 18.9406C8.1125 19.0094 8.21562 19.1469 8.21562 19.2844V19.4219C8.21562 20.4875 9.075 21.3469 10.1406 21.3469H12.0656C13.1312 21.3469 13.9906 20.4875 13.9906 19.4219V19.2844C13.9906 19.1469 14.0937 19.0094 14.2312 18.9406C14.3 18.9062 14.3344 18.9062 14.4031 18.8719C14.575 18.8031 14.7125 18.8375 14.8156 18.9406L14.8844 19.0437C15.2281 19.4219 15.7094 19.6281 16.225 19.6281C16.7406 19.6281 17.2219 19.4562 17.6 19.0781L18.975 17.7375C19.7312 17.0156 19.7656 15.7781 19.0094 15.0219L18.9406 14.9187C18.8375 14.8156 18.8031 14.6437 18.8719 14.5406C18.9406 14.4031 18.975 14.3 19.0437 14.1625C19.1125 14.025 19.25 13.9562 19.3875 13.9562H19.4906H19.525C20.5562 13.9562 21.4156 13.1312 21.45 12.0656L21.4844 10.1406C21.4156 9.72812 21.2094 9.21249 20.8656 8.86874ZM19.8344 12.1C19.8344 12.3062 19.6625 12.4781 19.4562 12.4781H19.3531H19.3187C18.5281 12.4781 17.8062 12.9594 17.5312 13.6469C17.4969 13.75 17.4281 13.8531 17.3937 13.9562C17.0844 14.6437 17.2219 15.5031 17.7719 16.0531L17.8406 16.1562C17.9781 16.2937 17.9781 16.5344 17.8406 16.6719L16.4656 18.0125C16.3625 18.1156 16.2594 18.1156 16.1906 18.1156C16.1219 18.1156 16.0187 18.1156 15.9156 18.0125L15.8469 17.9094C15.2969 17.325 14.4719 17.1531 13.7156 17.4969L13.5781 17.5656C12.8219 17.875 12.3406 18.5625 12.3406 19.3531V19.4906C12.3406 19.6969 12.1687 19.8687 11.9625 19.8687H10.0375C9.83125 19.8687 9.65937 19.6969 9.65937 19.4906V19.3531C9.65937 18.5625 9.17812 17.8406 8.42187 17.5656C8.31875 17.5312 8.18125 17.4625 8.07812 17.4281C7.80312 17.2906 7.52812 17.2562 7.25312 17.2562C6.77187 17.2562 6.29062 17.4281 5.9125 17.8062L5.84375 17.8406C5.70625 17.9781 5.46562 17.9781 5.32812 17.8406L3.9875 16.4656C3.88437 16.3625 3.88437 16.2594 3.88437 16.1906C3.88437 16.1219 3.88437 16.0187 3.9875 15.9156L4.05625 15.8469C4.64062 15.2969 4.8125 14.4375 4.50312 13.75C4.46875 13.6469 4.43437 13.5437 4.36562 13.4406C4.09062 12.7187 3.40312 12.2031 2.6125 12.2031H2.50937C2.30312 12.2031 2.13125 12.0312 2.13125 11.825L2.16562 9.89999C2.16562 9.76249 2.23437 9.69374 2.26875 9.62499C2.30312 9.59062 2.40625 9.52187 2.54375 9.52187H2.64687C3.4375 9.55624 4.15937 9.07499 4.46875 8.35312C4.50312 8.24999 4.57187 8.14687 4.60625 8.04374C4.91562 7.35624 4.77812 6.49687 4.22812 5.94687L4.15937 5.84374C4.02187 5.70624 4.02187 5.46562 4.15937 5.32812L5.53437 3.98749C5.6375 3.88437 5.74062 3.88437 5.80937 3.88437C5.87812 3.88437 5.98125 3.88437 6.08437 3.98749L6.15312 4.09062C6.70312 4.67499 7.52812 4.84687 8.28437 4.53749L8.42187 4.46874C9.17812 4.15937 9.65937 3.47187 9.65937 2.68124V2.54374C9.65937 2.40624 9.72812 2.33749 9.7625 2.26874C9.79687 2.19999 9.9 2.16562 10.0375 2.16562H11.9625C12.1687 2.16562 12.3406 2.33749 12.3406 2.54374V2.68124C12.3406 3.47187 12.8219 4.19374 13.5781 4.46874C13.6812 4.50312 13.8187 4.57187 13.9219 4.60624C14.6437 4.94999 15.5031 4.81249 16.0875 4.26249L16.1906 4.19374C16.3281 4.05624 16.5687 4.05624 16.7062 4.19374L18.0469 5.56874C18.15 5.67187 18.15 5.77499 18.15 5.84374C18.15 5.91249 18.1156 6.01562 18.0469 6.11874L17.9781 6.18749C17.3594 6.70312 17.1875 7.56249 17.4625 8.24999C17.4969 8.35312 17.5312 8.45624 17.6 8.55937C17.875 9.28124 18.5625 9.79687 19.3531 9.79687H19.4562C19.5937 9.79687 19.6625 9.86562 19.7312 9.89999C19.8 9.93437 19.8344 10.0375 19.8344 10.175V12.1Z"
                      fill=""
                    />
                    <path
                      d="M11 6.32498C8.42189 6.32498 6.32501 8.42186 6.32501 11C6.32501 13.5781 8.42189 15.675 11 15.675C13.5781 15.675 15.675 13.5781 15.675 11C15.675 8.42186 13.5781 6.32498 11 6.32498ZM11 14.1281C9.28126 14.1281 7.87189 12.7187 7.87189 11C7.87189 9.28123 9.28126 7.87186 11 7.87186C12.7188 7.87186 14.1281 9.28123 14.1281 11C14.1281 12.7187 12.7188 14.1281 11 14.1281Z"
                      fill=""
                    />
                  </svg>
                  Pengaturan Akun
                </Link>
                <div className="my-4 border-b-2 border-gray-400" />
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-rose-500 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">

                  <svg
                    className="fill-current"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
                      fill=""
                    />
                    <path
                      d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
                      fill=""
                    />
                  </svg>
                  Keluar
                </button>
              </div>
            </div>
          )}

          {!user && (
            <div className="flex justify-center items-center space-x-5">
              <h3
                className="cursor-pointer"
                onClick={() => {
                  setsignup(true);
                  setsign(1);
                }}
              >
                Sign In
              </h3>
              <h3
                onClick={() => setsignup(true)}
                className="border px-4 py-1 cursor-pointer hover:bg-green-600 hover:text-white duration-200 rounded-full border-green-600"
              >
                Get Started
              </h3>
            </div>
          )}
        </div>
      </header>
      {/* SIGN UP */}
      {(() => {
        if (sign === 0) {
          return (
            <div className="text-center">
              <div
                onClick={() => {
                  setsignup(false);
                  setsign(0);
                }}
                className={`${signup
                  ? "fixed inset-0 bg-gray-100   backdrop-blur-md duration-500  bg-opacity-60 ease-in-out transition-all  overflow-y-hidden flex justify-center items-center "
                  : "fixed inset-0 backdrop-blur-0 pointer-events-none duration-500  bg-opacity-0  ease-in-out transition-all overflow-y-hidden   "
                  }`}
              />
              <div
                className={`${signup
                  ? "scale-100  z-[100] md:z-10 ease-in-out duration-500 min-h-full md:min-h-[600px] w-full md:w-auto md:h-auto md:m-auto  rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                  : "scale-0  ease-in-out duration-500 h-[600px] w-[500px]   rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                  }`}
              >
                {signup && (
                  <div className="w-full  md:mx-[20rem] my-[10rem]">
                    <div
                      className="p-4  cursor-pointer  z-50  absolute top-0 pt-10 pr-10 right-0"
                      onClick={() => setsignup(false)}
                    >
                      <VscClose className="h-8 w-8  text-gray-400 hover:text-gray-700 duration-100 text-2xl cursor-pointer" />
                    </div>
                    <div className="px-10  md:-translate-0 absolute w-full m-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <div className="">
                        <div className="capitalize flex-col font-poppins text-2xl  flex justify-center my-10">
                          <h1 className="py-10">Bergabung di Penaly.</h1>
                          <h2 className="text-sm max-w-[24rem] m-auto">
                            Buat akun untuk membuat artikel anda dengan gratis, baca artikel menarik dan beredukasi,
                            dan berdiskusi tentang artikel yang anda pilih dengan berbagai pengguna di selurh dunia.
                          </h2>
                        </div>
                        <div>
                          <div
                            onClick={() => {
                              setsign(2);
                            }}
                            className="flex w-fit m-auto  items-center justify-center space-x-4 border-[1px] mb-10 px-[21px] py-2 cursor-pointer  border-gray-600 hover:border-gray-900 rounded-full font-poppins text-sm text-gray-800"
                          >
                            <IoMailOutline className="h-[19px] w-[19px] text-black" />
                            <h2>Daftar menggunakan Email </h2>
                          </div>
                        </div>
                        <div className="font-poppins mb-16 text-sm flex justify-center">
                          Sudah punya Akun? {"  "}
                          <span
                            onClick={() => setsign(1)}
                            className="text-green-600 cursor-pointer font-bold ml-2"
                          >
                            {" "}
                            Masuk
                          </span>
                        </div>
                        <div className="font-poppins  mb-20   text-center text-gray-600 text-xs flex justify-center items-center">
                          <h2>
                            Klik "Daftar" untuk menyetujui Persyaratan Layanan Penaly dan mengakui bahwa Kebijakan Privasi Penaly berlaku untuk Anda.
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ); // * Auth Info
        } else if (sign === 1) {
          return (
            <div className="text-center ">
              <div
                onClick={() => {
                  setsignup(false);
                  setsign(0);
                }}
                className={`${signup
                  ? "fixed inset-0 bg-gray-100  backdrop-blur-md duration-500  bg-opacity-60 ease-in-out transition-all  overflow-y-hidden flex justify-center items-center "
                  : "fixed inset-0 backdrop-blur-0 pointer-events-none duration-500  bg-opacity-0  ease-in-out transition-all overflow-y-hidden   "
                  }`}
              />
              <div
                className={`${signup
                  ? "scale-100 z-[100] md:z-10  ease-in-out duration-500 min-h-full md:min-h-[600px] w-full md:w-auto md:h-auto md:m-auto   rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                  : "scale-0  ease-in-out duration-500 h-[600px] w-[500px]   rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                  }`}
              >
                {signup && (
                  <div className="w-full md:px-[20rem] py-[10rem]">
                    <div
                      className="p-4 z-50 cursor-pointer absolute top-0 pt-10 pr-10 right-0"
                      onClick={() => setsignup(false)}
                    >
                      <VscClose className="h-8 w-8 text-gray-400 hover:text-gray-700 duration-100 text-2xl cursor-pointer" />
                    </div>
                    <div className="px-10  md:-translate-0 absolute w-full m-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <div className="">
                        <div className="capitalize  font-poppins text-2xl  flex justify-center py-10">
                          <h1>Selamat datang!</h1>
                        </div>
                        <div>
                          <div
                            onClick={() => {
                              setsign(3);
                            }}
                            className="flex w-fit m-auto  items-center justify-center space-x-4 border-[1px] mb-10 px-[21px] py-2 cursor-pointer  border-gray-600 hover:border-gray-900 rounded-full font-poppins text-sm text-gray-800"
                          >
                            <IoMailOutline className="h-[19px] w-[19px] text-black" />
                            <h2>Masuk menggunakan Email </h2>
                          </div>
                        </div>
                        <div className="font-poppins mb-16 text-sm flex justify-center">
                          Tidak punya akun?
                          <span
                            onClick={() => setsign(0)}
                            className="text-green-600 cursor-pointer font-bold ml-2"
                          >
                            {" "}
                            Buat Akun
                          </span>
                        </div>
                        <div className="font-poppins  mb-20   text-center text-gray-600 text-xs flex justify-center items-center">
                          <h2>
                            Klik "Masuk" untuk menyetujui Persyaratan Layanan Penaly dan mengakui bahwa Kebijakan Privasi Penaly berlaku untuk Anda.
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ); // * Sign Up From
        } else if (sign === 2) {
          return (
            <div className="text-center">
              <div
                onClick={() => {
                  setsignup(false);
                  setsign(0);
                }}
                className={`${signup
                  ? "fixed inset-0 bg-gray-100 backdrop-blur-md duration-500 bg-opacity-60 ease-in-out transition-all overflow-y-hidden flex justify-center items-center"
                  : "fixed inset-0 backdrop-blur-0 pointer-events-none duration-500 bg-opacity-0 ease-in-out transition-all overflow-y-hidden"
                  }`}
              />
              <div
                className={`${signup
                  ? "scale-100 z-[100] md:z-10 ease-in-out duration-500 min-h-full md:min-h-[800px] w-full md:w-auto md:h-auto md:m-auto rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                  : "scale-0 ease-in-out duration-500 h-[800px] w-[500px] rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                  }`}
              >
                {signup && (
                  <div className="w-full md:w-[500px] max-h-full md:max-h-full overflow-y-auto px-[20px] py-[10px]">
                    <div
                      className="p-4 cursor-pointer absolute top-0 pt-10 pr-10 right-0"
                      onClick={() => setsignup(false)}
                    >
                      <VscClose className="h-8 w-8 text-gray-400 hover:text-gray-700 duration-100 text-2xl cursor-pointer" />
                    </div>
                    <div className="px-10 md:-translate-0 absolute w-full m-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <div className="">
                        <div className="capitalize flex flex-col font-poppins text-2xl space-y-2 justify-center py-10">
                          <h1>Daftar menggunakan Email</h1>
                          <h2 className="capitalize font-poppins text-sm">
                            Masukkan informasi anda untuk membuat akun.
                          </h2>
                        </div>
                        {error && (
                          <Alert error={error} />
                        )}
                        <form
                          onSubmit={submit}
                          className="flex flex-col w-[90%] sm:w-[60%] mb-10 mt-6 m-auto"
                        >
                          <label
                            className="text-gray-900 text-sm"
                            htmlFor="namaLengkap"
                          >
                            Nama Lengkap
                          </label>
                          <input
                            id="namaLengkap"
                            name="namaLengkap"
                            onChange={(e) => {
                              setFullName(e.target.value);
                            }}
                            className="w-full md:w-[80%] m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black"
                            type="text"
                            required
                            maxLength={50}
                          />
                          <label
                            className="text-gray-900 text-sm mt-4"
                            htmlFor="username"
                          >
                            Username
                          </label>
                          <input
                            id="username"
                            name="username"
                            onChange={(e) => {
                              setUsername(e.target.value);
                            }}
                            className="w-full md:w-[80%] m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black"
                            type="text"
                            required
                            maxLength={20}
                          />
                          <label
                            className="text-gray-900 text-sm mt-4"
                            htmlFor="email"
                          >
                            Email
                          </label>
                          <input
                            id="email"
                            name="email"
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                            className="w-full md:w-[80%] m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black"
                            type="email"
                            required
                          />
                          <label
                            className="text-gray-900 text-sm mt-4"
                            htmlFor="password"
                          >
                            Password
                          </label>
                          <input
                            onChange={(e) => validatePassword(e.target.value)}
                            name="password"
                            id="password"
                            type="password"
                            required
                            maxLength={20}
                            className={
                              passwordError
                                ? "w-full my-2 md:w-[80%] input-error m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black"
                                : "w-full my-2 md:w-[80%] m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black"
                            }
                          />
                          <div
                            style={{
                              fontSize: '12px',
                              textAlign: 'right',
                              color: strengthBarColor(),
                            }}
                          >
                            {strengthText()}
                          </div>
                          <div
                            style={{
                              height: '10px',
                              width: `${strength * 20}%`,
                              backgroundColor: strengthBarColor(),
                              transition: 'width 0.3s ease-in-out',
                            }}
                          />
                          {passwordError && (
                            <div className="text-red-500 text-xs mt-1">{passwordError}</div>
                          )}

                          <label
                            className="text-gray-900 text-sm mt-4"
                            htmlFor="confirmPassword"
                          >
                            Konfirmasi Password
                          </label>
                          <input
                            className={
                              confirmPasswordError
                                ? "w-full my-2 md:w-[80%] input-error m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black"
                                : "w-full my-2 md:w-[80%] m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black"
                            }
                            name="confirmPassword"
                            id="confirmPassword"
                            type="password"
                            required
                            maxLength={20}
                            onChange={(e) => validateConfirmPassword(e.target.value)}
                          />
                          {confirmPasswordError && (
                            <div className="text-red-500 text-xs mt-1">{confirmPasswordError}</div>
                          )}
                          {loading ? <Spinner /> : <input
                            className="px-8 mt-4 w-[70%] m-auto py-2 bg-gray-900 cursor-pointer hover:bg-black duration-100 rounded-full text-white"
                            type="submit"
                            value="Daftar"
                          />}
                        </form>

                        <div
                          onClick={() => setsign(3)}
                          className="font-poppins items-center mb-16 text-sm flex justify-center"
                        >
                          <BsChevronLeft className="text-green-600 h-4 w-4" />
                          <span className="text-green-600 cursor-pointer ml-2">
                            {" "}
                            Masuk sekarang
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ); // * Sign In form
        } else if (sign === 3) {
          return (
            <div className="text-center ">
              <div
                onClick={() => {
                  setsignup(false);
                  setsign(0);
                }}
                className={`${signup
                  ? "fixed inset-0 bg-gray-100  backdrop-blur-md duration-500  bg-opacity-60 ease-in-out transition-all  overflow-y-hidden flex justify-center items-center "
                  : "fixed inset-0 backdrop-blur-0 pointer-events-none duration-500  bg-opacity-0  ease-in-out transition-all overflow-y-hidden   "
                  }`}
              />
              <div
                className={`${signup
                  ? "scale-100 z-[100] md:z-10  ease-in-out duration-500 min-h-full md:min-h-[600px] w-full md:w-auto md:h-auto md:m-auto   rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                  : "scale-0  ease-in-out duration-500 h-[600px] w-[500px] rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                  }`}
              >
                {signup && (
                  <div className="w-full md:px-[20rem] py-[10rem]">
                    <div
                      className="p-4 cursor-pointer absolute z-50 top-0 pt-10 pr-10 right-0"
                      onClick={() => setsignup(false)}
                    >
                      <VscClose className="h-8 w-8 text-gray-400 hover:text-gray-700 duration-100 text-2xl cursor-pointer" />
                    </div>
                    <div className="px-10 mt-6 md:-translate-0 absolute w-full m-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <div className="">
                        <div className="capitalize flex flex-col font-poppins text-2xl  space-y-2 justify-center py-10">
                          <h1>Masuk ke akun Anda</h1>
                          <h2 className="capitalize px-12 font-poppins text-sm  ">
                            Masukkan alamat email atau username & kata sandi yang terkait dengan akun Anda, dan kami akan mengarahkan Anda langsung ke halaman beranda.
                          </h2>
                        </div>
                        {error && (
                          <Alert error={error} />
                        )}
                        <form
                          onSubmit={submitLogin}
                          className="flex flex-col w-[90%] sm:w-[60%]  mb-10 mt-2 m-auto "
                        >
                          <label
                            className="text-gray-900 text-sm"
                            htmlFor="usernameAndEmailLogin"
                          >
                            Username atau Email
                          </label>
                          <input
                            id="usernameAndEmailLogin"
                            name="usernameAndEmailLogin"
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                            className={
                              usernameOrEmailError
                                ? ("w-full my-2 md:w-[80%] input-error m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black")
                                : ("w-full my-2 md:w-[80%] m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black")
                            }
                            type="text"
                            required
                            max={20}
                          />
                          <label
                            className="text-gray-900 text-sm mt-4"
                            htmlFor="passwordLogin"
                          >
                            Password
                          </label>
                          <input
                            onChange={(e) => validateLoginPassword(e.target.value)}
                            name="passwordLogin"
                            id="passwordLogin"
                            type="password"
                            className={
                              passwordError
                                ? ("w-full my-2 md:w-[80%] input-error m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black")
                                : ("w-full my-2 md:w-[80%] m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black")
                            }
                            required
                            max={20}
                          />
                          <div className="ml-3 text-sm space-x-2">
                            <input
                              id="remember"
                              aria-describedby="remember"
                              type="checkbox"
                              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""
                              onChange={(e) => setRememberMe(e.target.checked)}

                            />

                            <label htmlFor="remember" className="text-sm font-medium text-primary-400 hover:underline dark:text-primary-400">Ingat Saya</label>
                          </div>

                          {loading ? <Spinner /> : <input
                            className="px-8 mt-4 w-[70%] m-auto py-2 bg-gray-900 cursor-pointer hover:bg-black duration-100 rounded-full text-white"
                            type="submit"
                            value="Masuk"
                          />}
                        </form>

                        <div
                          onClick={() => setsign(2)}
                          className="font-poppins items-center  mb-16 text-sm flex justify-center"
                        >
                          <BsChevronLeft className="text-green-600 h-4 w-4" />
                          <span className="text-green-600 cursor-pointer  ml-2">
                            {" "}
                            Daftar Sekarang
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }
      })()}
      {/* SIGN UP */}
    </div>
  );
}

export default connect(
  (state) => {
    return {
      user: state.user.user
    }
  }
)(Header);

