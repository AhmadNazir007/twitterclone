'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  PlusIcon,
  XMarkIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import type { RootState } from '../../../store';
import {
  getConversations,
  getMessages,
  sendMessage,
  findOrCreateConversation,
  type Conversation,
  type Message,
} from '../../services/message.service';
import { getFollowing, getFollowSuggestions, type PublicUser } from '../../services/user.service';
import { AppIcons } from '@/app/assets';

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUserIdParam = searchParams.get('userId');

  const { token, user: currentUser } = useSelector((state: RootState) => state.auth);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingConvs, setIsLoadingConvs] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Modal for starting new conversation
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [followingUsers, setFollowingUsers] = useState<PublicUser[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<PublicUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load conversations list
  const loadConversations = async (selectId?: string) => {
    if (!token) return;
    try {
      const data = await getConversations();
      setConversations(data);
      if (selectId) {
        const found = data.find((c) => c.id === selectId);
        if (found) setActiveConversation(found);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
      toast.error('Could not load conversations');
    } finally {
      setIsLoadingConvs(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [token]);

  // Load users for new chat modal
  useEffect(() => {
    if (isNewChatModalOpen && currentUser) {
      const currentId = currentUser.id || currentUser._id;
      if (currentId) {
        getFollowing(currentId)
          .then((users) => setFollowingUsers(users))
          .catch((e) => console.error('Failed to fetch following users:', e));
      }
      getFollowSuggestions()
        .then((users) => setSuggestedUsers(users))
        .catch((e) => console.error('Failed to fetch suggestions:', e));
    }
  }, [isNewChatModalOpen, currentUser]);

  // Handle URL search parameter `userId`
  useEffect(() => {
    if (targetUserIdParam && token && conversations.length >= 0) {
      const handleParamUser = async () => {
        try {
          setIsLoadingMessages(true);
          const conv = await findOrCreateConversation(targetUserIdParam);
          // Refresh list and select this conversation
          await loadConversations(conv.id);
          setActiveConversation(conv);
          // Clear query param so it doesn't trigger repeatedly
          router.replace('/messages');
        } catch (err) {
          console.error('Error starting conversation from param:', err);
          toast.error('Could not start conversation');
        } finally {
          setIsLoadingMessages(false);
        }
      };
      handleParamUser();
    }
  }, [targetUserIdParam, token]);

  // Establish socket connection and register listener
  useEffect(() => {
    if (!token || !process.env.NEXT_PUBLIC_API_URL) return undefined;
    if (process.env.NEXT_PUBLIC_ENABLE_SOCKET?.toLowerCase() === 'false') return undefined;

    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to Messages WebSocket');
    });

    socket.on('new_message', (message: Message & { conversationId: string }) => {
      // If message is for currently active conversation, append it
      if (activeConversation && message.conversationId === activeConversation.id) {
        setMessages((prev) => {
          // Check if message already exists (prevent duplicate rendering from optimistic updates)
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }

      // Update conversations list dynamically or reload
      setConversations((prevConvs) => {
        const index = prevConvs.findIndex((c) => c.id === message.conversationId);
        if (index > -1) {
          const updatedConvs = [...prevConvs];
          updatedConvs[index] = {
            ...updatedConvs[index],
            lastMessage: {
              id: message.id,
              content: message.content,
              createdAt: message.createdAt,
              senderId: message.sender.id || message.sender._id || '',
            },
            updatedAt: new Date().toISOString(),
          };
          // Sort by updatedAt DESC
          return updatedConvs.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          );
        } else {
          // Re-fetch conversations if it's a completely new one
          loadConversations();
          return prevConvs;
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [token, activeConversation?.id]);

  // Load message history when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const fetchHistory = async () => {
      setIsLoadingMessages(true);
      try {
        const data = await getMessages(activeConversation.id);
        setMessages(data);
      } catch (err) {
        console.error('Failed to load messages:', err);
        toast.error('Could not load messages history');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchHistory();
  }, [activeConversation?.id]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingMessages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const textToSend = newMessage.trim();
    setNewMessage('');

    // Optimistic UI update (optional, but let's append directly for speed)
    try {
      const sentMsg = await sendMessage(activeConversation.id, textToSend);
      setMessages((prev) => {
        if (prev.some((m) => m.id === sentMsg.id)) return prev;
        return [...prev, sentMsg];
      });

      // Update conversation's last message locally
      setConversations((prevConvs) => {
        const updated = prevConvs.map((c) => {
          if (c.id === activeConversation.id) {
            return {
              ...c,
              lastMessage: {
                id: sentMsg.id,
                content: sentMsg.content,
                createdAt: sentMsg.createdAt,
                senderId: sentMsg.sender.id,
              },
              updatedAt: sentMsg.createdAt,
            };
          }
          return c;
        });
        return updated.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      toast.error('Message failed to send');
    }
  };

  const handleStartConversation = async (userId: string | number) => {
    setIsNewChatModalOpen(false);
    setIsLoadingMessages(true);
    try {
      const conv = await findOrCreateConversation(userId);
      await loadConversations(conv.id);
      setActiveConversation(conv);
    } catch (err) {
      console.error('Failed to start chat:', err);
      toast.error('Failed to start chat');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Filter users in modal
  const getFilteredModalUsers = () => {
    const combined = [
      ...followingUsers,
      ...suggestedUsers.filter((su) => !followingUsers.some((fu) => fu.id === su.id)),
    ];

    if (!searchQuery.trim()) return combined;

    const query = searchQuery.toLowerCase();
    return combined.filter(
      (u) =>
        u.name?.toLowerCase().includes(query) ||
        u.username?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query),
    );
  };

  const formatMessageTime = (dateStr: string) => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatConvTime = (dateStr: string) => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);

    if (diffHrs < 24) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffHrs < 48) {
      return 'Yesterday';
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white border-l border-r border-slate-200">
      {/* LEFT SIDEBAR: Conversations List */}
      <div
        className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-200 ${
          activeConversation ? 'hidden md:flex' : 'flex'
        }`}
      >
        <header className="px-4 py-4 border-b border-slate-200 bg-white/90 backdrop-blur flex justify-between items-center shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">Inbox</p>
            <h1 className="text-2xl font-black text-slate-950">Messages</h1>
          </div>
          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600 hover:bg-teal-100 hover:text-teal-700 transition"
            title="New message"
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {isLoadingConvs ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mb-2"></div>
              <p className="text-sm">Loading chats...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <ChatBubbleLeftRightIcon className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-lg font-black text-slate-950">No messages yet</h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Connect with others by starting a conversation. Click the plus button above.
              </p>
              <button
                onClick={() => setIsNewChatModalOpen(true)}
                className="mt-5 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700 transition shadow"
              >
                Send a message
              </button>
            </div>
          ) : (
            conversations.map((conv) => {
              const displayName = conv.otherUser.name || conv.otherUser.username || conv.otherUser.email || 'Pulse User';
              const userHandle = conv.otherUser.username ? `@${conv.otherUser.username}` : '';
              const isActive = activeConversation?.id === conv.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full flex items-start gap-3 p-4 text-left transition ${
                    isActive ? 'bg-teal-50/60 border-l-4 border-teal-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative h-11 w-11 shrink-0 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                    {conv.otherUser.avatarUrl ? (
                      <img
                        src={conv.otherUser.avatarUrl}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="h-full w-full text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-baseline gap-1">
                      <h3 className="font-bold text-slate-900 truncate text-sm">{displayName}</h3>
                      {conv.lastMessage && (
                        <span className="text-xs text-slate-400 shrink-0">
                          {formatConvTime(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    {userHandle && <p className="text-xs text-slate-400 truncate mb-1">{userHandle}</p>}
                    <p className={`text-sm truncate ${isActive ? 'text-slate-700' : 'text-slate-500'}`}>
                      {conv.lastMessage ? conv.lastMessage.content : 'No messages yet'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT CHAT AREA: Message Box */}
      <div
        className={`flex-1 flex flex-col h-full bg-slate-50 ${
          !activeConversation ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <header className="h-16 px-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConversation(null)}
                  className="md:hidden p-2 rounded-full text-slate-500 hover:bg-slate-100 transition mr-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <div
                  className="relative h-10 w-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/profile/${activeConversation.otherUser.id || activeConversation.otherUser._id}`,
                    )
                  }
                >
                  {activeConversation.otherUser.avatarUrl ? (
                    <img
                      src={activeConversation.otherUser.avatarUrl}
                      alt={
                        activeConversation.otherUser.name ||
                        activeConversation.otherUser.username ||
                        'User'
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-full w-full text-slate-400" />
                  )}
                </div>
                <div>
                  <h2
                    onClick={() =>
                      router.push(
                        `/profile/${activeConversation.otherUser.id || activeConversation.otherUser._id}`,
                      )
                    }
                    className="font-black text-slate-900 text-sm hover:underline cursor-pointer"
                  >
                    {activeConversation.otherUser.name ||
                      activeConversation.otherUser.username ||
                      activeConversation.otherUser.email}
                  </h2>
                  {activeConversation.otherUser.username && (
                    <p className="text-xs text-slate-500">@{activeConversation.otherUser.username}</p>
                  )}
                </div>
              </div>
            </header>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoadingMessages ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mb-2"></div>
                  <p className="text-sm">Loading message history...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 max-w-sm mx-auto text-center">
                  <div className="p-3 bg-teal-50 rounded-2xl text-teal-600 mb-3">
                    <ChatBubbleLeftRightIcon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Say hello!</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Send a message to start the conversation with{' '}
                    {activeConversation.otherUser.name || 'this user'}.
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  const senderId = message.sender.id || message.sender._id;
                  const currentId = currentUser?.id || currentUser?._id;
                  const isMe = String(senderId) === String(currentId);

                  return (
                    <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
                            isMe
                              ? 'bg-teal-600 text-white rounded-tr-none'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <span
                          className={`text-[10px] text-slate-400 block mt-1 px-1 ${
                            isMe ? 'text-right' : 'text-left'
                          }`}
                        >
                          {formatMessageTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-4 bg-white border-t border-slate-200 flex items-center gap-3 shrink-0"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Start a new message..."
                maxLength={1000}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-teal-500 rounded-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white hover:bg-teal-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shrink-0"
              >
                <PaperAirplaneIcon className="h-5 w-5 rotate-0" />
              </button>
            </form>
          </>
        ) : (
          /* Empty Chat Area */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
            <div className="max-w-md">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-50 text-teal-600 ring-4 ring-teal-50 shadow-inner">
                <ChatBubbleLeftRightIcon className="h-10 w-10" />
              </div>
              <h2 className="mt-8 text-2xl font-black text-slate-950">Select a message</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Choose from your existing conversations, start a new one, or click on a user's profile to
                send them a direct message.
              </p>
              <button
                onClick={() => setIsNewChatModalOpen(true)}
                className="mt-6 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700 transition shadow"
              >
                New Conversation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* NEW CHAT MODAL */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[80vh]">
            <header className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-950">New Message</h2>
              <button
                onClick={() => {
                  setIsNewChatModalOpen(false);
                  setSearchQuery('');
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </header>

            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-2xl text-sm focus:outline-none focus:bg-white transition"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <p className="text-xs font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                Suggested & Contacts
              </p>
              {getFilteredModalUsers().length === 0 ? (
                <p className="text-sm text-slate-500 px-3 py-4 text-center">No users found</p>
              ) : (
                getFilteredModalUsers().map((u) => {
                  const currentId = currentUser?.id || currentUser?._id;
                  const isMe = String(u.id || u._id) === String(currentId);
                  if (isMe) return null;

                  const displayName = u.name || u.username || u.email || 'Pulse User';
                  const userHandle = u.username ? `@${u.username}` : u.email;

                  return (
                    <button
                      key={u.id || u._id}
                      onClick={() => handleStartConversation(u.id || u._id || '')}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition text-left"
                    >
                      <div className="relative h-10 w-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserCircleIcon className="h-full w-full text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 truncate text-sm">{displayName}</p>
                        <p className="text-xs text-slate-400 truncate">{userHandle}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
