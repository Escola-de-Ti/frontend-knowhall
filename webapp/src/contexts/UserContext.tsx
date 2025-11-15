import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMyUser, type UsuarioDTO } from '../services/perfil.service';

interface UserContextData {
    user: UsuarioDTO | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    updateUserTokens: (tokens: number) => void;
    clearUser: () => void;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<UsuarioDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const token = localStorage.getItem('kh_access_token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const userData = await getMyUser();
            setUser(userData);
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const refreshUser = async () => {
        await loadUser();
    };

    const updateUserTokens = (tokens: number) => {
        if (user) {
        setUser({ ...user, qntdToken: tokens });
        }
    };

    const clearUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loading, refreshUser, updateUserTokens, clearUser }}>
        {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser deve ser usado dentro de um UserProvider');
    }
    return context;
}
