/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react';
import { postService, PostFeedDTO, FeedRequestParams } from '../services/postService';

export type OrderByOption = 'RELEVANCE' | 'UPVOTES_DESC' | 'UPVOTES_ASC' | 'DATE_DESC' | 'DATE_ASC';

interface UseFeedReturn {
  posts: PostFeedDTO[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  orderBy: OrderByOption;
  loadMore: () => void;
  refresh: () => void;
  updatePost: (postId: string, updates: Partial<PostFeedDTO>) => void;
  setOrderBy: (order: OrderByOption) => void;
}

export function useFeed(pageSize: number = 10): UseFeedReturn {
  const [posts, setPosts] = useState<PostFeedDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [orderBy, setOrderByState] = useState<OrderByOption>('RELEVANCE');

  const lastPostIdRef = useRef<string | undefined>(undefined);
  const lastScoreRef = useRef<number | undefined>(undefined);

  const loadingRef = useRef(false);

  const loadInitial = useCallback(
    async (currentOrderBy: OrderByOption) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const params: FeedRequestParams = {
          pageSize,
          orderBy: currentOrderBy,
        };
        const response = await postService.getFeed(params);

        setPosts(response.posts);
        setHasMore(response.hasMore);

        lastPostIdRef.current = response.lastPostId;
        lastScoreRef.current = response.lastScore;
      } catch (err: any) {
        console.error('Erro ao carregar feed:', err);
        setError(err.message || 'Erro ao carregar posts');
        setHasMore(false);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [pageSize]
  );

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const params: FeedRequestParams = {
        pageSize,
        lastPostId: lastPostIdRef.current,
        lastScore: lastScoreRef.current,
        orderBy,
      };

      const response = await postService.getFeed(params);

      setPosts((prev) => [...prev, ...response.posts]);
      setHasMore(response.hasMore);

      lastPostIdRef.current = response.lastPostId;
      lastScoreRef.current = response.lastScore;
    } catch (err: any) {
      console.error('Erro ao carregar mais posts:', err);
      setError(err.message || 'Erro ao carregar mais posts');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [hasMore, pageSize, orderBy]);

  const refresh = useCallback(() => {
    lastPostIdRef.current = undefined;
    lastScoreRef.current = undefined;
    setPosts([]);
    setHasMore(true);
    loadInitial(orderBy);
  }, [loadInitial, orderBy]);

  const updatePost = useCallback((postId: string, updates: Partial<PostFeedDTO>) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {      
        if (post.id == postId) {
          return { ...post, ...updates };
        }
        return post;
      })
    );
  }, []);

  const setOrderBy = useCallback(
    (newOrderBy: OrderByOption) => {
      setOrderByState(newOrderBy);
      lastPostIdRef.current = undefined;
      lastScoreRef.current = undefined;
      setPosts([]);
      setHasMore(true);
      loadInitial(newOrderBy);
    },
    [loadInitial]
  );

  useEffect(() => {
    loadInitial(orderBy);
  }, []);

  return {
    posts,
    loading,
    error,
    hasMore,
    orderBy,
    loadMore,
    refresh,
    updatePost,
    setOrderBy,
  };
}
