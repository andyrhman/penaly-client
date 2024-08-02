import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import Header from '../../components/Header';
import TablePagination from '@mui/material/TablePagination';
import DeleteNotification from "../../components/Modals/Delete";
import axios from "axios";
import FormatDate from "../../services/format-time";
import Link from "next/link";
import Image from "next/image";
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Article = () => {
    const pageTitle = `Artikelku | ${process.env.siteTitle}`;
    const [articles, setArticles] = useState([]);
    const [filters, setFilters] = useState({
        s: '',
        status: ''
    });
    const [articleCounts, setArticleCounts] = useState({
        all: 0,
        publish: 0,
        pending: 0,
        ditolak: 0
    });
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const deleteSuccess = sessionStorage.getItem('deleteSuccess');
        if (deleteSuccess === '1') {
            toast.success('Berhasil Dihapus!', {
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
            sessionStorage.removeItem('deleteSuccess');
        }
    }, []);

    useEffect(() => {
        const updateStatusSuccess = sessionStorage.getItem('updateStatusSuccess');
        if (updateStatusSuccess === '1') {
            toast.success('Status Berhasil Diganti!', {
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
            sessionStorage.removeItem('updateStatusSuccess');
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const arr = [];
                if (filters.s) {
                    arr.push(`search=${filters.s}`);
                }
                if (filters.status) {
                    arr.push(`filter=${filters.status}`);
                }
                const { data: article } = await axios.get(`artikelku?${arr.join('&')}`);
                setArticles(article);
                // You might want to reset the page if you're using pagination
                // setPage(0);
            } catch (error) {
                if (error.response && [401, 403].includes(error.response.status)) {
                    router.push('/');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filters, router]);

    useEffect(() => {
        (
            async () => {
                try {
                    const { data: counts } = await axios.get(`artikelku/hitung`);
                    setArticleCounts(counts);
                } catch (error) {
                    if (error.response && [401, 403].includes(error.response.status)) {
                        router.push('/');
                    }
                }
            }
        )();
    }, []);

    const search = (s) => {
        setFilters({
            ...filters,
            s
        });
    };

    const setStatusFilter = (status) => {
        setFilters({
            ...filters,
            status
        });
    };

    const [articleId, setArticleId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => setOpenDialog(!openDialog);

    const handleConfirmDelete = async () => {
        await axios.delete(`articles/delete/${articleId}`);
        setArticles(articles.filter((u) => u.id !== articleId));
        handleOpenDialog();
        sessionStorage.setItem('deleteSuccess', '1');
        window.location.reload();
    };

    const del = (id) => {
        setArticleId(id);
        handleOpenDialog();
    };

    const maxLength = 50;
    return (
        <Layout>
            <SEO title={pageTitle} />
            <div className="overflow-x-hidden">
                <Header />
                <div className="mb-28">
                    {loading ?
                        <>
                            <div className="flex h-screen items-center justify-center">
                                <div className="h-16 w-16 animate-spin  rounded-full border-4 border-solid border-violet-500 border-t-transparent"></div>
                            </div>
                        </> :
                        <>
                            <DeleteNotification open={openDialog} handleOpenDelete={handleOpenDialog} handleConfirmDelete={handleConfirmDelete} />
                            {articles.length > 0 ? (
                                <div className="wrapper translate-x-[0] opacity-1 duration-500 mt-28 font-poppins">

                                    <div className="mt-40 relative overflow-x-auto shadow-md sm:rounded-lg">
                                        <h1 className='text-center mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-1xl'>Daftar Artikel</h1>
                                        <ul className="flex flex-wrap -mb-px">
                                            <li className="me-2">
                                                <button
                                                    onClick={() => setStatusFilter('')}
                                                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${filters.status === '' ? 'text-blue-600 border-blue-600' : 'border-transparent hover:text-blue-600 hover:border-blue-300'}`}
                                                    disabled={articleCounts.all === 0}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={`w-4 h-4 me-2 ${filters.status === '' ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'} bi bi-stack`} viewBox="0 0 18 18">
                                                        <path d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.6.6 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.6.6 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.6.6 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535z" />
                                                        <path d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.6.6 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0z" />
                                                    </svg>
                                                    Semua
                                                </button>
                                            </li>
                                            <li className="me-2">
                                                <button
                                                    onClick={() => setStatusFilter('publish')}
                                                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${filters.status === 'publish' ? 'text-blue-600 border-blue-600' : 'border-transparent hover:text-blue-600 hover:border-blue-300'}`}
                                                    disabled={articleCounts.publish === 0}
                                                >
                                                    <svg className={`w-4 h-4 me-2 ${filters.status === 'publish' ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                                                    </svg>
                                                    Diterbitkan
                                                </button>
                                            </li>
                                            <li className="me-2">
                                                <button
                                                    onClick={() => setStatusFilter('pending')}
                                                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${filters.status === 'pending' ? 'text-blue-600 border-blue-600' : 'border-transparent hover:text-blue-600 hover:border-blue-300'}`}
                                                    disabled={articleCounts.pending === 0}
                                                >
                                                    <svg className={`w-4 h-4 me-2 ${filters.status === 'pending' ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                                                    </svg>
                                                    Pending
                                                </button>
                                            </li>
                                            <li className="me-2">
                                                <button
                                                    onClick={() => setStatusFilter('ditolak')}
                                                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${filters.status === 'ditolak' ? 'text-blue-600 border-blue-600' : 'border-transparent hover:text-blue-600 hover:border-blue-300'}`}
                                                    disabled={articleCounts.ditolak === 0}
                                                >
                                                    <svg className={`w-4 h-4 me-2 ${filters.status === 'ditolak' ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                                                    </svg>
                                                    Ditolak
                                                </button>
                                            </li>
                                        </ul>
                                        <div className="pb-4 flex items-center justify-between mb-3 bg-white">
                                            <label htmlFor="table-search" className="sr-only">Search</label>
                                            <div className="relative mt-1">
                                                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                                    </svg>
                                                </div>
                                                <input type="text" onChange={(e) => search(e.target.value)} id="table-search" className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Cari Artikel" />
                                            </div>
                                            <div className="relative mt-1">
                                                <Link href={'/articles/create'} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                                                    Buat Artikel
                                                </Link>
                                            </div>
                                        </div>
                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">
                                                        Judul
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Estimasi Membaca
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Dibuat Pada
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {articles.slice(page * perPage, (page + 1) * perPage).map((a, index) => {
                                                    const status = a.status_publish[0] ? a.status_publish[0].status : "Unknown";

                                                    return (
                                                        <tr className="bg-white border-b  hover:bg-gray-50" key={index}>
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                {a.title}
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                {a.estimasi_membaca}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <FormatDate timestamp={a.dibuat_pada} />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${status === "Diterbitkan"
                                                                    ? "bg-lime-600 text-lime-600"
                                                                    : status === "Pending"
                                                                        ? "bg-yellow-500 text-yellow-500"
                                                                        : "bg-rose-500 text-rose-500"
                                                                    }`}>
                                                                    {status}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center space-x-3.5">
                                                                    <Link href={`/articles/show/${a.slug}`} className="hover:text-primary">
                                                                        <svg
                                                                            className="fill-current"
                                                                            width="18"
                                                                            height="18"
                                                                            viewBox="0 0 18 18"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <path
                                                                                d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                                                                fill=""
                                                                            />
                                                                            <path
                                                                                d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                                                                fill=""
                                                                            />
                                                                        </svg>
                                                                    </Link>
                                                                    <Link href={`/articles/edit/${a.slug}`} className="hover:text-primary">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 17 17">
                                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                                        </svg>
                                                                    </Link>
                                                                    <button className="hover:text-primary" onClick={() => del(a.id)}>
                                                                        <svg
                                                                            className="fill-current"
                                                                            width="18"
                                                                            height="18"
                                                                            viewBox="0 0 18 18"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <path
                                                                                d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                                                fill=""
                                                                            />
                                                                            <path
                                                                                d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                                                fill=""
                                                                            />
                                                                            <path
                                                                                d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                                                                fill=""
                                                                            />
                                                                            <path
                                                                                d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                                                                fill=""
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <TablePagination
                                                        count={articles.length}
                                                        page={page}
                                                        onPageChange={(e, newPage) => setPage(newPage)}
                                                        rowsPerPage={perPage}
                                                        rowsPerPageOptions={[10, 25, 50, 100]}
                                                        onRowsPerPageChange={(e) => setPerPage(parseInt(e.target.value))}
                                                    />
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="wrapper translate-x-[0] opacity-1 duration-500 mt-28 font-poppins">
                                    <div className="flex flex-col justify-center items-center text-center py-10 shadow-md sm:rounded-lg">

                                        <h2 className="text-4xl font-extrabold">Artikel anda kosong 😱!</h2>
                                        <p className="my-4 text-lg text-gray-500">
                                            Mulai buat sekarang agar artikelmu bisa dibaca oleh ribuan pengguna Penaly.
                                        </p>

                                        <Image src="/images/not-found.png" alt="Not Found" width={120} height={120} priority />
                                        <div className="relative my-7">
                                            <Link href={'/articles/create'} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                                                Buat Artikel
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>}
                </div>
            </div>
        </Layout>
    )
}

export default Article