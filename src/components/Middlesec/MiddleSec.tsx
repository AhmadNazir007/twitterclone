'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { mid } from '../../json/MidSec';
import { AppIcons } from '@/app/assets';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartFilled } from '@heroicons/react/24/solid';

interface Post {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	likes: {
		id: string;
		user: {
			id: string;
		};
	}[];
	likesCount: number;
	comments: {
		id: string;
		content: string;
		author: {
			id: string;
			username: string;
		};
		createdAt: string;
	}[];
	commentsCount: number;
	author: {
		_id: string;
		username: string;
		avatar?: string;
	};
}

const MiddleSec = () => {
	const [postData, setPostData] = useState({
		title: '',
		content: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [posts, setPosts] = useState<Post[]>([]);
	const [editingPostId, setEditingPostId] = useState<string | null>(null);
	const [editData, setEditData] = useState({
		title: '',
		content: '',
	});
	const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
		{},
	);
	const [expandedComments, setExpandedComments] = useState<
		Record<string, boolean>
	>({});

	// Fetch posts on component mount
	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Failed to fetch posts');
			}

			const data = await response.json();
			setPosts(data);
		} catch (error) {
			console.error('Error fetching posts:', error);
			toast.error('Failed to load posts');
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setPostData((prev) => ({ ...prev, [name]: value }));
	};

	const handleEditInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setEditData((prev) => ({ ...prev, [name]: value }));
	};

	const handleCommentInputChange = (postId: string, value: string) => {
		setCommentInputs((prev) => ({ ...prev, [postId]: value }));
	};

	const toggleComments = (postId: string) => {
		setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
	};

	const handleCreatePost = async (e: React.MouseEvent) => {
		e.preventDefault();

		if (!postData.title.trim() || !postData.content.trim()) {
			toast.error('Both title and content are required');
			return;
		}

		const token = localStorage.getItem('token');
		if (!token) {
			toast.error('You must be logged in to post');
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(postData),
				credentials: 'include',
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to create post');
			}

			toast.success('Post created successfully!');
			setPostData({ title: '', content: '' });
			fetchPosts(); // Refresh the posts list
		} catch (error: unknown) {
			let errorMessage = 'An unexpected error occurred';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			toast.error(errorMessage);
			console.error('Post creation error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeletePost = async (postId: string) => {
		const token = localStorage.getItem('token');
		if (!token) {
			toast.error('You must be logged in to delete posts');
			return;
		}
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
					},
					credentials: 'include',
				},
			);

			if (!response.ok) {
				throw new Error('Failed to delete post');
			}

			toast.success('Post deleted successfully');
			fetchPosts(); // Refresh the posts list
		} catch (error) {
			console.error('Error deleting post:', error);
			toast.error('Failed to delete post');
		}
	};

	const handleLikePost = async (postId: string) => {
		const token = localStorage.getItem('token');
		if (!token) {
			toast.error('You must be logged in to like posts');
			return;
		}

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					credentials: 'include',
				},
			);
			const data = await response.json();
			console.log('likedResponse', data);

			if (!response.ok) {
				throw new Error('Failed to toggle like');
			}

			setPosts((prevPosts) =>
				prevPosts.map((post) => {
					if (post.id === postId) {
						const newLikesCount = data.liked
							? post.likesCount + 1
							: post.likesCount - 1;

						return {
							...post,
							likedByUser: data.liked,
							likesCount: newLikesCount,
						};
					}
					return post;
				}),
			);
		} catch (error) {
			console.error('Error toggling like:', error);
			toast.error('Failed to toggle like');
		}
	};

	const handleAddComment = async (postId: string) => {
		const token = localStorage.getItem('token');
		if (!token) {
			toast.error('You must be logged in to comment');
			return;
		}

		const content = commentInputs[postId]?.trim();
		if (!content) {
			toast.error('Comment cannot be empty');
			return;
		}

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ content }),
					credentials: 'include',
				},
			);

			if (!response.ok) {
				throw new Error('Failed to add comment');
			}

			const newComment = await response.json();

			console.log(newComment);

			setCommentInputs((prev) => ({ ...prev, [postId]: '' }));

			setPosts((prevPosts) =>
				prevPosts.map((post) => {
					if (post.id === postId) {
						return {
							...post,
							comments: [...(post.comments || []), newComment],
						};
					}
					return post;
				}),
			);

			// fetchPosts(); // Refresh the posts list
		} catch (error) {
			console.error('Error adding comment:', error);
			toast.error('Failed to add comment');
		}
	};

	const startEditing = (post: Post) => {
		setEditingPostId(post.id);
		setEditData({
			title: post.title,
			content: post.content,
		});
	};

	const cancelEditing = () => {
		setEditingPostId(null);
		setEditData({ title: '', content: '' });
	};

	const handleUpdatePost = async (postId: string) => {
		if (!editData.title.trim() || !editData.content.trim()) {
			toast.error('Both title and content are required');
			return;
		}

		const token = localStorage.getItem('token');
		if (!token) {
			toast.error('You must be logged in to update posts');
			return;
		}

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(editData),
					credentials: 'include',
				},
			);

			if (!response.ok) {
				throw new Error('Failed to update post');
			}

			toast.success('Post updated successfully');
			setEditingPostId(null);
			fetchPosts(); // Refresh the posts list
		} catch (error) {
			console.error('Error updating post:', error);
			toast.error('Failed to update post');
		}
	};

	return (
		<div className=''>
			{/* Header Section */}
			<div className='border border-dark7 p-4 flex justify-between'>
				<p className='text-h2 font-sfcompactM font-bold'>{mid.name}</p>
				<Image src={mid.image} alt='Top tweet' width={23} height={21} />
			</div>

			{/* Post Creation Section */}
			<div className='border border-dark7'>
				<div className='my-[10px] mx-[15px]'>
					<div className='flex items-start'>
						<Image
							src={AppIcons.avatar_medium}
							alt='User avatar'
							width={49}
							height={49}
							className='mt-1 rounded-full'
						/>

						<div className='ml-3 flex-1'>
							<input
								name='title'
								placeholder='Title'
								className='w-full outline-none bg-transparent font-medium mb-2'
								value={postData.title}
								onChange={handleInputChange}
								disabled={isLoading}
							/>
							<textarea
								name='content'
								placeholder="What's happening?"
								className='w-full outline-none bg-transparent resize-none'
								rows={3}
								value={postData.content}
								onChange={handleInputChange}
								disabled={isLoading}
							/>
						</div>
					</div>

					<div className='flex mt-4'>
						<div className='flex gap-2 ml-14'>
							<Image src={AppIcons.media} alt='Media' width={24} height={20} />
							<Image src={AppIcons.gif} alt='GIF' width={24} height={20} />
							<Image src={AppIcons.poll} alt='Poll' width={24} height={20} />
							<Image src={AppIcons.emoji} alt='Emoji' width={24} height={20} />
							<Image
								src={AppIcons.schedule}
								alt='Schedule'
								width={24}
								height={24}
							/>
						</div>

						<div className='ml-64'>
							<button
								onClick={handleCreatePost}
								disabled={
									!postData.title.trim() ||
									!postData.content.trim() ||
									isLoading
								}
								className={`py-2 px-4 text-center font-sfcompactM text-h4 rounded-full text-white
                  ${
										!postData.title.trim() ||
										!postData.content.trim() ||
										isLoading
											? 'bg-blue-400 cursor-not-allowed'
											: 'bg-primary_blue hover:bg-blue-600'
									}`}>
								{isLoading ? 'Posting...' : 'Tweet'}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Posts Display Section */}
			<div className='mt-8'>
				<h2 className='text-h2 font-sfcompactM font-bold mb-4 px-4'>
					Recent Posts
				</h2>

				{posts.length === 0 ? (
					<p className='px-4 text-gray-500'>
						No posts yet. Be the first to post!
					</p>
				) : (
					<div className='space-y-4'>
						{posts.map((post) => (
							<div key={post.id} className='border border-dark7 p-4 rounded-lg'>
								{editingPostId === post.id ? (
									<div className='mb-4'>
										<input
											name='title'
											value={editData.title}
											onChange={handleEditInputChange}
											className='w-full outline-none bg-transparent font-medium mb-2 border-b border-gray-300'
										/>
										<textarea
											name='content'
											value={editData.content}
											onChange={handleEditInputChange}
											className='w-full outline-none bg-transparent resize-none border-b border-gray-300'
											rows={3}
										/>
										<div className='flex justify-end mt-2 space-x-2'>
											<button
												onClick={cancelEditing}
												className='px-3 py-1 bg-gray-300 rounded hover:bg-gray-400'>
												Cancel
											</button>
											<button
												onClick={() => handleUpdatePost(post.id)}
												className='px-3 py-1 bg-primary_blue text-white rounded hover:bg-blue-600'>
												Save
											</button>
										</div>
									</div>
								) : (
									<>
										<div className='flex items-start'>
											<Image
												src={AppIcons.avatar_medium}
												alt='User avatar'
												width={40}
												height={40}
												className='rounded-full mr-3'
											/>
											<div>
												<h3 className='font-bold'>{post.author.username}</h3>
												<p className='text-gray-500 text-sm'>
													{new Date(post.createdAt).toLocaleString()}
												</p>
											</div>
										</div>
										<div className='mt-2 pl-12'>
											<h4 className='font-semibold'>{post.title}</h4>
											<p className='mt-1'>{post.content}</p>
										</div>
										{/* Like and Comment Buttons */}
										<div className='flex items-center mt-4 pl-12 space-x-4'>
											<button
												onClick={() => handleLikePost(post.id)}
												className='flex items-center space-x-1 text-gray-500 hover:text-red-500'>
												{post.likes && post.likes.length > 0 ? (
													<HeartFilled className='h-5 w-5 text-red-500' />
												) : (
													<HeartIcon className='h-5 w-5' />
												)}
												<span>{post.likesCount || 0}</span>
											</button>

											<button
												onClick={() => toggleComments(post.id)}
												className='flex items-center space-x-1 text-gray-500 hover:text-blue-500'>
												<ChatBubbleLeftIcon className='h-5 w-5' />
												<span>{post.commentsCount || 0}</span>
											</button>
										</div>
										{/* Comments Section */}
										{expandedComments[post.id] && (
											<div className='mt-4 pl-12'>
												{/* Add Comment */}
												<div className='flex items-center mb-4'>
													<input
														type='text'
														value={commentInputs[post.id] || ''}
														onChange={(e) =>
															handleCommentInputChange(post.id, e.target.value)
														}
														placeholder='Add a comment...'
														className='flex-1 border rounded-l px-3 py-2 outline-none'
														onKeyPress={(e) =>
															e.key === 'Enter' && handleAddComment(post.id)
														}
													/>
													<button
														onClick={() => handleAddComment(post.id)}
														className='bg-primary_blue text-white px-4 py-2 rounded-r'>
														Post
													</button>
												</div>

												{/* Comments List */}
												{post.comments && post.comments.length > 0 ? (
													<div className='space-y-3'>
														{post.comments.map((comment) => (
															<div key={comment.id} className='border-t pt-3'>
																<div className='flex items-center space-x-2'>
																	<span className='font-medium'>
																		{comment.author.username}
																	</span>
																	<span className='text-xs text-gray-500'>
																		{new Date(
																			comment.createdAt,
																		).toLocaleString()}
																	</span>
																</div>
																<p className='mt-1'>{comment.content}</p>
															</div>
														))}
													</div>
												) : (
													<p className='text-gray-500 text-sm'>
														No comments yet
													</p>
												)}
											</div>
										)}
										<div className='flex justify-end mt-2 space-x-2'>
											<button
												onClick={() => startEditing(post)}
												className='px-2 py-1 text-sm bg-yellow-100 rounded hover:bg-yellow-200'>
												Edit
											</button>
											<button
												onClick={() => handleDeletePost(post.id)}
												className='px-2 py-1 text-sm bg-red-100 rounded hover:bg-red-200'>
												Delete
											</button>
										</div>
									</>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default MiddleSec;
