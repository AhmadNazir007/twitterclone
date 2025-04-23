// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export const fetchPosts = async () => {
//   const res = await fetch(`${API_URL}/posts`);
//   return res.json();
// };

// export const createPost = async (postData: { title: string; content: string }, token: string) => {
//   const res = await fetch(`${API_URL}/posts`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     },
//     body: JSON.stringify(postData)
//   });
//   return res.json();
// };

// export const likePost = async (postId: number, token: string) => {
//   const res = await fetch(`${API_URL}/posts/${postId}/like`, {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   });
//   return res.json();
// };