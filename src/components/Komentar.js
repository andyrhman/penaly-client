import { useEffect, useState } from "react";
import axios from "axios";
import ButtonSpinner from "./ButtonSpinner";
import Image from "next/image";
import FormatDate from "../services/format-time";
import { useRouter } from 'next/router';
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Komentar = ({ id, slug }) => {
    const [komentar, setKomentar] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (id) {
            (
                async () => {
                    try {
                        const { data } = await axios.get(`comments/${id}`);
                        setComments(data);

                        let count = data.length;
                        data.forEach(comment => {
                            count += comment.balasKomentar.length;
                        });
                        setTotalCount(count);
                    } catch (error) {
                        null
                    }
                }
            )();
        }
    }, [id]);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post(`comments/${id}`, {
                komentar
            });

            if (data) {
                toast.success('Komentar terkirim!', {
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
                window.location.reload();
            } else {
                setError('Terjadi kesalahan, mohon ulang lagi sebentar.');
            }
        } catch (error) {
            console.error(error.response);
            if (error.response && [401].includes(error.response.status)) {
                router.push(`/post/${slug}`);
            }
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }

    const toggleLike = async (commentId, liked) => {
        try {
            if (liked) {
                await axios.post(`comments/dislike/${commentId}`);
            } else {
                await axios.post(`comments/like/${commentId}`);
            }
            setComments(comments.map(comment => {
                if (comment.id === commentId) {
                    const newLikeStatus = !liked;
                    return {
                        ...comment,
                        komentarLike: newLikeStatus ? [{ ...comment.komentarLike[0], likes: 1 }] : [],
                        komentarLikeCount: newLikeStatus ? comment.komentarLikeCount + 1 : comment.komentarLikeCount - 1
                    };
                }
                return comment;
            }));
        } catch (error) {
            if (error.response && [401].includes(error.response.status)) {
                router.push(`/post/${slug}`);
            }
            console.error('Error toggling like:', error);
        }
    };

    const [replyCommentId, setReplyCommentId] = useState(null);
    const [replyContent, setReplyContent] = useState('');


    const toggleReply = (commentId, username = '') => {
        setReplyCommentId(replyCommentId === commentId ? null : commentId);
        setReplyContent(username ? `@${username} ` : '');
    };

    const submitReply = async (e, commentId) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post('balaskomentar', {
                komentar_id: commentId,
                reply: replyContent
            });
            setComments(comments.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        balasKomentar: comment.balasKomentar ? [...comment.balasKomentar, data] : [data]
                    };
                }
                return comment;
            }));
            setReplyCommentId(null);
            window.location.reload();
        } catch (error) {
            console.error('Error submitting reply:', error);
            if (error.response && [401].includes(error.response.status)) {
                router.push(`/post/${slug}`);
            }
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleLikeReply = async (commentId, isLiked) => {
        try {
            const response = await axios.post(isLiked ? 'komentar/dislike/balas' : 'komentar/like/balas', {
                komentar_id: commentId
            });

            const updatedComments = comments.map(comment => {
                if (comment.balasKomentar) {
                    comment.balasKomentar = comment.balasKomentar.map(reply => {
                        if (reply.id === commentId) {
                            return {
                                ...reply,
                                komentarBalasLike: isLiked ? [] : [{ id: commentId, user_id: 'current_user_id' }],
                                komentarBalasLikeCount: isLiked ? reply.komentarBalasLikeCount - 1 : reply.komentarBalasLikeCount + 1
                            };
                        }
                        return reply;
                    });
                }
                return comment;
            });

            setComments(updatedComments);
        } catch (error) {
            if (error.response && [401].includes(error.response.status)) {
                router.push(`/post/${slug}`);
            }
            console.error(error.response);
        }
    };

    const getRoleLabel = (role_id) => {
        switch (role_id) {
            case 1:
                return { label: 'Admin', className: 'bg-rose-700 text-rose-700' };
            case 2:
                return { label: 'Editor', className: 'bg-violet-700 text-violet-700' };
            default:
                return { label: '', className: '' };
        }
    };
    return (
        <section className="bg-white py-8 lg:py-16 antialiased">
            <div className="max-w-2xl mx-auto px-4">
                <form className="mb-6">
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                        <label htmlFor="comment" className="sr-only">Komentar Anda</label>
                        <textarea
                            onChange={(e) => setKomentar(e.target.value)}
                            id="comment"
                            rows="6"
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                            placeholder="Tulis komentar anda..."
                            required
                        >
                        </textarea>
                        {error && <div className="text-[#B45454] text-xs mt-1">{error}</div>}
                    </div>
                    <button onClick={submit}
                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-lime-600 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800">
                        {loading ? <ButtonSpinner /> : "Kirim Komentar"}
                    </button>
                </form>

                {comments.map((c, index) => (
                    <div key={index}>
                        <article className="p-6 mb-3 text-base bg-white border-t border-gray-200">
                            <footer className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
                                        <Image
                                            className="mr-2 w-6 h-6 rounded-full"
                                            width={6}
                                            height={6}
                                            src={c.user.foto}
                                            alt="Bonnie Green" />
                                        {c.user.username}
                                    </p>
                                    <p className="text-sm text-gray-600"><span><FormatDate timestamp={c.dibuat_pada} /></span></p>
                                    {c.user.role_id !== 3 && (
                                        <p className={`inline-flex rounded-full bg-opacity-10 ml-2 px-2 py-1 text-sm font-medium ${getRoleLabel(c.user.role_id).className}`}>
                                            {getRoleLabel(c.user.role_id).label}
                                        </p>
                                    )}
                                </div>
                            </footer>
                            <p className="text-gray-500">
                                {c.komentar}
                            </p>
                            <div className="flex items-center mt-4 space-x-4">
                                <button
                                    type="button"
                                    className={`flex items-center text-sm ${c.komentarLike.length > 0 ? 'text-[#CD5D5D]' : 'text-gray-500'} hover:underline font-medium`}
                                    onClick={() => toggleLike(c.id, c.komentarLike.length > 0)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="mr-1.5 w-3.5 h-3.5 bi bi-heart" viewBox="0 0 20 18">
                                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                    </svg>
                                    {c.komentarLike.length > 0 ? 'Disukai' : 'Suka'} ({c.komentarLikeCount})
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center text-sm text-gray-500 hover:underline font-medium"
                                    onClick={() => toggleReply(c.id)}
                                >
                                    <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                                    </svg>
                                    Balas
                                </button>
                            </div>
                            {replyCommentId === c.id && (
                                <form className="ml-6 mb-6" onSubmit={(e) => submitReply(e, c.id)}>
                                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                                        <label htmlFor="reply" className="sr-only">Balasan Anda</label>
                                        <textarea
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            id="reply"
                                            rows="3"
                                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                                            placeholder="Tulis balasan anda..."
                                            value={replyContent}
                                            required
                                        />
                                        {error && <div className="text-[#B45454] text-xs mt-1">{error}</div>}
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-lime-600 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
                                    >
                                        {loading ? <ButtonSpinner /> : "Kirim Balasan"}
                                    </button>
                                </form>
                            )}
                        </article>
                        {c.balasKomentar && c.balasKomentar.map((reply, replyIndex) => (
                            <article key={replyIndex} className="p-6 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg">
                                <footer className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
                                            <Image className="mr-2 w-6 h-6 rounded-full" width={6} height={6} src={reply.user.foto} alt="User" />
                                            {reply.user.username}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span><FormatDate timestamp={reply.dibuat_pada} /></span>
                                        </p>
                                        {reply.user.role_id !== 3 && (
                                            <p className={`inline-flex rounded-full bg-opacity-10 ml-2 px-3 py-1 text-sm font-medium ${getRoleLabel(reply.user.role_id).className}`}>
                                                {getRoleLabel(reply.user.role_id).label}
                                            </p>
                                        )}
                                    </div>
                                </footer>
                                <p className="text-gray-500">{reply.reply}</p>
                                <div className="flex items-center mt-4 space-x-4">
                                    <button
                                        type="button"
                                        className={`flex items-center text-sm ${reply.komentarBalasLike.length > 0 ? 'text-[#CD5D5D]' : 'text-gray-500'} hover:underline font-medium`}
                                        onClick={() => toggleLikeReply(reply.id, reply.komentarBalasLike.length > 0)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="mr-1.5 w-3.5 h-3.5 bi bi-heart" viewBox="0 0 20 18">
                                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                        </svg>
                                        {reply.komentarBalasLike.length > 0 ? 'Disukai' : 'Suka'} ({reply.komentarBalasLikeCount})
                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center text-sm text-gray-500 hover:underline   font-medium"
                                        onClick={() => toggleReply(c.id, reply.user.namaLengkap)}
                                    >
                                        <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                                        </svg>
                                        Balas
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    )
}

// export default Komentar;