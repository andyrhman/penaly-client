import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import Header from '../../components/Header';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useInView } from "react-intersection-observer";

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

const Categories = () => {
    const pageTitle = `Kategori | ${process.env.siteTitle}`;
    const { ref: myRef, inView: myelemisvisible } = useInView();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);
    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                const { data: tags } = await axios.get(`tags`);
                setTags(tags);
            } catch (error) {
                if (error.response && [401, 403].includes(error.response.status)) {
                    router.push('/');
                }
            } finally {
                setLoading(false);
            }

        })();
    }, [router]);

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
                                <h2 className="text-4xl font-extrabold">Kategori</h2>
                            </div>

                            <div
                                ref={myRef}
                                className="wrapper translate-x-[0] opacity-1 duration-500 mt-4 grid font-poppins grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 lg:p-6"
                            >
                                {tags.map((tag) => (
                                    <Link passHref legacyBehavior key={tag.id} href={`/categories/${tag.slug}`}>
                                        <div
                                            className={`${myelemisvisible
                                                ? "group translate-x-[0] opacity-1 duration-500 border rounded-lg shadow-md cursor-pointer overflow-hidden"
                                                : "group translate-x-[100px] opacity-0 duration-500 border rounded-lg shadow-md cursor-pointer overflow-hidden"
                                                }`}
                                        >
                                            <div className="p-5 bg-white">
                                                <Link
                                                    href={`/categories/${tag.nama}`}
                                                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full bg-opacity-10 ${categoryColors[tag.nama] || 'bg-gray-500'} hover:underline`}
                                                >
                                                    {tag.nama}
                                                </Link>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    }
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

export default Categories