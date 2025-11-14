import { useState, useEffect, useCallback, useRef } from 'react';
import { postService, PostFeedDTO, FeedRequestParams } from '../services/postService';

interface UseFeedReturn {
  posts: PostFeedDTO[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  updatePost: (postId: string, updates: Partial<PostFeedDTO>) => void; 
}

export function useFeed(pageSize: number = 10): UseFeedReturn {
  const [posts, setPosts] = useState<PostFeedDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const lastPostIdRef = useRef<string | undefined>(undefined);
  const lastScoreRef = useRef<number | undefined>(undefined);

  const loadingRef = useRef(false);

  const loadInitial = useCallback(async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const params: FeedRequestParams = { pageSize };
      const response = await postService.getFeed(params);

      setPosts(response.posts);
      setHasMore(response.hasMore);

      // Atualiza refs para próxima página
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
  }, [pageSize]);

  /**
   * Carrega a próxima página do feed
   */
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
      };

      const response = await postService.getFeed(params);

      // Adiciona novos posts aos existentes
      setPosts((prev) => [...prev, ...response.posts]);
      setHasMore(response.hasMore);

      // Atualiza refs para próxima página
      lastPostIdRef.current = response.lastPostId;
      lastScoreRef.current = response.lastScore;
    } catch (err: any) {
      console.error('Erro ao carregar mais posts:', err);
      setError(err.message || 'Erro ao carregar mais posts');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [hasMore, pageSize]);

  const refresh = useCallback(() => {
    lastPostIdRef.current = undefined;
    lastScoreRef.current = undefined;
    setPosts([]);
    setHasMore(true);
    loadInitial();
  }, [loadInitial]);

  const updatePost = useCallback((postId: string, updates: Partial<PostFeedDTO>) => {
    console.log(postId)
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id == postId) {
            return { ...post, ...updates };
        }
        console.log(post)
        return post;
      })
    );
  }, []);

  // Carrega feed inicial ao montar o componente
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    updatePost, // ← NOVO: Expõe função de atualização
  };
}