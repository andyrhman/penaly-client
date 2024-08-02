import { useInView } from "react-intersection-observer";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BiUpArrow } from "react-icons/bi";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { IoMailOutline } from "react-icons/io5";
import { Tooltip } from "react-tippy";
import { FiSearch } from "react-icons/fi";
import { VscClose } from "react-icons/vsc";
import { BsChevronLeft } from "react-icons/bs";
import { connect } from "react-redux";
import { Komentar } from '../../components/Komentar'
import axios from "axios";
import Header from "../../components/Header";
import Image from "next/image";
import SyntaxHighlighter from "react-syntax-highlighter";
import Link from "next/link";
import FormatDate from "../../services/format-time"
import parse from 'html-react-parser';
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import * as sanitizeHtml from 'sanitize-html';
import "react-tippy/dist/tippy.css";

function scrolltotop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

export const post = {
  _id: "123asdasd",
  slug: {
    current: "test123"
  },
  mainImage: "https://images.pexels.com/photos/4065864/pexels-photo-4065864.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  title: "How to get good at coding",
  description: "yes this is dog",
  author: {
    name: "test123",
    image: "https://images.pexels.com/photos/4065864/pexels-photo-4065864.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    bio: "i'm working as a web developer"
  },
  _createdAt: "27 Juli. 2024",
  body: "This is the body",
  comments: [
    {
      _id: "asdasq2",
      comment: "wwww  "
    }
  ]
}
import { posts } from "..";
const user = {
  displayName: "test1",
  email: "test1@mail.com",
  photoURL: "https://images.pexels.com/photos/6334232/pexels-photo-6334232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
}

const Post = ({ user }) => {
  // * Fetch Post and Likes
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [postsNew, setPostsNew] = useState([]);

  const [id, setId] = useState('');
  const [penulis, setPenulis] = useState('');
  const [penulisFoto, setPenulisFoto] = useState('');
  const [penulisBio, setPenulisBio] = useState('');

  const [title, setTitle] = useState('');
  const [dibuat_pada, setDibuatPada] = useState('');
  const [deskripsi_kecil, setDeskripsiKecil] = useState('');
  const [deskripsi_panjang, setDeskripsiPanjang] = useState('');
  const [estimasi_membaca, setEstimasiMembaca] = useState('');
  const [gambar, setGambar] = useState('');
  const [tag_id, setTagId] = useState('');
  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { slug } = router.query;

  // * Show data
  useEffect(() => {
    if (slug) {
      fetchData();
    }
  }, [router, slug]);
  const fetchData = async () => {
    try {
      const { data } = await axios.get(`articles/${slug}`);
      setPenulis(data.user.username);
      setPenulisFoto(data.user.foto);
      setPenulisBio(data.user.bio);

      setId(data.id);
      setTitle(data.title);
      setDeskripsiKecil(data.deskripsi_kecil);
      setDeskripsiPanjang(data.deskripsi_panjang);
      setEstimasiMembaca(data.estimasi_membaca);
      setDibuatPada(data.dibuat_pada);
      setGambar(data.gambar);
      setTagId(data.tag);
      setLikeCount(data.likes);
      checkUserLike(data.id);

      const { data: komentar } = await axios.get(`comments/${data.id}`);
      setComments(komentar);

      let count = komentar.length;
      komentar.forEach(comment => {
        count += comment.balasKomentar.length;
      });
      setTotalCount(count);

      const { data: post } = await axios.get(`articles/published`);
      setPosts(post);

      const { data: postNew } = await axios.get(`articles/published/new`);
      setPostsNew(postNew);
    } catch (error) {
      if (error.response && [403].includes(error.response.status)) {
        router.push('/');
      }
    }
  };

  // * Check like
  const checkUserLike = async (articleId) => {
    try {
      const { data } = await axios.get(`articles/like/${articleId}`);
      setIsLiked(data.message === 'True');
    } catch (error) {
      console.error('Failed to check if user liked the article', error);
    }
  };
  const handleLike = async () => {
    try {
      if (isLiked) {
        await axios.put(`articles/dislike/${id}`);
      } else {
        await axios.put(`articles/like/${id}`);
      }
      fetchData();
    } catch (error) {
      console.error('Failed to like the article', error);
    }
  };

  const [commentside, setcommentside] = useState(false);

  // hide on top at specific height
  useEffect(() => {
    window.onscroll = function () {
      if (this.scrollY >= 444) {
        setup(true);
      } else {
        setup(false);
      }
    };
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [signup, setsignup] = useState(false);
  const [sign, setsign] = useState(0);

  // hide on top at specific height

  const [up, setup] = useState(false);

  // sanity rich text
  const CodeRenderer = ({ node }) => {
    if (!node.code) {
      return null;
    }
    return (
      <SyntaxHighlighter
        className="my-12 lowercase"
        language={node.language || "text"}
      >
        {node.code}
      </SyntaxHighlighter>
    );
  };

  // hide comment x like at specific height
  const { ref: myRef, inView: myelemisvisible } = useInView();
  // hide comment x like at specific height

  const [isopen, setisopen] = React.useState(false);

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

  const pageTitle = `${sanitizeHtml(title)} | ${process.env.siteTitle}`;

  return (
    <Layout>
      <SEO title={pageTitle} />
      <main className="font-poppins grid grid-cols-7 ">
        {/* First section */}
        <div className="xl:flex justify-end  h-full hidden relative  ">
          <div className="fixed justify-between  h-full px-6 py-12  col-span-1 flex flex-col ">
            <div className="flex cursor-pointer ">
              <Link passHref href="/">
                <img
                  className="h-14"
                  src="/images/penaly.png"
                  alt=""
                />
              </Link>
            </div>

            <div className="flex flex-col justify-end items-end space-y-8 ">
              {" "}
              <Link href="/">
                <div>
                  <Tooltip
                    // options
                    title="Home"
                    position="right"
                    trigger="mouseenter"
                    arrow={true}
                    delay={300}
                    hideDelay={0}
                    distance={20}
                  >
                    <HomeUnclicked />
                  </Tooltip>
                </div>
              </Link>
              <Tooltip
                // options
                title="Notifications"
                position="right"
                trigger="mouseenter"
                arrow={true}
                delay={300}
                hideDelay={0}
                distance={20}
              >
                <Notif />{" "}
              </Tooltip>
              <Tooltip
                // options
                title="Lists"
                position="right"
                trigger="mouseenter"
                arrow={true}
                delay={300}
                hideDelay={0}
                distance={20}
              >
                <Readinglist />
              </Tooltip>
              <Tooltip
                // options
                title="Stories"
                position="right"
                trigger="mouseenter"
                arrow={true}
                delay={300}
                hideDelay={0}
                distance={20}
              >
                <Stories />
              </Tooltip>
            </div>
            <div></div>
          </div>
        </div>

        <div className="border-gray-200  border-x-[1px] w-full h-full  col-span-7 xl:col-span-4 ">
          {up && (
            <div
              onClick={scrolltotop}
              className="fixed hidden sm:block animate-bounce duration-500 z-40 hover:bg-green-700 bg-green-600 shadow-xl cursor-pointer rounded-md p-[13px] m-10 bottom-0 right-0"
            >
              <BiUpArrow className="w-4 h-4 text-white" />
            </div>
          )}
          {/* // * Header  */}
          <div className="block xl:hidden">
            <Header />
          </div>

          {/* bottom section */}
          <div className="w-full   z-50 block sm:hidden px-[30px] py-[20px] fixed bg-gray-100 shadow-md bottom-0">
            <div className="flex justify-between">
              <Link href="/">
                <div>
                  {router.pathname === "/" ? <HomePhone /> : <HomePhone />}
                </div>
              </Link>
              {/* <Home /> */}
              <Link href="/SearchCo">
                <div>
                  <Search />
                </div>
              </Link>
              <Tooltip
                // options
                title="Not working yet"
                position="bottom"
                trigger="mouseenter"
                arrow={true}
                delay={300}
                hideDelay={0}
                distance={20}
              >
                <div>
                  <ReadingList />
                </div>
              </Tooltip>
            </div>
          </div>
          {/* bottom section */}
          <div className="wrapper z-0 mt-24 xl:mt-0 flex flex-col justify-center max-w-[800px] px-6">
            <div className="md:flex space-y-8  md:space-y-0 justify-between  items-center space-x-4 py-10 font-extralight text-sm">
              <div className="flex ">
                <div>
                  <img
                    className="h-12 w-12 object-cover rounded-full"
                    src={penulisFoto}
                    alt=""
                  />
                </div>
                <div className="pl-4">
                  <p className="font-medium text-base">
                    <span className="text-gray-900">{penulis}</span>
                  </p>
                  <div className="flex items-center ">
                    <p className="text-gray-600">
                      <FormatDate timestamp={dibuat_pada} />
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center space-x-6">
                <div className="border-[0.5px] sm:hidden border-gray-100 w-full"></div>
                <Tooltip
                  title="Estimasi Waktu"
                  position="top"
                  trigger="mouseenter"
                  arrow={true}
                  delay={300}
                  distance={20}
                >
                  <p className="font-medium text-base">
                    <span className="text-gray-500">{estimasi_membaca} Membaca</span>
                  </p>
                </Tooltip>
              </div>
            </div>
            {/* like x Comment fixed */}

            <div
              className={`${myelemisvisible
                ? "fixed hidden bottom-20 md:bottom-10 -translate-x-1/2 left-1/2 xl:left-[43%]"
                : "fixed bottom-20 md:bottom-10 -translate-x-1/2 left-1/2 xl:left-[43%]"
                }`}
            >
              <div className="  bg-white px-6 py-2 rounded-full shadow-xl">
                <div className="flex  space-x-8  items-center">
                  {" "}
                  <div className="flex space-x-2 ">
                    <Tooltip
                      title="Likes"
                      position="top"
                      trigger="mouseenter"
                      arrow={true}
                      delay={300}
                      hideDelay={0}
                      distance={20}
                    >
                      <div className="flex cursor-not-allowed items-center space-x-2 cursor-pointer">
                        <button onClick={handleLike}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            aria-label="clap"
                            className={`${isLiked ? 'text-yellow-500' : ''} fill-current`}

                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"
                            ></path>
                          </svg>
                        </button>
                        <span className="text-sm  text-gray-500">
                          {likeCount}
                        </span>
                      </div>
                    </Tooltip>
                  </div>
                  <div className="flex space-x-2">
                    <Tooltip
                      // options
                      title="Respond"
                      position="top"
                      trigger="mouseenter"
                      arrow={true}
                      delay={300}
                      hideDelay={0}
                      distance={20}
                    >
                      <div
                        onClick={() => setcommentside(true)}
                        className="flex space-x-2 items-center cursor-pointer"
                      >
                        <Comment />
                        <span className="text-sm text-gray-500">
                          {totalCount}
                        </span>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            {/* like x Comment fixed */}

            <article className="">
              <h1 className="text-[32px] border-b-[1px] font-bold  mb-3 text-black ">
                {title}
              </h1>
              <h2 className="text-[20px]  font-light text-gray-500">
                {deskripsi_kecil}
              </h2>
              {isopen && (
                <div
                  onClick={() => setisopen(false)}
                  className="fixed inset-0 z-40 bg-gray-200/95"
                ></div>
              )}
              <div onClick={() => setisopen((prev) => !prev)}>
                <img
                  className={`${isopen
                    ? "max-h-[600px]  fixed z-50  m-auto inset-x-0 inset-y-0 p-2 bg-white rounded-sm overflow-y-scroll cursor-zoom-out   duration-500 ease-in-out"
                    : "h-auto  cursor-zoom-in my-8 w-full object-cover   duration-500 ease-in-out"
                    }`}
                  src={gambar}
                  alt="image"
                />
              </div>
            </article>
            <div className="tinymce-content">
              {parse(deskripsi_panjang)}
            </div>
            {/* side comment */}

            <div className="">
              {commentside && (
                <div
                  onClick={() => setcommentside(false)}
                  className="fixed cursor-pointer z-40 inset-0 bg-gray-600/20"
                ></div>
              )}
              <div
                className={`${commentside
                  ? "bg-white overflow-x-hidden z-[100]  overflow-y-scroll translate-x-[0%] duration-500 drop-shadow-[0_35px_135px_rgba(0,0,0,0.5)] px-6 pt-6 h-full fixed w-[90%] md:w-[60%] lg:w-[45%] xl:w-[25%]  right-0 bottom-0"
                  : "bg-white  translate-x-[300%] duration-500 drop-shadow-[0_35px_135px_rgba(0,0,0,0.5)] px-6 pt-6 h-full fixed w-[25%]  right-0 bottom-0"
                  }`}
              >
                <div className="flex  items-center justify-between">
                  <h1 className="text-gray-900 font-bold text-xl">
                    Diskusi ({totalCount})
                  </h1>
                  <div className="flex  space-x-4 items-center">
                    <Tooltip
                      // options
                      title="View Community Guidelines"
                      position="bottom"
                      trigger="mouseenter"
                      arrow={true}
                      delay={300}
                      hideDelay={0}
                      distance={20}
                    >
                      <div className="flex space-x-2 cursor-pointer">
                        <MdOutlinePrivacyTip className="text-xl text-gray-700 hover:text-gray-900 duration-500 cursor-pointer " />
                      </div>
                    </Tooltip>

                    <VscClose
                      onClick={() => setcommentside(false)}
                      className="text-2xl text-gray-700 hover:text-gray-900 duration-500 cursor-pointer"
                    />
                  </div>{" "}
                </div>

                <div className="">
                  <div>
                    <Komentar id={id} slug={slug} />
                  </div>
                </div>
              </div>
            </div>

            {/* comment and like */}
            <div
              ref={myRef}
              id="hide"
              className="flex mb-8 mt-16 justify-between items-center"
            >
              <div className="flex  space-x-8  items-center">
                {" "}
                <div className="flex space-x-2">
                  <Tooltip
                    // options

                    title="Likes"
                    position="top"
                    trigger="mouseenter"
                    arrow={true}
                    delay={300}
                    hideDelay={0}
                    distance={20}
                  >
                    <div className="flex cursor-not-allowed space-x-2 cursor-pointer">
                      <button onClick={handleLike}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          aria-label="clap"
                          className={`${isLiked ? 'text-yellow-500' : 'gray'}`}
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"
                          ></path>
                        </svg>
                      </button>

                      <span className="text-sm text-gray-500">{likeCount}</span>
                    </div>
                  </Tooltip>
                </div>
                <div className="flex space-x-2">
                  <Tooltip
                    // options
                    title="Respond"
                    position="top"
                    trigger="mouseenter"
                    arrow={true}
                    delay={300}
                    hideDelay={0}
                    distance={20}
                  >
                    <div
                      onClick={() => setcommentside(true)}
                      className="flex space-x-2 cursor-pointer"
                    >
                      <Comment />
                      <span className="text-sm text-gray-500">
                        {totalCount}
                      </span>
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className="flex  cursor-not-allowed  space-x-2 ">
                <Tooltip
                  // options
                  title="Belum bekerja"
                  position="top"
                  trigger="mouseenter"
                  arrow={true}
                  delay={300}
                  hideDelay={0}
                  distance={20}
                >
                  <div className=" cursor-not-allowed flex space-x-2">
                    <Save />
                  </div>
                </Tooltip>
              </div>
            </div>

            <div className="">

              <div className="w-full">

                {/* write on medium */}
                <div className="border-b-[1px] border-gray-200 my-10 " />
                <div className="flex justify-center items-center space-x-4">
                  <h1>Bagikan ide Anda dengan jutaan pembaca.</h1>
                  <Tooltip
                    title="Belum bekerja"
                    position="right"
                    trigger="mouseenter"
                    arrow={true}
                    delay={300}
                    hideDelay={0}
                    distance={20}
                  >
                    <button className="bg-gray-800 cursor-not-allowed text-sm hover:bg-gray-900 duration-500 px-4 py-2 text-white rounded-full">
                      Write on medium
                    </button>
                  </Tooltip>
                </div>

                {/* posts on map */}
                <div className="border-b-[1px] border-gray-200 my-10 " />
                <h3 className="text-gray-900 text-md font-semibold capitalize">Terbaru di Penaly</h3>
                {postsNew.slice(0, 10)?.map((post) => (
                  <div key={post.id}>
                    <Link
                      passHref
                      key={post.id}
                      href={`/post/${post.slug}`}
                    >
                      <div className="flex  space-y-4 justify-between items-center">
                        <div className="space-y-2 flex flex-col  cursor-pointer">
                          <div>
                            <p className="text-sm text-gray-500">
                              <FormatDate timestamp={post.dibuat_pada} />
                            </p>
                            <p className="sm:text-[21px] text-[18px]  font-semibold ">
                              {post.title}
                            </p>
                          </div>
                          <div className="sm:line-clamp-3 line-clamp-2 text-[13px] sm:text-[15px] text-gray-900">
                            {" "}
                            {post.deskripsi_kecil}
                          </div>
                        </div>
                        <img
                          className="object-cover cursor-pointer w-24 h-24 sm:w-36 ml-10 sm:h-36"
                          src={post.gambar}
                          alt={post.title}
                        />
                      </div>
                    </Link>
                    <div className="border-b-[1px] border-gray-200 my-10 " />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* posts on map */}

        {/* third section */}
        <div className="h-[110vh]   hidescrollbar relative hidden xl:flex">
          <div
            className={`${user
              ? "fixed     bottom-0 top-0 overflow-y-scroll  w-[380px] col-span-2 px-8 py-0"
              : "fixed    bottom-0 top-0 overflow-y-scroll  w-[380px] col-span-2 px-8 py-16"
              }`}
          >
            {!user && (
              <div className="space-x-8">
                <button
                  onClick={() => setsignup(true)}
                  className="bg-gray-800 hover:bg-gray-900 duration-500 px-16 py-2 rounded-full text-white"
                >
                  Get started
                </button>
                <button
                  onClick={() => {
                    setsignup(true);
                    setsign(1);
                  }}
                  className="text-black hover:text-green-600"
                >
                  Sign in
                </button>
              </div>
            )}
            <div className="w-full py-10 relative">
              <input
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="px-12 w-[100%] py-2 rounded-full border-gray-200 border-[1px] outline-none text-sm"
                type="text"
                placeholder="Search.."
                name=""
                id=""
              />
              <FiSearch className="absolute -translate-y-1/2 top-1/2  -translate-x-1/2 left-8 h-4" />
            </div>
            <div>
              {searchTerm !== "" && (
                <div
                  className={`${user
                    ? "bg-gray-100 w-[330px] top-[95px]  absolute p-4 space-y-2 rounded-md shadow-lg backdrop-blur-xl"
                    : "bg-gray-100 w-[330px]  top-[200px]  absolute p-4 space-y-2 rounded-md shadow-lg backdrop-blur-xl"
                    }`}
                >
                  <h2 className="mt-4">Dari Penaly</h2>
                  <hr />
                  {posts
                    .filter((val) => {
                      if (
                        val.title.toLowerCase().includes(searchTerm.toLowerCase())
                      ) {
                        return val;
                      } else if (searchTerm == "") {
                        return val;
                      }
                    })
                    .map((post) => {
                      return (
                        <>
                          <div>
                            <Link
                              passHref
                              key={post.id}
                              href={`/post/${post.slug}`}
                            >
                              <div key={post.id}>
                                <div className="my-8 cursor-pointer ">
                                  <h2 className="text-sm word-breaks text-gray-900 hover:text-black duration-100">
                                    {post.title}
                                  </h2>

                                  <h2 className="text-xs text-gray-500">
                                    {" "}
                                    <FormatDate timestamp={post.dibuat_pada} />
                                  </h2>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </>
                      );
                    })}
                </div>
              )}
            </div>
            {/* //* Sidebar */}
            <div>
              <div>
                <img
                  className="h-24 w-24 object-cover rounded-full"
                  src={penulisFoto}
                  alt=""
                />
                <h1 className="font-bold py-4 text-gray-900">
                  {penulis}
                </h1>
                <h2 className="text-gray-500 text-sm">
                  {penulisBio}
                </h2>
                <br />
                <hr />
                <div className="py-4">
                  <h2 className="text-gray-900 text-md font-semibold capitalize">
                    Paling Disukai di Penaly
                  </h2>
                  <div className="py-6">
                    {posts.slice(0, 5)?.map((post) => (
                      <Link
                        passHref
                        key={post.id}
                        href={`/post/${post.slug}`}
                      >
                        <div className="flex items-start justify-between py-4">
                          <div className="space-y-2 flex flex-col jusify-center cursor-pointer">
                            <div className="flex items-center space-x-2">
                              {" "}
                              <img
                                alt="r"
                                className="h-6 rounded-full"
                                src={post.user.foto}
                              />
                              <span className="text-sm font-normal capitalize">
                                {post.user.username}
                              </span>
                            </div>
                            <div>
                              <p className="text-[16px] text-md font-semibold w-[225px]">
                                {post.title}
                              </p>
                            </div>
                          </div>
                          <div className="h-16 w-16 flex justify-start">
                            <img
                              className="h-full w-full rounded-md cursor-pointer  object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                              src={post.gambar}
                              alt="image"
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                            <div class="ml-3 text-sm space-x-2">
                              <input
                                id="remember"
                                aria-describedby="remember"
                                type="checkbox"
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""
                                onChange={(e) => setRememberMe(e.target.checked)}

                              />

                              <label for="remember" className="text-sm font-medium text-primary-400 hover:underline dark:text-primary-400">Ingat Saya</label>
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
      </main>
    </Layout>
  );
}


export default connect(
  (state) => {
    return {
      user: state.user.user
    }
  }
)(Post);

function CommentSent() {
  return (
    <svg
      className="max-h-[100px] my-6"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      data-name="Layer 1"
      width="924"
      height="458.12749"
      viewBox="0 0 924 458.12749"
    >
      <ellipse
        cx="448.17846"
        cy="584.7146"
        rx="21.53369"
        ry="6.76007"
        transform="translate(-396.01217 573.65899) rotate(-69.08217)"
        fill="#2f2e41"
      />
      <circle
        cx="408.37125"
        cy="617.2367"
        r="43.06735"
        transform="translate(-404.30923 700.52813) rotate(-80.78252)"
        fill="#2f2e41"
      />
      <rect
        x="250.74566"
        y="430.10005"
        width="13.08374"
        height="23.44171"
        fill="#2f2e41"
      />
      <rect
        x="276.91314"
        y="430.10005"
        width="13.08374"
        height="23.44171"
        fill="#2f2e41"
      />
      <ellipse
        cx="261.6488"
        cy="453.81434"
        rx="10.90314"
        ry="4.08868"
        fill="#2f2e41"
      />
      <ellipse
        cx="287.81628"
        cy="453.26918"
        rx="10.90314"
        ry="4.08868"
        fill="#2f2e41"
      />
      <circle
        cx="409.4616"
        cy="606.33348"
        r="14.71922"
        transform="translate(-155.63358 -208.64722) rotate(-1.68323)"
        fill="#fff"
      />
      <circle cx="271.4616" cy="385.39723" r="4.90643" fill="#3f3d56" />
      <path
        d="M366.59454,577.1852c-3.47748-15.57379,7.63867-31.31043,24.82861-35.1488s33.94423,5.67511,37.42171,21.24884-7.91492,21.31762-25.10486,25.156S370.072,592.75905,366.59454,577.1852Z"
        transform="translate(-138 -220.93625)"
        fill="#e6e6e6"
      />
      <ellipse
        cx="359.86311"
        cy="597.25319"
        rx="6.76007"
        ry="21.53369"
        transform="translate(-471.98369 445.52283) rotate(-64.62574)"
        fill="#2f2e41"
      />
      <path
        d="M387.21673,632.77358c0,4.21515,10.85327,12.53857,22.89656,12.53857s23.33515-11.867,23.33515-16.08209-11.29193.81775-23.33515.81775S387.21673,628.55843,387.21673,632.77358Z"
        transform="translate(-138 -220.93625)"
        fill="#fff"
      />
      <path
        d="M711.25977,500.2,664.48,546.37,558.75977,650.69l-2.13965,2.11L544.7002,664.56,519.71,639.87l-2.20019-2.17-45.69-45.13h-.00976L457.16992,578.1l-8.6499-8.55-25.76025-25.44-3.4795-3.44-41.06006-40.56a117.65792,117.65792,0,0,1-20.52-27.63c-.5-.91-.97022-1.83-1.43018-2.75A117.50682,117.50682,0,0,1,480.98,301.2h.01025c.37989.06.75.12,1.12989.2a113.60526,113.60526,0,0,1,11.91015,2.77A117.09292,117.09292,0,0,1,523.1499,317.1q1.4253.885,2.82031,1.8a118.17183,118.17183,0,0,1,18.46973,15.09l.3501-.35.3501.35a118.54248,118.54248,0,0,1,10.83007-9.58c.82959-.65,1.66993-1.29,2.50977-1.91a117.44922,117.44922,0,0,1,90.51025-21.06,111.92113,111.92113,0,0,1,11.91993,2.78q1.96507.55509,3.8999,1.2c1.04.34,2.08008.69,3.10986,1.07a116.42525,116.42525,0,0,1,24.39014,12.1q2.50488,1.63494,4.93994,3.42A117.54672,117.54672,0,0,1,711.25977,500.2Z"
        transform="translate(-138 -220.93625)"
        fill="#37a34a"
      />
      <path
        d="M664.48,546.37,558.75977,650.69l-2.13965,2.11L544.7002,664.56,519.71,639.87l-2.20019-2.17-45.69-45.13c7.34034-1.71,18.62012.64,22.75,2.68,9.79,4.83,17.84034,12.76,27.78028,17.28A46.138,46.138,0,0,0,550.68018,615.66c17.81982-3.74,31.60986-17.52,43.77-31.08,12.15966-13.57,24.58984-28.13,41.67968-34.42C645.14014,546.84,654.81982,546.09,664.48,546.37Z"
        transform="translate(-138 -220.93625)"
        opacity="0.15"
      />
      <path
        d="M741.33984,335.92a118.15747,118.15747,0,0,0-52.52978-30.55c-1.31983-.37-2.62988-.7-3.96-1.01A116.83094,116.83094,0,0,0,667.46,301.57c-1.02-.1-2.04-.17-3.06982-.22a115.15486,115.15486,0,0,0-15.43018.06,118.39675,118.39675,0,0,0-74.83984,33.45l-.36035-.36-.35987.36a118.61442,118.61442,0,0,0-46.6997-28.08c-.99024-.32-1.99024-.63-2.99024-.92a119.67335,119.67335,0,0,0-41.62012-4.45c-.38964.02-.77978.05-1.15966.09a118.30611,118.30611,0,0,0-69.39991,29.4c-1.82031,1.6-3.61035,3.28-5.35009,5.02A119.14261,119.14261,0,0,0,379.54,463.47c.3501.94.73,1.87006,1.12988,2.8a118.153,118.153,0,0,0,25.51026,37.95l38.91992,38.42,3.06006,3.03,84.21972,83.13,2.16992,2.15,22.12012,21.84,17.08985,16.87L741.33984,504.21A119.129,119.129,0,0,0,741.33984,335.92ZM739.23,502.08,573.75977,665.44l-14.94971-14.76-21.6499-21.37-2.16993-2.14-82.58007-81.53-3.01026-2.97L408.2998,502.09A115.19343,115.19343,0,0,1,383.54,465.37c-.3999-.93-.78027-1.86-1.12988-2.79A116.13377,116.13377,0,0,1,408.2998,338.04q2.79054-2.79,5.71-5.34H414.02a115.38082,115.38082,0,0,1,66.48-28.16q4.905-.42,9.81982-.42c1.23,0,2.4502.02,3.68018.06a116.0993,116.0993,0,0,1,29.6499,4.8c.99024.29,1.98.6,2.96.93a114.15644,114.15644,0,0,1,29.33008,14.49,115.61419,115.61419,0,0,1,16.41016,13.64l1.06006,1.06.34961-.35.35009.35,1.06006-1.06a115.674,115.674,0,0,1,85.71-33.86c1.27.04,2.54.1,3.81006.19,1.02.06,2.04.13,3.05029.23a115.12349,115.12349,0,0,1,19.08985,3.35c1.33984.34,2.66992.71,3.98974,1.12A115.9591,115.9591,0,0,1,739.23,502.08Z"
        transform="translate(-138 -220.93625)"
        fill="#3f3d56"
      />
      <path
        d="M506.87988,308.71c-6.41992,5.07-13.31006,9.75-17.48,16.68-3.06982,5.12-4.3999,11.07-5.39013,16.95-1.91993,11.44-2.73975,23.16-6.5,34.12994-3.75,10.97-11.06983,21.45-21.91993,25.54-6.73,2.53-14.1499,2.39-21.31982,1.9-17.68994-1.2-35.5-4.37-51.41992-12.16-8.8999-4.36-17.53028-10.24-27.41992-10.89a25.39538,25.39538,0,0,0-6.02.33A117.494,117.494,0,0,1,480.98,301.2h.01025c.37989.06.75.12,1.12989.2a113.60526,113.60526,0,0,1,11.91015,2.77A117.48205,117.48205,0,0,1,506.87988,308.71Z"
        transform="translate(-138 -220.93625)"
        opacity="0.15"
      />
      <path
        d="M224.76412,625.76982a28.74835,28.74835,0,0,0,27.7608-4.89018c9.72337-8.16107,12.77191-21.60637,15.25242-34.056L275.11419,550l-15.36046,10.57663c-11.04633,7.60609-22.34151,15.45585-29.99,26.47289s-10.987,26.0563-4.8417,37.97726Z"
        transform="translate(-138 -220.93625)"
        fill="#e6e6e6"
      />
      <path
        d="M226.07713,670.35248c-1.55468-11.32437-3.15331-22.7942-2.06278-34.24.96851-10.16505,4.06971-20.09347,10.38337-28.23408a46.968,46.968,0,0,1,12.0503-10.9196c1.205-.76061,2.31413,1.14911,1.11434,1.90641a44.6513,44.6513,0,0,0-17.66194,21.31042c-3.84525,9.78036-4.46274,20.44179-3.80011,30.83136.40072,6.283,1.25,12.52474,2.1058,18.75851a1.14389,1.14389,0,0,1-.771,1.358,1.11066,1.11066,0,0,1-1.358-.771Z"
        transform="translate(-138 -220.93625)"
        fill="#f2f2f2"
      />
      <path
        d="M241.05156,650.3137a21.16242,21.16242,0,0,0,18.439,9.51679c9.33414-.4431,17.11583-6.95774,24.12082-13.14262l20.71936-18.29363L290.618,627.738c-9.86142-.47193-19.97725-.91214-29.36992,2.12894s-18.05507,10.35987-19.77258,20.082Z"
        transform="translate(-138 -220.93625)"
        fill="#e6e6e6"
      />
      <path
        d="M221.68349,676.86232c7.48292-13.24055,16.16246-27.95592,31.67134-32.65919a35.34188,35.34188,0,0,1,13.32146-1.37546c1.41435.12195,1.06117,2.30212-.3506,2.18039a32.83346,32.83346,0,0,0-21.259,5.62435c-5.99423,4.0801-10.66138,9.75253-14.61162,15.76788-2.41964,3.68458-4.587,7.52548-6.75478,11.36122-.69277,1.22582-2.7177.341-2.01683-.89919Z"
        transform="translate(-138 -220.93625)"
        fill="#f2f2f2"
      />
      <circle cx="300.09051" cy="76.05079" r="43.06733" fill="#2f2e41" />
      <rect
        x="280.4649"
        y="109.85048"
        width="13.08374"
        height="23.44171"
        fill="#2f2e41"
      />
      <rect
        x="306.63238"
        y="109.85048"
        width="13.08374"
        height="23.44171"
        fill="#2f2e41"
      />
      <ellipse
        cx="291.36798"
        cy="133.56477"
        rx="10.90314"
        ry="4.08868"
        fill="#2f2e41"
      />
      <ellipse
        cx="317.53552"
        cy="133.0196"
        rx="10.90314"
        ry="4.08868"
        fill="#2f2e41"
      />
      <circle cx="301.18084" cy="65.14766" r="14.71923" fill="#fff" />
      <ellipse
        cx="444.18084"
        cy="289.08391"
        rx="4.88594"
        ry="4.92055"
        transform="translate(-212.34041 177.70056) rotate(-44.98705)"
        fill="#3f3d56"
      />
      <path
        d="M396.31372,256.93569c-3.47748-15.57379,7.63865-31.31043,24.82866-35.14881s33.94421,5.67511,37.42169,21.24891-7.91492,21.31768-25.10486,25.156S399.79126,272.50954,396.31372,256.93569Z"
        transform="translate(-138 -220.93625)"
        fill="#e6e6e6"
      />
      <ellipse
        cx="770.70947"
        cy="573.81404"
        rx="6.76007"
        ry="21.53369"
        transform="translate(-326.96946 400.5432) rotate(-39.51212)"
        fill="#2f2e41"
      />
      <circle
        cx="808.20127"
        cy="616.79758"
        r="43.06735"
        transform="translate(-226.36415 -83.51221) rotate(-9.21748)"
        fill="#2f2e41"
      />
      <rect
        x="676.74319"
        y="429.66089"
        width="13.08374"
        height="23.44171"
        fill="#2f2e41"
      />
      <rect
        x="650.5757"
        y="429.66089"
        width="13.08374"
        height="23.44171"
        fill="#2f2e41"
      />
      <ellipse
        cx="678.92379"
        cy="453.37519"
        rx="10.90314"
        ry="4.08868"
        fill="#2f2e41"
      />
      <ellipse
        cx="652.75631"
        cy="452.83005"
        rx="10.90314"
        ry="4.08868"
        fill="#2f2e41"
      />
      <path
        d="M823.27982,593.8192c-13.57764-11.21939-21.12423-21.50665-10.95965-33.80776s29.41145-13.178,42.98908-1.9586,16.34444,30.28655,6.17986,42.58766S836.85746,605.03859,823.27982,593.8192Z"
        transform="translate(-138 -220.93625)"
        fill="#37a34a"
      />
      <circle
        cx="793.31102"
        cy="594.44957"
        r="14.71922"
        transform="translate(-155.11887 -197.37727) rotate(-1.68323)"
        fill="#fff"
      />
      <circle cx="650.1378" cy="369.86765" r="4.90643" fill="#3f3d56" />
      <path
        d="M771.06281,606.5725c-2.98056,2.98056-5.08788,12.64434-.89538,16.83684s16.51464-.26783,19.49516-3.24834-4.50917-3.35271-8.70164-7.54518S774.04337,603.59194,771.06281,606.5725Z"
        transform="translate(-138 -220.93625)"
        fill="#fff"
      />
      <ellipse
        cx="841.39416"
        cy="654.27547"
        rx="6.76007"
        ry="21.53369"
        transform="translate(-316.14156 122.58618) rotate(-20.9178)"
        fill="#2f2e41"
      />
      <path
        d="M1061,679.06375H139a1,1,0,0,1,0-2h922a1,1,0,0,1,0,2Z"
        transform="translate(-138 -220.93625)"
        fill="#ccc"
      />
    </svg>
  );
}
function Comment() {
  return (
    <svg
      className=""
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-label="responses"
    >
      <path d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path>
    </svg>
  );
}
function HomeUnclicked() {
  return (
    <svg
      className="cursor-pointer text-gray-800 hover:text-black duration-100"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Home"
    >
      <path
        d="M4.5 10.75v10.5c0 .14.11.25.25.25h5c.14 0 .25-.11.25-.25v-5.5c0-.14.11-.25.25-.25h3.5c.14 0 .25.11.25.25v5.5c0 .14.11.25.25.25h5c.14 0 .25-.11.25-.25v-10.5M22 9l-9.1-6.83a1.5 1.5 0 0 0-1.8 0L2 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
function Save() {
  return (
    <svg
      className="cursor-not-allowed text-gray-800 hover:text-black duration-100"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
        fill="#000"
      ></path>
    </svg>
  );
}
function HomePhone() {
  return (
    <svg
      className="cursor-pointer text-gray-800 hover:text-black duration-100"
      width="24"
      height="24"
      fill="none"
      aria-label="home"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.72 2.93a.45.45 0 0 1 .56 0l.34-.43-.34.43 9.37 7.5a.56.56 0 1 0 .7-.86l-9.38-7.5a1.55 1.55 0 0 0-1.94 0l-9.38 7.5a.56.56 0 0 0 .7.86l9.37-7.5zm7.17 9.13v-1.4l.91.69a.5.5 0 0 1 .2.4V20a2 2 0 0 1-2 2h-4a.5.5 0 0 1-.5-.5V17a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v4.5a.5.5 0 0 1-.5.5H6a2 2 0 0 1-2-2v-8.25a.5.5 0 0 1 .2-.4l.91-.68V20c0 .5.4.89.89.89h3.39V17a2.11 2.11 0 0 1 2.11-2.11h1A2.11 2.11 0 0 1 14.61 17v3.89H18a.89.89 0 0 0 .89-.89v-7.95z"
        fill="#A8A8A8"
      ></path>
    </svg>
  );
}

function Notif() {
  return (
    <svg
      className="cursor-not-allowed  text-gray-800 hover:text-black duration-100"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Notifications"
    >
      <path
        d="M15 18.5a3 3 0 1 1-6 0"
        stroke="currentColor"
        strokeLinecap="round"
      ></path>
      <path
        d="M5.5 10.53V9a6.5 6.5 0 0 1 13 0v1.53c0 1.42.56 2.78 1.57 3.79l.03.03c.26.26.4.6.4.97v2.93c0 .14-.11.25-.25.25H3.75a.25.25 0 0 1-.25-.25v-2.93c0-.37.14-.71.4-.97l.03-.03c1-1 1.57-2.37 1.57-3.79z"
        stroke="currentColor"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
function Stories() {
  return (
    <svg
      className="cursor-not-allowed  text-gray-800 hover:text-black duration-100"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Stories"
    >
      <path
        d="M4.75 21.5h14.5c.14 0 .25-.11.25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .14.11.25.25.25z"
        stroke="currentColor"
      ></path>
      <path
        d="M8 8.5h8M8 15.5h5M8 12h8"
        stroke="currentColor"
        strokeLinecap="round"
      ></path>
    </svg>
  );
}
function Search() {
  return (
    <svg
      className="cursor-pointer text-gray-800 hover:text-black duration-100"
      width="25"
      height="24"
      fill="none"
      aria-label="search"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.8 10.69a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.95-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .79-.79l-3.73-3.73a8.05 8.05 0 0 0-5.94-13.5z"
        fill="#A8A8A8"
      ></path>
    </svg>
  );
}
function ReadingList() {
  return (
    <svg
      className="cursor-not-allowed  text-gray-800 hover:text-black duration-100"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      aria-label="Reading list"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 3a2 2 0 0 0-2 2v1H6a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4V8a2 2 0 0 0-2-2H9V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v12a.5.5 0 1 0 1 0V5a2 2 0 0 0-2-2h-9zM5 8a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v12.98l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V8z"
        fill="#757575"
      ></path>
    </svg>
  );
}
function Readinglist() {
  return (
    <svg
      className="cursor-not-allowed  text-gray-800 hover:text-black duration-100"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Lists"
    >
      <path
        d="M4.5 6.25V21c0 .2.24.32.4.2l5.45-4.09a.25.25 0 0 1 .3 0l5.45 4.09c.16.12.4 0 .4-.2V6.25a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25z"
        stroke="currentColor"
        strokeLinecap="round"
      ></path>
      <path
        d="M8 6V3.25c0-.14.11-.25.25-.25h11.5c.14 0 .25.11.25.25V16.5"
        stroke="currentColor"
        strokeLinecap="round"
      ></path>
    </svg>
  );
}
