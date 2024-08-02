import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/router";
import formatCreationDate from "../services/formatCreationDate";
import axios from "axios";
import Link from "next/link";
import Header from "../components/Header";
import Hero from "../components/Hero";
import SEO from "../components/SEO";
import Layout from "../components/Layout";
import Footer from "../components/Footer";

export const posts = [
  {
    _id: "asdf2q3esa",
    slug: {
      current: "test123"
    },
    mainImage: "https://images.pexels.com/photos/4065864/pexels-photo-4065864.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "yes this is dog",
    description: "yes this is dog",
    author: {
      name: "test123",
      image: "https://images.pexels.com/photos/4065864/pexels-photo-4065864.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  },
  {
    _id: "123asdasd",
    slug: {
      current: "test123"
    },
    mainImage: "https://images.pexels.com/photos/4065864/pexels-photo-4065864.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "How to get good at coding",
    description: "yes this is dog",
    author: {
      name: "test123",
      image: "https://images.pexels.com/photos/4065864/pexels-photo-4065864.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  },
  {
    _id: "3213asdasd",
    slug: {
      current: "test123"
    },
    mainImage: "https://images.pexels.com/photos/4065864/pexels-photo-4065864.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "How to escape from tutorial hell",
    description: "yes this is dog",
    author: {
      name: "test123",
      image: "https://images.pexels.com/photos/4065864/pexels-photo-4065864.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  }
]

const categoryColors = {
  Kesehatan: 'bg-lime-500',
  Produktivitas: 'bg-blue-500',
  Marketing: 'bg-red-500',
  'Artificial Intelligence': 'bg-purple-500',
  Programming: 'bg-green-500',
  Gaming: 'bg-yellow-500',
  'Data Science': 'bg-pink-500',
  Edukasi: 'bg-teal-500',
  Religion: 'bg-indigo-500',
  Ekonomi: 'bg-orange-500',
  Travel: 'bg-cyan-500'
};

export default function Home() {
  const pageTitle = `Artikel | ${process.env.siteTitle}`;
  const { ref: myRef, inView: myelemisvisible } = useInView();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    (
      async () => {
        try {
          const { data: post } = await axios.get(`articles/published`);
          setPosts(post);
        } catch (error) {
          if (error.response && [401, 403].includes(error.response.status)) {
            router.push('/');
          }
        }

      }
    )();
  }, [router])

  return (
    <Layout>
      <SEO title={pageTitle} />
      <div className="overflow-x-hidden grow">
        <Header />
        <Hero />

        <div className="mb-48">
          <h2 className="text-4xl font-extrabold">Artikel anda kosong 😱!</h2>
          <div
            ref={myRef}
            className="wrapper translate-x-[0] opacity-1 duration-500 mt-28 grid font-poppins grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 lg:p-6"
          >
            {posts.map((post) => (
              <Link passHref legacyBehavior key={post.id} href={`/post/${post.slug}`}>
                <div
                  className={`${myelemisvisible
                    ? "group translate-x-[0] opacity-1 duration-500 border rounded-lg shadow-md cursor-pointer overflow-hidden"
                    : "group translate-x-[100px] opacity-0 duration-500 border rounded-lg shadow-md cursor-pointer overflow-hidden"
                    }`}
                >
                  <img
                    className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                    src={post.gambar}
                    alt={post.title}
                  />
                  <div className="flex justify-between items-center p-5 bg-white">
                    <div className="flex items-center space-x-2">
                      <svg
                        fill="gray"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        aria-label="clap"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"
                        ></path>
                      </svg>
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className=""
                        width="24"
                        fill="gray"
                        height="24"
                        viewBox="0 0 24 24"
                        aria-label="responses"
                      >
                        <path d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path>
                      </svg>
                      <span>{post.komentarTotal}</span>
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <Link
                      href={`/category/${post.tag.nama}`}
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full bg-opacity-10 ${categoryColors[post.tag.nama] || 'bg-gray-500'} hover:underline`}
                    >
                      {post.tag.nama}
                    </Link>
                    <p className="text-lg font-bold mt-2">{post.title}</p>
                    <p className="text-sm mb-4">{post.deskripsi_kecil}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <img
                          style={{
                            borderRadius: "50%"
                          }}
                          className="h-6"
                          src={post.user.foto}
                          alt={post.user.username}
                        />
                        <span>oleh </span><span className="font-medium uppercase">{post.user.username}</span>
                      </div>
                      <span className="text-gray-500 text-sm">{formatCreationDate(post.dibuat_pada)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* bottom section */}
      <div className="w-full   z-50 block sm:hidden px-[30px] py-[20px] fixed bg-gray-100 shadow-md bottom-0">
        <div className="flex justify-between">
          <Link href="/">
            <div>{router.pathname === "/" ? <Homee /> : <HomePhone />}</div>
          </Link>
          {/* <Home /> */}
          <Link href="/SearchCo">
            <div>
              <Search />
            </div>
          </Link>
          <div>
            <Readinglist />
          </div>
        </div>
      </div>
      {/* bottom section */}
      <Footer/>
    </Layout>
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
function Homee() {
  return (
    <svg
      className="cursor-pointer text-gray-800 hover:text-black duration-100"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="home"
    >
      <path
        d="M4.5 21.25V10.87c0-.07.04-.15.1-.2l7.25-5.43a.25.25 0 0 1 .3 0l7.25 5.44c.06.04.1.12.1.2v10.37c0 .14-.11.25-.25.25h-4.5a.25.25 0 0 1-.25-.25v-5.5a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25v5.5c0 .14-.11.25-.25.25h-4.5a.25.25 0 0 1-.25-.25z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
      ></path>
      <path
        d="M22 9l-9.1-6.83a1.5 1.5 0 0 0-1.8 0L2 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
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

function Readinglist() {
  return (
    <svg
      className="cursor-not-allowed text-gray-800 hover:text-black duration-100"
      width="25"
      height="24"
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
