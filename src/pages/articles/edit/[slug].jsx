import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Slide, toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';
import axios from "axios";
import Layout from '../../../components/Layout';
import SEO from "../../../components/SEO";
import Image from "next/image";
import Link from "next/link";
import * as sanitizeHtml from 'sanitize-html';
import ImageUploadArticle from "../../../components/Uploads/ImageUploadArticle";
import 'react-toastify/dist/ReactToastify.css';
import ButtonSpinner from "../../../components/ButtonSpinner";
import SelectTag from "../../../components/SelectGroup/SelectTag";
import Alert from "../../../components/Alert";
import Header from "../../../components/Header";

const EditUser = () => {
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [deskripsi_kecil, setDeskripsiKecil] = useState('');
    const [deskripsi_panjang, setDeskripsiPanjang] = useState('');
    const [estimasi_membaca, setEstimasiMembaca] = useState('');
    const [gambar, setGambar] = useState('');
    const [tag_id, setTagId] = useState('');
    const [tags, setTags] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        if (slug) {
            (
                async () => {
                    try {
                        const { data: t } = await axios.get('tags');
                        setTags(t);

                        const { data } = await axios.get(`articles/${slug}`);
                        setId(data.id)
                        setTitle(data.title);
                        setDeskripsiKecil(data.deskripsi_kecil);
                        setDeskripsiPanjang(data.deskripsi_panjang);
                        setGambar(data.gambar);
                        setEstimasiMembaca(data.estimasi_membaca);
                        setTagId(data.tag_id);
                    } catch (error) {
                        null
                    }
                }
            )();
        }
    }, [router, slug]);

    const ref = useRef(null);
    const updateImage = (url) => {
        if (ref.current) {
            ref.current.value = url;
        }
        setGambar(url);
    }

    useEffect(() => {
        const updateBerhasil = sessionStorage.getItem('updateBerhasil');
        if (updateBerhasil === '1') {
            toast.success('Berhasil Diupdate', {
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
            sessionStorage.removeItem('updateBerhasil');
        }
    }, []);

    const updatePengguna = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.put(`articles/update/${id}`, {
                title,
                deskripsi_kecil,
                deskripsi_panjang,
                estimasi_membaca,
                gambar,
                tag_id
            });
            sessionStorage.setItem('updateBerhasil', '1');
            window.location.reload();
        } catch (error) {
            console.error(error.response);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }

    const formatImageUrl = (url) => {
        if (!url.startsWith('http')) {
            return `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}${url}`;
        }
        return url;
    };


    const pageTitle = `Edit ${sanitizeHtml(title)}| ${process.env.siteTitle}`;

    return (
        <Layout>
            <SEO title={pageTitle} />
            <div className="overflow-x-hidden">
                <Header />
                <div className="mt-28">
                    <div className="container mx-auto px-4">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Link href="/articles" className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                                </svg>
                                <span>Kembali</span>
                            </Link>
                        </div>
                        <div className="flex flex-col gap-10">
                            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-16 sm:px-7.5 xl:pb-20">
                                <div className="rounded-sm bg-white">
                                    <div className="flex flex-col gap-5.5 p-6.5">
                                        <form>
                                            <div className="relative flex justify-center items-center">
                                                <div className="relative flex items-center justify-center drop-shadow-2">
                                                    <Image
                                                        src={formatImageUrl(gambar)}
                                                        width={600}
                                                        height={600}
                                                        className="object-cover"
                                                        alt={title}
                                                    />
                                                    <label
                                                        htmlFor="profile"
                                                        className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                                                    >
                                                        <svg
                                                            className="fill-current"
                                                            width="14"
                                                            height="14"
                                                            viewBox="0 0 14 14"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                                                                fill=""
                                                            />
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                                                                fill=""
                                                            />
                                                        </svg>
                                                        <ImageUploadArticle uploaded={updateImage} />
                                                    </label>
                                                </div>
                                            </div>

                                            {error && <Alert error={error} />}
                                            <div>
                                                <label className="mb-3 block text-sm font-medium text-black">
                                                    Judul
                                                </label>
                                                <input
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    type="text"
                                                    maxLength={100}
                                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-3 block text-sm font-medium text-black">
                                                    Deskripsi
                                                </label>
                                                <textarea
                                                    defaultValue={deskripsi_kecil}
                                                    onChange={(e) => setDeskripsiKecil(e.target.value)}
                                                    rows={6}
                                                    maxLength={250}
                                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="mb-3 block text-sm font-medium text-black">
                                                    Isi Konten
                                                </label>
                                                <Editor
                                                    apiKey={process.env.NEXT_PUBLIC_TINY_MCE}
                                                    value={deskripsi_panjang}
                                                    init={{
                                                        height: 500,
                                                        menubar: true,
                                                        plugins: [
                                                            "advlist", "autolink", "link", "image", "lists", "charmap", "print", "preview", "hr", "anchor", "pagebreak",
                                                            "searchreplace", "wordcount", "visualblocks", "visualchars", "code", "fullscreen", "insertdatetime", "media", "nonbreaking",
                                                            "save", "table", "directionality", "emoticons", "template", "paste", "textpattern", "codesample"
                                                        ],
                                                        toolbar1: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
                                                            'bullist numlist outdent indent | link image ',
                                                        toolbar2: 'print preview media | forecolor backcolor emoticons | code codesample',
                                                        toolbar_mode: 'floating',
                                                        tinycomments_mode: 'embedded',
                                                        tinycomments_author: 'Author name',
                                                    }}
                                                    onEditorChange={(content) => setDeskripsiPanjang(content)}
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-3 block text-sm font-medium text-black">
                                                    Estimasi Membaca
                                                </label>
                                                <input
                                                    value={estimasi_membaca}
                                                    onChange={(e) => setEstimasiMembaca(e.target.value)}
                                                    type="text"
                                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                                />
                                            </div>
                                            <div>
                                                <SelectTag nama_tag={tag_id} tags={tags} onChange={(value) => setTagId(value)} />
                                            </div>
                                            <br />
                                        </form>
                                        <button
                                            onClick={updatePengguna}
                                            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 w-full lg:w-full xl:w-full"
                                        >
                                            {loading ? <ButtonSpinner /> : "Update"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EditUser;
