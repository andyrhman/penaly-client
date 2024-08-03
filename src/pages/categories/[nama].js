import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import Header from '../../components/Header';
import Link from 'next/link';
import formatCreationDate from '../../services/formatCreationDate';
import { useRouter } from 'next/router';
import { useInView } from "react-intersection-observer";

const NamaKategori = () => {
    const pageTitle = `Kategori | ${process.env.siteTitle}`;
    const { ref: myRef, inView: myelemisvisible } = useInView();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [displayedPosts, setDisplayedPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;
    const router = useRouter();
    const { nama } = router.query;

    useEffect(() => {
        if (nama) {
            fetchData();
        }
    }, [router, nama]);

    const fetchData = async () => {
        setLoading(true);

        try {
            const { data } = await axios.get(`article/tags/${nama}`);
            setPosts(data.article); // Store the articles array in posts
            setDisplayedPosts(data.article.slice(0, postsPerPage)); // Initial posts to display
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = currentPage + 1;
        const newPosts = posts.slice(0, nextPage * postsPerPage);
        setDisplayedPosts(newPosts);
        setCurrentPage(nextPage);
    };

    return (
        <Layout>
            <SEO title={pageTitle} />
            <div className="overflow-x-hidden grow">
                <Header />

                <div className="mt-48">
                    {loading ?
                        <div className="flex items-center justify-center">
                            <div className="h-16 w-16 animate-spin  rounded-full border-4 border-solid border-violet-500 border-t-transparent"></div>
                        </div>
                        :
                        <>
                            <div className="flex flex-col justify-center items-center text-center">
                                <h2 className="text-4xl font-extrabold">{nama}</h2>
                            </div>

                            <div
                                ref={myRef}
                                className="wrapper translate-x-[0] opacity-1 duration-500 mt-4 grid font-poppins grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 lg:p-6"
                            >
                                {displayedPosts.map((post) => (
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
                                            <div className="p-5 bg-white">
                                                <p className="text-lg font-bold mt-2">{post.title}</p>
                                                <p className="text-sm mb-4">{post.deskripsi_kecil}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 text-sm">{formatCreationDate(post.dibuat_pada)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="flex flex-col justify-center items-center text-center">
                                {displayedPosts.length < posts.length && (
                                    <button onClick={handleLoadMore} disabled={loading} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                        {loading ? 'Loading...' : 'Muat Lagi'}
                                    </button>
                                )}
                            </div>
                        </>}
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
        </Layout>
    )
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

export default NamaKategori;